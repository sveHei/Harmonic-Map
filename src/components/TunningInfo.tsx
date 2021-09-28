// import { Button } from "react-bootstrap";
import { byField, generateCorrections } from "../harmonicInfo";

type TunerProps = { selected: Set<string>, majorTonic: Note };
export const TunningInfo = ({ selected, majorTonic }: TunerProps) => {
    let byMidiNote = byField("midiNote");

    const tuningInfo = generateCorrections(selected, majorTonic).map((correction, midiNote) => {
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

    // const resetTuning = () => {

    // }

    return <div>
        <ul>
            {tuningInfo}
        </ul>
        {/* <Button onClick={resetTuning}>Reset tuning</Button> */}
    </div>;

}