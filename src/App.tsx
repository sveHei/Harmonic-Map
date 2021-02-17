import React from 'react';
import MidiPort from './components/ControlBar';
//import HarmonicMap from './components/HarmonicMap';
import HarmonicMapOpt from './icons/HarmonicMapOpt';

type EmptyProps = {};
type AppState = { access: Promise<WebMidi.MIDIAccess> };

class App extends React.Component<EmptyProps, AppState> {
  constructor(props: EmptyProps) {
    super(props);
    this.state = { access: navigator.requestMIDIAccess() };
  }
  render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          Harmonic Map
        </header>
        <MidiPort
          access={this.state.access} />
        <HarmonicMapOpt />
      </div>
    )
  }
}


export default App;
