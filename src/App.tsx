import React, { useEffect, useRef, useState } from 'react';
import { WebMidi } from 'webmidi';
//@ts-ignore
import { EventEmitter } from 'djipevents';
import _ from 'lodash';
import { MidiPort } from './components/ControlBar';
import { HarmonicMap } from './components/HarmonicMap';
import { harmonicInfo, numMidiNotes, byField, generateCorrections, noteToChannel, eqTmpNamePosition, PlayingNotes, getMajorTonicNoteOffset, MapStage, adaptMessagetoChannel } from "./harmonicInfo";
import { TunningInfo } from './components/TunningInfo';
import { Col, Container, Row } from 'react-bootstrap';
import { Presets } from './components/Presets';
import { ViewOptions } from './components/ViewOptions';

const PITCH_RANGE = 48;

function usePrevious<t>(value: t): t | undefined {
  const ref = useRef<t>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


// Using global variable as we need to read it outside of the React state
// lifecycle, always from the same reference, on the WebMidi listeners
let selectedOutput: string;


type PressedKeysState = PlayingNotes;
interface SelectedState {
  selectedNotes: Set<string>
};

interface InputState {
  selected_input?: string,
}

export type MajorTonicState = Note;
export type ViewBaseNote = boolean;

const App = () => {
  const [pressedState, setPressedState] = useState<PressedKeysState>({});
  const pressedRef = useRef(pressedState);
  pressedRef.current = pressedState;

  const [selectedState, setSelectedState] = useState<SelectedState>({
    selectedNotes: new Set(),
  });
  const selectedRef = useRef(selectedState);
  selectedRef.current = selectedState;

  const [inputState, setInputState] = useState<InputState>({});
  const previousSelectedNotes = usePrevious(selectedState.selectedNotes);


  const [webMidiStatus, setWebMidiStatus] = useState<WebMidiStatus>("initializing")

  const [majorTonicState, setMajorTonicState] = useState<MajorTonicState>(eqTmpNamePosition[0]);
  const majorTonicRef = useRef(majorTonicState);
  majorTonicRef.current = majorTonicState;
  const [viewBaseNoteState, setViewBaseNoteState] = useState<ViewBaseNote>(false);
  const [mapStageState, setMapStageState] = useState<MapStage>("including Modal Interchange");


  useEffect(() => {

    WebMidi.enable().then(() => {
      console.log("WebMidi enabled!");
      setWebMidiStatus("initialized")
    }).catch((err) => {
      console.log("WebMidi could not be enabled.", err);
      setWebMidiStatus("error");
    })

  }, []);


  const onSelectedInput = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    // Cleanup old input
    if (inputState.selected_input) {
      const oldInput = WebMidi.getInputById(inputState.selected_input);
      if (oldInput) {
        oldInput.removeListener('noteon');
        oldInput.removeListener('noteoff');
      }
    }

    const inputId = e.target.value;
    setInputState({
      ...inputState,
      selected_input: inputId,
    });
    const input = WebMidi.getInputById(inputId);

    // Listen for a 'note on' message on all channels
    if (input) {

      // Handle harmonic map visualization of notes
      input.addListener('noteon',
        (e: any) => {
          setPressedState((pressedKeys) => {
            const offset = getMajorTonicNoteOffset(majorTonicRef.current);
            // Module of negative number is negative
            const uniqueNames = byField("midiNote")[(e.note.number - offset + numMidiNotes) % numMidiNotes];
            return { ...pressedKeys, ...{ [e.note.number]: [...uniqueNames.map((e) => e.uniqueName)] } };
          });
        }
      );
      input.addListener('noteoff',
        (e: any) => {
          setPressedState((state) => {
            const pressedKeys = { ...pressedRef.current };
            delete pressedKeys[e.note.number];
            return pressedKeys;
          });
        }
      );

      // Handle forward messages from input to output
      input.addListener('noteon', (event: any) => {
        let output = WebMidi.getOutputById(selectedOutput);
        if (output) {
          sendTuning();
          output.playNote(event.note, { channels: noteToChannel(event.note.number) });
        }
      });

      input.addListener('noteoff', (event: any) => {
        let output = WebMidi.getOutputById(selectedOutput);
        if (output) {
          output.stopNote(event.note, { channels: noteToChannel(event.note.number) });
        }
      });

      input.addListener('noteoff', (event: any) => {
        let output = WebMidi.getOutputById(selectedOutput);
        if (output) {
          output.stopNote(event.note, { channels: noteToChannel(event.note.number) });
        }
      });

      //@ts-ignore

      input.addListener(EventEmitter.ANY_EVENT, (ev: any) => {

        // Skip NoteOn, NoteOff and PitchBend events
        if (ev.message.type === "noteon" || ev.message.type === "noteoff" || ev.message.type === "pitchbend") {
          return
        }
        let output = WebMidi.getOutputById(selectedOutput);
        if (output) {
          // Dispatch system messages
          if (ev.message.isSystemMessage) {
            console.log(ev);
            output.send(ev.message);
          }

          // Dispatch channel messages
          if (ev.message.isChannelMessage) {
            let rawData = Uint8Array.from(ev.message.rawData);
            // Most control change messages require to go on the master zone (channel 1) channel
            // Some can go on the notes channel but are not required and all we have seen make sense to send to master
            // This was added to support piano pedals
            if (ev.message.type === "controlchange") {
              output.send(adaptMessagetoChannel(rawData, 1));
            } else {
              for (let i = 0; i < numMidiNotes; i++) {
                console.log(ev);
                output.send(adaptMessagetoChannel(rawData, noteToChannel(i)));
              }
            }
          }
        }
      });
    }
  }

  const onSelectedOutput = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    // Cleanup old sounding notes in previous output
    let oldOutput = WebMidi.getOutputById(selectedOutput);
    oldOutput && oldOutput.sendStop();

    selectedOutput = e.target.value;
    sendPitchBendRange();
    sendTuning();
  }

  const sendPitchBendRange = () => {
    let output = WebMidi.getOutputById(selectedOutput);
    if (output) {
      for (let i = 0; i < numMidiNotes; i++) {
        // TODO: Testing with Abbleton Live this doesn't seem to be working right. Setting it to the MPE default for now.
        // output.setPitchBendRange(PITCH_RANGE * 2, 0, noteToChannel(i));
      }
    }
  }

  const sendTuning = () => {
    // Rely note to output
    let output = WebMidi.getOutputById(selectedOutput);
    if (output) {
      let corrections = generateCorrections(selectedRef.current.selectedNotes, majorTonicRef.current);
      console.log(corrections);
      for (const [midiNote, correction] of corrections.entries()) {
        output.sendPitchBend(((correction ?? 0) / 100) / PITCH_RANGE, { channels: noteToChannel(midiNote) });
      }
    }
  }

  const onClickNote = (note: string) => {
    console.log(note);
    setSelectedState((state) => {
      let set = new Set(state.selectedNotes);
      if (set.has(note)) {
        set.delete(note);
      } else {
        set.add(note);
        let harmonicNote = harmonicInfo.find(info => note === info.uniqueName)
        harmonicInfo.forEach(({ uniqueName, midiNote }) => {
          if (midiNote === harmonicNote?.midiNote && note !== uniqueName) { set.delete(uniqueName); }
        });
      }
      return { ...state, selectedNotes: set }
    })
  }

  const onSelectedPreset = (preset: string[]) => {
    setSelectedState({ selectedNotes: new Set(preset) });
  }

  // const onResetTuning = () => onSelectedPreset([]);

  if (webMidiStatus === "initialized" && !_.isEqual(previousSelectedNotes, selectedRef.current.selectedNotes)) {
    sendTuning();
  }

  return (
    <div className="App">
      {/* <header className="App-header">
        Harmonic Map
      </header> */}
      <Container fluid>
        <Row className="justify-content-md-center"><Col ><h1 className="text-center">Harmonic Map</h1></Col></Row>
        <Row className="justify-content-md-center">
          <Col lg={4} style={{ maxWidth: "400px" }} className="pr-1">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Controls</h4>
                <MidiPort
                  onSelectedInput={onSelectedInput}
                  onSelectedOutput={onSelectedOutput}
                  webMidiStatus={webMidiStatus}
                  selectedNotes={selectedState.selectedNotes}
                />
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <h4 className="card-title">View options</h4>
                <ViewOptions
                  mapStage={mapStageState}
                  onStageMapChange={setMapStageState}
                  majorTonic={majorTonicState}
                  onSelectMajorTonicNoteChange={setMajorTonicState}
                  viewBaseNote={viewBaseNoteState}
                  onViewBaseNoteChange={setViewBaseNoteState} />
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <h4 className="card-title">Tuning info</h4>
                <TunningInfo selected={selectedState.selectedNotes} majorTonic={majorTonicState} />
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <h4 className="card-title">Tuning presets</h4>
                <Presets selected={selectedState.selectedNotes}
                  onSelectedPreset={onSelectedPreset} />
              </div>
            </div>
          </Col>
          <Col lg={6} xl={4}>
            <div className="d-flex justify-content-md-center">
              <HarmonicMap
                playingNotes={pressedState}
                onClickNote={onClickNote}
                selected={selectedState.selectedNotes}
                majorTonic={majorTonicState}
                viewBaseNote={viewBaseNoteState}
                mapStage={mapStageState}
              />
            </div>
          </Col>

        </Row>
      </Container>


    </div >
  )

}

export default App
