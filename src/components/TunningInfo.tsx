import { InfoCircle } from "react-bootstrap-icons";
import { byField, generateCorrections } from "../harmonicInfo";

type TunerProps = { selected: Set<string>, base: Note };
export const TunningInfo = ({ selected, base }: TunerProps) => {
    let byMidiNote = byField("midiNote");

    const tuningInfo = generateCorrections(selected, base).map((correction, midiNote) => {
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

    return <div>
        <ul>
            {tuningInfo}
        </ul>
        <p><InfoCircle /> The lowest midi note is denoted by a circle</p>
    </div>;

}