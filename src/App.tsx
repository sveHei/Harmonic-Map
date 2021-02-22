import React from 'react';
import WebMidi from 'webmidi';
import MidiPort, { WebMidiStatus } from './components/ControlBar';
import HarmonicMap, { Note } from './components/HarmonicMap';


type EmptyProps = {};

type Notes = Array<Note>

function MidiToNotes (midiNotes: {[key: number]: Note}) : Notes {
  let notes: Notes = [];
  for (const note in midiNotes) {
    notes.push(midiNotes[note]);
  }
  return notes;
}

type AppState = {
  access: Promise<WebMidi.MIDIAccess>,
  webMidiStatus: WebMidiStatus,
  selected_input?: string,
  pressedKeys: {[key: number]: Note}
};

class App extends React.Component<EmptyProps, AppState> {
  _mounted: boolean;

  constructor(props: EmptyProps) {
    super(props);

    // Used to detect a potential race condition between WebMidi and React while mounting the component
    this._mounted = false;

    WebMidi.enable((err) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
        if (this._mounted) {
          this.setState(() => { return { webMidiStatus: "error" }; });
        } else {
          this.state = Object.assign(this.state, { webMidiStatus: "error" });
        }
      }
      else {
        console.log("WebMidi enabled!");
        if (this._mounted) {
          this.setState(() => { return { webMidiStatus: "initialized" }; });
        } else {
          this.state = Object.assign(this.state, { webMidiStatus: "initialized" });
        }
        // this.setState(() => { return {webMidiStatus: "initialized"}; } );
        // this.setState({webMidiStatus: "initialized"});
      }
    });
    this.state = {
      access: navigator.requestMIDIAccess(),
      webMidiStatus: "initializing",
      pressedKeys: {},
    };
  }

  componentDidMount(): void {
    this._mounted = true;
  }

  onSelectedInput(e: React.ChangeEvent<HTMLSelectElement>): void {
    // Cleanup old input
    if (this.state.selected_input) {
      const oldInput = WebMidi.getInputById(this.state.selected_input);
      if (oldInput) {
        oldInput.removeListener('noteon');
        oldInput.removeListener('noteoff');
      }
    }

    const inputId = e.target.value;
    this.setState({ selected_input: inputId });
    const input = WebMidi.getInputById(inputId);


    // Listen for a 'note on' message on all channels
    if (input) {
      input.addListener('noteon', "all",
        (e) => {
          let pressedKeys = Object.assign(this.state.pressedKeys, {[e.note.number]: e.note.name as Note});
          this.setState({pressedKeys});
        }
      );
      input.addListener('noteoff', "all",
         (e) => {
          const pressedKeys = Object.assign(this.state.pressedKeys);
          delete pressedKeys[e.note.number];
          this.setState({pressedKeys});
        }
      );
    }
  }

  render(): JSX.Element {
    const pressedKeys = MidiToNotes (this.state.pressedKeys);
    return (
      <div className="App">
        <header className="App-header">
          Harmonic Map
        </header>
        <MidiPort
          access={this.state.access}
          onSelectedInput={this.onSelectedInput.bind(this)}
          webMidiStatus={this.state.webMidiStatus}
        />
        <HarmonicMap
          highlighted={pressedKeys} />
      </div>
    )
  }
}


export default App;
