import React from 'react';
import WebMidi from 'webmidi';

export type WebMidiStatus = "initializing"|"initialized"|"error";

type PortProps = {
  access: Promise<WebMidi.MIDIAccess>;
  onSelectedInput: (a: React.ChangeEvent<HTMLSelectElement>) => void;
  webMidiStatus: WebMidiStatus;
};
type PortDefinition = {id: string, name: string};
type PortState = {
  availableOutputs: Array<PortDefinition>;
  availableInputs: Array<PortDefinition>;
};

class MidiPort extends React.Component<PortProps, PortState> {
  constructor(props: PortProps) {
    super(props);
    const webMidiInitialized = this.props.webMidiStatus === "initialized";
    const availableInputs = webMidiInitialized ? this.generateAvailableInputs() : [];
    const availableOutputs = webMidiInitialized ? this.generateAvailableOutputs() : [];
    this.state = {
      availableOutputs: availableOutputs,
      availableInputs: availableInputs,
    };
    //this.onSelectedInput = this.onSelectedInput.bind(this);
  }

  // TODO: Refresh on new device plugged in

  componentDidUpdate(prevProps: PortProps): void {
    if (prevProps.webMidiStatus === "initializing"){
      console.log("webMidiStatus initializing")
      const webMidiInitialized = this.props.webMidiStatus === "initialized";
      const availableInputs = webMidiInitialized ? this.generateAvailableInputs() : [];
      const availableOutputs = webMidiInitialized ? this.generateAvailableOutputs() : [];
      this.setState({availableOutputs, availableInputs});
    }
  }

  generateAvailableOutputs(): Array<PortDefinition> {
    let outputs = []
    for (const output of WebMidi.outputs) {
      outputs.push({"id": output.id, "name": output.name});
    }
    return outputs;
  }

  generateAvailableInputs(): Array<PortDefinition> {
    let inputs = []
    for (const input of WebMidi.inputs) {
      inputs.push({"id": input.id, "name": input.name});
    }
    return inputs;
  }

  componentDidMount() {
    // this.generatePort(this.props.access);
  }

  setInputEventHandler(midiAccess: WebMidi.MIDIAccess, midiId: string) {
    let selectedInput = midiAccess.inputs.get(midiId);
    selectedInput!.onmidimessage = this.onMIDIMessage;
  }

  onMIDIMessage(e: WebMidi.MIDIMessageEvent) {
    this.logMidiInfo(e);
    var inputNote = e.data;
    var transposedNote = [inputNote[0], inputNote[1] + 12, inputNote[2]];
  }

  logMidiInfo(e: WebMidi.MIDIMessageEvent) {
    var str = "MIDI message received at timestamp " + e.timeStamp + "[" + e.data.length + " bytes]: ";
    for (var i = 0; i < e.data.length; i++) {
      str += e.data[i].toString(10) + " ";
    }
    console.log(str);
  }


  render(): JSX.Element {
    if (this.props.webMidiStatus === "initializing") {
      return <div>Initializing...</div>
    } else if (this.props.webMidiStatus === "error") {
      return <div>There was an error!</div>
    } else {
      let availableInputs = [];
      for (const input of this.state.availableInputs){
        availableInputs.push(<option key={input.id} value={input.id}>{input.name}</option>)
      }
      let availableOutputs = [];
      for (const output of this.state.availableOutputs){
        availableOutputs.push(<option key={output.id} value={output.id}>{output.name}</option>)
      }
      return (
        <div>
        <select onChange={this.props.onSelectedInput}>
          <option id="inputs" key="inital_input">-- inputs --</option>
          {/* {this.state.availableInputs} */}
          {availableInputs}
        </select>

        <select>
          <option id='outputs' key="initial_output">-- outputs --</option>
          {availableOutputs}
          {/* {this.state.availableOutputs} */}
        </select>
      </div>
      );
    }
  }
}

export default MidiPort;