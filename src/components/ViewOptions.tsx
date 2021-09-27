import { Col, Form, FormGroup, Row } from 'react-bootstrap';
import { MapStage } from '../App';
import { eqTmpNamePosition } from '../harmonicInfo';


type ViewOptionsProps = {
  mapStage: MapStage,
  onStateMapChange: (mapStage: MapStage) => void,
  viewBaseNote: boolean,
  onViewBaseNoteChange: (baseNote: boolean) => void,
  majorTonic: Note,
  onSelectMajorTonicNoteChange: (note: Note) => void
   };

export const ViewOptions = ({ mapStage, onStateMapChange, viewBaseNote, onViewBaseNoteChange, majorTonic, onSelectMajorTonicNoteChange}: ViewOptionsProps) => {

  const onViewBaseNote = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onViewBaseNoteChange(e.target.checked);
  }


  const onSelectedMajorTonic = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onSelectMajorTonicNoteChange(e.target.value as Note);
  }
  const selectableNotes = eqTmpNamePosition.map((note) => <option key={note} value={note}>{note}</option>)

  return (
    <div>
      <Form>
        <fieldset>
          <FormGroup as={Row}>
            <Form.Label column lg={6} htmlFor="selectNote">Major tonic (do):</Form.Label>
            <Col>
              <Form.Select name="selectNote" aria-label="Select output" onChange={onSelectedMajorTonic}>
                {selectableNotes}
              </Form.Select>
            </Col>
          </FormGroup>
        </fieldset>
        <fieldset className="mt-2">
          <FormGroup>
            <Form.Check type="switch" label="Show base note" onChange={onViewBaseNote} />
          </FormGroup>
        </fieldset>
      </Form>
    </div>
  );
}
