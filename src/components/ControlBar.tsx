import {useEffect, useState} from 'react';
import WebMidi from 'webmidi';

export const MidiPort = ({onSelectedInput, webMidiStatus, access} : PortProps) => {
  const webMidiInitialized = webMidiStatus === "initialized";
  const [availableInputs, setAvailableInputs] = useState<Array<PortDefinition>>([])
  const [availableOutputs, setAvailableOutputs] = useState<Array<PortDefinition>>([])
  
  function generateAvailableOutputs(): Array<PortDefinition> {
    let outputs = []
    for (const output of WebMidi.outputs) {
      outputs.push({"id": output.id, "name": output.name});
    }
    return outputs;
  }

  function generateAvailableInputs(): Array<PortDefinition>{
    let inputs = []
    for (const input of WebMidi.inputs) {
      inputs.push({"id": input.id, "name": input.name});
    }
    return inputs;
  }

  useEffect(() => {
    console.log(webMidiStatus)
    if (webMidiInitialized) {
      setAvailableInputs(generateAvailableInputs())
      setAvailableOutputs(generateAvailableOutputs())
    }
  }, [webMidiInitialized])


  if (webMidiStatus === 'initializing') {
      return <div>Initializing...</div>
    } else if (webMidiStatus === "error") {
      return <div>There was an error!</div>
    } else {
      let availableInputsArr = [];
      for (const input of availableInputs){
        availableInputsArr.push(<option key={input.id} value={input.id}>{input.name}</option>)
      }
      let availableOutputsArr = [];
      for (const output of availableOutputs){
        availableOutputsArr.push(<option key={output.id} value={output.id}>{output.name}</option>)
      }
    return (
      <div>
        <select onChange={onSelectedInput}>
          <option id="inputs" key="inital_input">-- inputs --</option>
          {/* {this.state.availableInputs} */}
          {availableInputsArr}
        </select>
        <select>
          <option id='outputs' key="initial_output">-- outputs --</option>
          {availableOutputsArr}
          {/* {this.state.availableOutputs} */}
        </select>
      </div>
    );
  }
}
