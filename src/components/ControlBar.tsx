import React from 'react';


type PortProps = {
  access: Promise<WebMidi.MIDIAccess>;
};

type PortState = {
  availableOutputs: Array<JSX.Element>;
  availableInputs: Array<JSX.Element>;
};

class MidiPort extends React.Component<PortProps, PortState> {
  constructor(props: PortProps) {
    super(props);
    this.state = {
      availableOutputs: [],
      availableInputs: [],
    };
    this.onSelectedInput = this.onSelectedInput.bind(this);
  }

  componentDidMount() {
    this.generatePort(this.props.access);
  }
  // 
  generatePort(midiAccess: Promise<WebMidi.MIDIAccess>) {
    midiAccess.then((access: WebMidi.MIDIAccess) => {
      var outputs: Array<JSX.Element> = [];
      for (const [outputId, output] of access.outputs) {
        outputs.push(<option key={outputId} value={outputId}>{output["name"]}</option>);
      }
      this.setState({ availableOutputs: outputs });
      
      var inputs: Array<JSX.Element> = [];
      for (const [inputId, input] of access.inputs) {
        inputs.push(<option key={inputId} value={inputId}>{input["name"]}</option>);
        console.log(input);
      }
      this.setState({ availableInputs: inputs });
      
    });
  }

  onSelectedInput(e: React.ChangeEvent<HTMLSelectElement>): void {
    console.log(e);
  }


  render(): JSX.Element {
    return (
      <div>
        <select onChange={this.onSelectedInput}>
          <option id="inputs" key="inital_input">-- inputs --</option>
          {this.state.availableInputs}
        </select>

        <select>
          <option id='outputs' key="initial_output">-- outputs --</option>
          {this.state.availableOutputs}
        </select>
      </div>
    );
  }
}

export default MidiPort;