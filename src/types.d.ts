type Notes = Array<Note>

interface AppState {
  selected_input?: string,
  pressedKeys: { [key: number]: Note },
  selectedNotes: Set<String>
};

type Note =
  "D" |
  "G" |
  "B" |
  "Ab" |
  "C" |
  "E" |
  "G#" |
  "F" |
  "A";

type WebMidiStatus = "initializing" | "initialized" | "error";

type PortProps = {
  onSelectedInput: (a: React.ChangeEvent<HTMLSelectElement>) => void;
  webMidiStatus: WebMidiStatus;
};

type PortDefinition = { id: string, name: string };

interface MidiInterfaceProps {
  webMidiStatus: WebMidiStatus;
  availableOutputs: Array<PortDefinition>;
  availableInputs: Array<PortDefinition>;
}