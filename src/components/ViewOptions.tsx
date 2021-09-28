import { Col, Form, FormGroup, Row } from 'react-bootstrap';
import { eqTmpNamePosition, MapStage, MapStageDefinition } from '../harmonicInfo';


type ViewOptionsProps = {
  mapStage: MapStage,
  onStageMapChange: (mapStage: MapStage) => void,
  viewBaseNote: boolean,
  onViewBaseNoteChange: (baseNote: boolean) => void,
  majorTonic: Note,
  onSelectMajorTonicNoteChange: (note: Note) => void
   };

export const ViewOptions = ({ mapStage, onStageMapChange, viewBaseNote, onViewBaseNoteChange, majorTonic, onSelectMajorTonicNoteChange}: ViewOptionsProps) => {

  const onViewBaseNote = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onViewBaseNoteChange(e.target.checked);
  }


  const onSelectedMajorTonic = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onSelectMajorTonicNoteChange(e.target.value as Note);
  }

  const onSelectMapStage = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onStageMapChange(e.target.value as MapStage);
  }

  const selectableNotes = eqTmpNamePosition.map((note) => <option key={note} value={note}>{note}</option>)
  const viewOptions = Object.keys(MapStageDefinition).map((k) => <option key={k} value={k}>{k}</option>)
  return (
    <div>
      <Form>
        <fieldset>
          <FormGroup as={Row}>
            <Form.Label column lg={6} htmlFor="selectMapStage">Map Stage:</Form.Label>
            <Col>
              <Form.Select name="selectMapStage" aria-label="Select map stage" value={mapStage} onChange={onSelectMapStage}>
                {viewOptions}
              </Form.Select>
            </Col>
          </FormGroup>
          <FormGroup as={Row} className="mt-2">
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
            <Form.Check type="switch" label="Show bass note" onChange={onViewBaseNote} />
          </FormGroup>
        </fieldset>
      </Form>
    </div>
  );
}
