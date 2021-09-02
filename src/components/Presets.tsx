import _ from "lodash"
import { Button } from "react-bootstrap";

type PresetsProps = {
    selected: Set<string>,

    onSelectedPreset: (preset: (string[])) => void;
};

const infoPresets = [
    { name: "default", list: ["so1", "do1", "fa2", "la2", "mi1", "ti1"] },
    { name: "harmonic minor", list: ["so1", "do1", "fa2", "la2", "mi1", "ti1", "si1", "re2"] },
    { name: "harmonic major", list: ["so1", "do1", "fa2", "la2", "mi1", "ti1", "re1", "lo1"] },
    { name: "melodic minor", list: ["so1", "do1", "fa2", "la2", "mi1", "ti1", "re2", "fi2", "si1"] },
    { name: "melodic major", list: ["so1", "do1", "fa2", "la2", "mi1", "ti1", "re1", "ta1", "lo1"] },
]
export const Presets = ({ selected, onSelectedPreset }: PresetsProps) => {
    const buttons = infoPresets.map((p) => {
        const list = p.list;
        const onClick = (ev: React.MouseEvent<HTMLElement>) => {
            onSelectedPreset(list);
        }
        const active = _.isEqual(new Set(p.list), selected);
        const variant = active ? "secondary" : "outline-secondary";
        return <Button variant={variant} onClick={onClick}>{p.name}</Button>
    })
    return <div>
        {buttons}
    </div>;

}