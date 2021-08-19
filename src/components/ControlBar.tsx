import { useEffect, useState } from 'react';
import WebMidi from 'webmidi';
import { byField, byUniqueName, generateCorrections } from './HarmonicMap';


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

    let correctedTuning: { [key: string]: number } = {};
    for (let selected of selectedNotes) {
      let info = byUniqueName[selected];
      correctedTuning[info.eqTmpName] = info.pitchCorrection;
    }
    let byMidiNote = byField("midiNote");

    const tuningInfo = generateCorrections(selectedNotes).map((correction, midiNote) => {
      function removeDuplicates(l: Array<any>) {
        return Array.from(new Set(l));
      }
      function showWithSign(num: number) {
        return (num < 0 ? " " : " +") + num
      }
      let tuning = correction !== null ? showWithSign(correction) + " cents" : "";
      const names = removeDuplicates(byMidiNote[midiNote].map((el) => el.eqTmpName)).join("/");
      return <li key={names}> {names} : {"12TET" + tuning} </li>
    });

    return (
      <div style={{ width: 350, "float": "right" }}>
        <select onChange={onSelectedInput}>
          <option id="inputs" key="inital_input">-- inputs --</option>
          {/* {this.state.availableInputs} */}
          {availableInputsArr}
        </select>
        <select onChange={onSelectedOutput}>
          <option id='outputs' key="initial_output">-- outputs --</option>
          {availableOutputsArr}
          {/* {this.state.availableOutputs} */}
        </select>
        <div>
          <h3>Tuning info</h3>
          <ul>
            {tuningInfo}
          </ul>
        </div>
      </div>
    );
  }
}
