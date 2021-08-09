import React, { useEffect, useState } from 'react';
import WebMidi from 'webmidi';
import { MidiPort } from './components/ControlBar';
import { HarmonicMap, harmonicInfo } from './components/HarmonicMap';

function MidiToNotes(midiNotes: { [key: number]: Note }): Notes {
  let notes: Notes = [];
  for (const note in midiNotes) {
    notes.push(midiNotes[note]);
  }
  return notes;
}

const App = () => {

  const [state, setState] = useState<AppState>({
    pressedKeys: {},
    selectedNotes: new Set(),
  })

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
    if (state.selected_input) {
      const oldInput = WebMidi.getInputById(state.selected_input);
      if (oldInput) {
        oldInput.removeListener('noteon');
        oldInput.removeListener('noteoff');
      }
    }

    const inputId = e.target.value;
    setState({
      ...state,
      selected_input: inputId
    });
    const input = WebMidi.getInputById(inputId);

    // Listen for a 'note on' message on all channels
    if (input) {
      input.addListener('noteon', "all",
        (e) => {
          let pressedKeys = Object.assign(state.pressedKeys, { [e.note.number]: e.note.name as Note });
          setState({
            ...state,
            pressedKeys: pressedKeys
          });
        }
      );
      input.addListener('noteoff', "all",
        (e) => {
          const pressedKeys = Object.assign(state.pressedKeys);
          delete pressedKeys[e.note.number];
          setState({
            ...state,
            pressedKeys: pressedKeys
          });
        }
      );
    }
  }

  const onClickNote = (note: String) => {
    console.log(note);
    setState((state) => {
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

  const pressedKeys = MidiToNotes(state.pressedKeys)

  return (
    <div className="App">
      <header className="App-header">
        Harmonic Map
      </header>
      <MidiPort
        onSelectedInput={onSelectedInput}
        webMidiStatus={webMidiStatus}
      />
      <HarmonicMap
        highlighted={pressedKeys}
        onClickNote={onClickNote}
        selected={state.selectedNotes} />
    </div>
  )

}

export default App