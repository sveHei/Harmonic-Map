import React, { useEffect, useRef, useState } from 'react';
import WebMidi from 'webmidi';
import _ from 'lodash';
import { MidiPort } from './components/ControlBar';
import { HarmonicMap } from './components/HarmonicMap';
import { harmonicInfo, numMidiNotes, byField, generateCorrections, noteToChannel, eqTmpNamePosition, PlayingNotes, getMajorTonicNoteOffset } from "./harmonicInfo";
import { TunningInfo } from './components/TunningInfo';
import { Col, Container, Row } from 'react-bootstrap';
import { Presets } from './components/Presets';

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
type MajorTonicState = Note;
interface SelectedState {
  selectedNotes: Set<string>
};

interface InputState {
  selected_input?: string,
}

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

  const [majorTonicState, setMajorTonicState] = useState<MajorTonicState>(eqTmpNamePosition[0]);
  const majorTonicRef = useRef(majorTonicState);
  majorTonicRef.current = majorTonicState;

  const [webMidiStatus, setWebMidiStatus] = useState<WebMidiStatus>("initializing")

  useEffect(() => {

    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
        setWebMidiStatus("error");
      }
      else {
        console.log("WebMidi enabled!");
        setWebMidiStatus("initialized")
      }
    })

  }, [])


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
      input.addListener('noteon', "all",
        (e) => {
          setPressedState((pressedKeys) => {
            const offset = getMajorTonicNoteOffset(majorTonicRef.current);
            // Module of negative number is negative
            const uniqueNames = byField("midiNote")[(e.note.number - offset + numMidiNotes) % numMidiNotes];
            return { ...pressedKeys, ...{ [e.note.number]: [...uniqueNames.map((e) => e.uniqueName)] } };
          });
        }
      );
      input.addListener('noteoff', "all",
        (e) => {
          setPressedState((state) => {
            const pressedKeys = { ...pressedRef.current };
            delete pressedKeys[e.note.number];
            return pressedKeys;
          });
        }
      );

      input.addListener('noteon', 'all', (event) => {
        let output = WebMidi.getOutputById(selectedOutput);
        if (output) {
          sendTuning();
          const playNote = event.note.number;
          output.playNote(playNote, noteToChannel(event.note.number), { velocity: event.velocity });
        }
      });

      input.addListener('noteoff', 'all', (event) => {
        let output = WebMidi.getOutputById(selectedOutput);
        if (output) {
          const stopNote = event.note.number;
          output.stopNote(stopNote, noteToChannel(event.note.number));
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

  const onSelectedMajorTonic = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setMajorTonicState(e.target.value as Note);
  }

  const sendPitchBendRange = () => {
    let output = WebMidi.getOutputById(selectedOutput);
    if (output) {
      for (let i = 0; i < numMidiNotes; i++) {
        // TODO: Testing with Abbleton Live this doesn't seem to be working right. Setting it to the MPE default for now.
        output.setPitchBendRange(PITCH_RANGE * 2, 0, noteToChannel(i));
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
        output.sendPitchBend(((correction ?? 0) / 100) / PITCH_RANGE, noteToChannel(midiNote));
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
                  onSelectMajorTonicNote={onSelectedMajorTonic}
                  webMidiStatus={webMidiStatus}
                  selectedNotes={selectedState.selectedNotes}
                />
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
                <h4 className="card-title">Scales</h4>
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
                majorTonic={majorTonicState} />
            </div>
          </Col>

        </Row>
      </Container>


    </div >
  )

}

export default App
