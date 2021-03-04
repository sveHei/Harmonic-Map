import React, {useEffect, useState } from 'react';
import WebMidi from 'webmidi';
import { MidiPort } from './components/ControlBar';
import { HarmonicMap } from './components/HarmonicMap';

function MidiToNotes (midiNotes: {[key: number]: Note}) : Notes {
  let notes: Notes = [];
  for (const note in midiNotes) {
    notes.push(midiNotes[note]);
  }
  return notes;
}

const App = () => {

  const [state, setState] = useState<AppState>({
    access: navigator.requestMIDIAccess(),
    webMidiStatus: "initializing",
    pressedKeys: {},
  })

  useEffect(() => {
    WebMidi.enable((err) => { 
      if (err) {
        console.log("WebMidi could not be enabled.", err);
        setState({
          ...state,
          webMidiStatus: "error"
        });
      }
      else {
        console.log("WebMidi enabled!");
        setState({
          ...state,
          webMidiStatus: "initialized"
        });
      }
    })
  }, [state])


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
          let pressedKeys = Object.assign(state.pressedKeys, {[e.note.number]: e.note.name as Note});
          setState({
            ...state,
            pressedKeys: pressedKeys});
        }
      );
      input.addListener('noteoff', "all",
         (e) => {
          const pressedKeys = Object.assign(state.pressedKeys);
          delete pressedKeys[e.note.number];
          setState({
            ...state,
            pressedKeys: pressedKeys});
        }
      );
    }
  }

  const pressedKeys = MidiToNotes(state.pressedKeys)

  return (
    <div className="App">
      <header className="App-header">
        Harmonic Map
      </header>
      <MidiPort
        access={state.access}
        onSelectedInput={onSelectedInput}
        webMidiStatus={state.webMidiStatus}
      />
      <HarmonicMap
        highlighted={pressedKeys} />
    </div>
  )

}

export default App