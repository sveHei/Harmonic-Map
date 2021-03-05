type Notes = Array<Note>

interface AppState {
  access: Promise<WebMidi.MIDIAccess>,
  selected_input?: string,
  pressedKeys: {[key: number]: Note}
};

type Note = keyof typeof notesToIds;

type WebMidiStatus = "initializing"|"initialized"|"error";

type PortProps = {
  access: Promise<WebMidi.MIDIAccess>;
  onSelectedInput: (a: React.ChangeEvent<HTMLSelectElement>) => void;
  webMidiStatus: WebMidiStatus;
};

type PortDefinition = {id: string, name: string};

interface MidiInterfaceProps {
  webMidiStatus: WebMidiStatus;
  availableOutputs: Array<PortDefinition>;
  availableInputs: Array<PortDefinition>;
}