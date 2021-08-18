type Notes = Array<Note>

interface AppState {
  pressedKeys: { [key: number]: Note },
  selectedNotes: Set<string>
};

interface InputState {
  selected_input?: string,
}

type Note =
  "A" |
  "Ab" |
  "A#" |
  "B" |
  "Bb" |
  "C" |
  "C#" |
  "D" |
  "Db" |
  "D#" |
  "E" |
  "Eb" |
  "F" |
  "F#" |
  "G" |
  "Gb" |
  "G#"
  ;

type WebMidiStatus = "initializing" | "initialized" | "error";

type PortProps = {
  onSelectedInput: (a: React.ChangeEvent<HTMLSelectElement>) => void;
  onSelectedOutput: (a: React.ChangeEvent<HTMLSelectElement>) => void;
  webMidiStatus: WebMidiStatus;
  selectedNotes: List<string>;
};

type PortDefinition = { id: string, name: string };

interface MidiInterfaceProps {
  webMidiStatus: WebMidiStatus;
  availableOutputs: Array<PortDefinition>;
  availableInputs: Array<PortDefinition>;
}