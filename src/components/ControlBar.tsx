import { useEffect, useState } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import WebMidi from 'webmidi';


export const MidiPort = ({ onSelectedInput, onSelectedOutput, webMidiStatus, selectedNotes }: PortProps) => {
  const webMidiInitialized = webMidiStatus === "initialized";
  const [availableInputs, setAvailableInputs] = useState<Array<PortDefinition>>([])
  const [availableOutputs, setAvailableOutputs] = useState<Array<PortDefinition>>([])

  function generateAvailableOutputs(): Array<PortDefinition> {
    let outputs = []
    for (const output of WebMidi.outputs) {
      outputs.push({ "id": output.id, "name": output.name });
    }
    return outputs;
  }

  function generateAvailableInputs(): Array<PortDefinition> {
    let inputs = []
    for (const input of WebMidi.inputs) {
      inputs.push({ "id": input.id, "name": input.name });
    }
    return inputs;
  }

  useEffect(() => {
    console.log(webMidiStatus)
    if (webMidiInitialized) {
      setAvailableInputs(generateAvailableInputs())
      setAvailableOutputs(generateAvailableOutputs())
    }
  }, [webMidiInitialized, webMidiStatus])


  if (webMidiStatus === 'initializing') {
    return <div>Initializing...</div>
  } else if (webMidiStatus === "error") {
    return <div>There was an error! Check if your browser supports WebMidi. At the moment of writing this, only Chrome-like browsers support it</div> // TODO: Call out Firefox as not supported
  } else {
    let availableInputsArr = [];
    for (const input of availableInputs) {
      availableInputsArr.push(<option key={input.id} value={input.id}>{input.name}</option>)
    }
    let availableOutputsArr = [];
    for (const output of availableOutputs) {
      availableOutputsArr.push(<option key={output.id} value={output.id}>{output.name}</option>)
    }

    return (
      <div>
        <Form>
          <fieldset>
            <legend>Input</legend>
            <FormGroup className="mb-3">
              <Form.Select aria-label="Select input" onChange={onSelectedInput}>
                <option id="inputs" key="inital_input">-- inputs --</option>
                {/* {this.state.availableInputs} */}
                {availableInputsArr}
              </Form.Select>
            </FormGroup>
          </fieldset>
        </Form>
        <Form>
          <fieldset>
            <legend>Output</legend>
            <FormGroup className="mb-3">
              <Form.Select aria-label="Select output" onChange={onSelectedOutput}>
                <option id='outputs' key="initial_output">-- outputs --</option>
                {availableOutputsArr}
              </Form.Select>
            </FormGroup>
          </fieldset>
        </Form>

      </div>
    );
  }
}
