import _ from "lodash";

export type Coord = [number, number];
export type PlayingNotes = { [key: number]: Array<string> };
export type HarmonicEntry = {
    eqTmpName: Note;
    uniqueName: string; // TODO: Change to specific type
    svgId: string;
    midiNote: number;
    coords: Coord;
    pitchCorrection: number;
};
type HarmonicInfo = Array<HarmonicEntry>;

export const numMidiNotes = 12;

export const harmonicInfo: HarmonicInfo = [
    { uniqueName: "ra1", eqTmpName: "Db", svgId: "note_-2_-3", midiNote: 1, coords: [-2, -3], pitchCorrection: 41 },
    { uniqueName: "fa1", eqTmpName: "F", svgId: "note_-1_-3", midiNote: 5, coords: [-1, -3], pitchCorrection: 27 },
    { uniqueName: "la1", eqTmpName: "A", svgId: "note_0_-3", midiNote: 9, coords: [0, -3], pitchCorrection: 13 },
    { uniqueName: "di1", eqTmpName: "C#", svgId: "note_1_-3", midiNote: 1, coords: [1, -3], pitchCorrection: -1 },
    { uniqueName: "sa1", eqTmpName: "Gb", svgId: "note_-2_-2", midiNote: 6, coords: [-2, -2], pitchCorrection: 39 },
    { uniqueName: "ta1", eqTmpName: "Bb", svgId: "note_-1_-2", midiNote: 10, coords: [-1, -2], pitchCorrection: 25 },
    { uniqueName: "re1", eqTmpName: "D", svgId: "note_0_-2", midiNote: 2, coords: [0, -2], pitchCorrection: 11 },
    { uniqueName: "fi1", eqTmpName: "F#", svgId: "note_1_-2", midiNote: 6, coords: [1, -2], pitchCorrection: -3 },
    { uniqueName: "li1", eqTmpName: "A#", svgId: "note_2_-2", midiNote: 10, coords: [2, -2], pitchCorrection: -17 },
    { uniqueName: "ma1", eqTmpName: "Eb", svgId: "note_-1_-1", midiNote: 3, coords: [-1, -1], pitchCorrection: 23 },
    { uniqueName: "so1", eqTmpName: "G", svgId: "note_0_-1", midiNote: 7, coords: [0, -1], pitchCorrection: 9 },
    { uniqueName: "ti1", eqTmpName: "B", svgId: "note_1_-1", midiNote: 11, coords: [1, -1], pitchCorrection: -5 },
    { uniqueName: "ri1", eqTmpName: "D#", svgId: "note_2_-1", midiNote: 3, coords: [2, -1], pitchCorrection: -19 },
    { uniqueName: "lo1", eqTmpName: "Ab", svgId: "note_-1_0", midiNote: 8, coords: [-1, 0], pitchCorrection: 21 },
    { uniqueName: "do1", eqTmpName: "C", svgId: "note_0_0", midiNote: 0, coords: [0, 0], pitchCorrection: 7 },
    { uniqueName: "mi1", eqTmpName: "E", svgId: "note_1_0", midiNote: 4, coords: [1, 0], pitchCorrection: -7 },
    { uniqueName: "si1", eqTmpName: "G#", svgId: "note_2_0", midiNote: 8, coords: [2, 0], pitchCorrection: -21 },
    { uniqueName: "ra2", eqTmpName: "Db", svgId: "note_-1_1", midiNote: 1, coords: [-1, 1], pitchCorrection: 19 },
    { uniqueName: "fa2", eqTmpName: "F", svgId: "note_0_1", midiNote: 5, coords: [0, 1], pitchCorrection: 5 },
    { uniqueName: "la2", eqTmpName: "A", svgId: "note_1_1", midiNote: 9, coords: [1, 1], pitchCorrection: -9 },
    { uniqueName: "di2", eqTmpName: "C#", svgId: "note_2_1", midiNote: 1, coords: [2, 1], pitchCorrection: -23 },
    { uniqueName: "sa2", eqTmpName: "Gb", svgId: "note_-1_2", midiNote: 6, coords: [-1, 2], pitchCorrection: 17 },
    { uniqueName: "ta2", eqTmpName: "Bb", svgId: "note_0_2", midiNote: 10, coords: [0, 2], pitchCorrection: 3 },
    { uniqueName: "re2", eqTmpName: "D", svgId: "note_1_2", midiNote: 2, coords: [1, 2], pitchCorrection: -11 },
    { uniqueName: "fi2", eqTmpName: "F#", svgId: "note_2_2", midiNote: 6, coords: [2, 2], pitchCorrection: -25 },
    { uniqueName: "li2", eqTmpName: "A#", svgId: "note_3_2", midiNote: 10, coords: [3, 2], pitchCorrection: -39 },
    { uniqueName: "ma2", eqTmpName: "Eb", svgId: "note_0_3", midiNote: 3, coords: [0, 3], pitchCorrection: 1 },
    { uniqueName: "so2", eqTmpName: "G", svgId: "note_1_3", midiNote: 7, coords: [1, 3], pitchCorrection: -13 },
    { uniqueName: "ti2", eqTmpName: "B", svgId: "note_2_3", midiNote: 11, coords: [2, 3], pitchCorrection: -27 },
    { uniqueName: "ri2", eqTmpName: "D#", svgId: "note_3_3", midiNote: 3, coords: [3, 3], pitchCorrection: -41 },
];

export const eqTmpNamePosition: Note[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export type MapStage = "diatonic" | "harmonic minor/major" | "including Modal Interchange" | "including Modal Interchange and second order (sub-)dominants" | "complete";

function removeIds(n1: number, n2: number): string[] {
    let ids = [];
    ids.push(`note_${n1}_${n2}`);
    ids.push(`c_${n1}_${n2}`);
    ids.push(`e_${n1 - 1}_${n2}\\3A ${n1}_${n2}`);
    ids.push(`e_${n1}_${n2 - 1}\\3A ${n1}_${n2}`);
    ids.push(`e_${n1}_${n2}\\3A ${n1 + 1}_${n2}`);
    ids.push(`e_${n1}_${n2}\\3A ${n1}_${n2 + 1}`);
    ids.push(`e_${n1 - 1}_${n2 - 1}\\3A ${n1}_${n2}`);
    ids.push(`e_${n1}_${n2}\\3A ${n1 + 1}_${n2 + 1}`);
    return ids;
}
function rIds(coords: Array<[number, number]>) {
    return _.flatMap(coords.map(([n1, n2]) => removeIds(n1, n2)));
}

export const MapStageDefinition: { [key: string]: Array<string> } = {
    "diatonic": rIds([[-2, -3], [-2, -2], [3, 3], [3, 2], [-1, -3], [0, -3], [1, -3], [0, 3], [1, 3], [2, 3], [-1, 2], [2, -2], [-1, -2], [1, -2], [-1, -1], [2, -1], [2, 1], [2, 2], [0, 2], [-1, 1], [-1, 0], [-1, 1], [2, 0]]),
    "harmonic minor/major": rIds([[-2, -3], [-2, -2], [3, 3], [3, 2], [-1, -3], [0, -3], [1, -3], [0, 3], [1, 3], [2, 3], [-1, 2], [2, -2], [-1, -2], [1, -2], [-1, -1], [2, -1], [2, 1], [2, 2], [0, 2], [-1, 1]]),
    "including Modal Interchange": rIds([[-2, -3], [-2, -2], [3, 3], [3, 2], [-1, -3], [0, -3], [1, -3], [0, 3], [1, 3], [2, 3], [-1, 2], [2, -2]]),
    "including MI and double (sub-)dominants": rIds([[-2, -3], [-2, -2], [3, 3], [3, 2]]),
    "complete": []
}

type groupBy = { [key: string]: Array<HarmonicEntry> }

export function byFieldInner(field: keyof Omit<HarmonicEntry, "coords">): groupBy {
    return harmonicInfo.reduce<groupBy>((groups, item) => ({
        ...groups,
        [item[field]]: [...(groups[item[field]] || []), item]
    }), {});
}

export const byField = _.memoize(byFieldInner);

export let allEqTmpNames = new Set(harmonicInfo.map((el) => el.eqTmpName));

export let byUniqueName: { [key: string]: HarmonicEntry } = {}
for (let note of harmonicInfo) {
    byUniqueName[note.uniqueName] = note;
}

export function searchByCoord(coord: Coord): HarmonicEntry | undefined {
    return harmonicInfo.find((el) => el.coords[0] === coord[0] && el.coords[1] === coord[1]);
}

export function sumCoordinates([x1, y1]: Coord, [x2, y2]: Coord): Coord {
    return [x1 + x2, y1 + y2];
}


export function noteToChannel(midiNote: number): number {
    let naturalChannel = midiNote % 12 + 2;
    // Channels 10 and 11 are reserved for percussion
    return naturalChannel >= 10 ? naturalChannel + 2 : naturalChannel;
}

export function adaptMessagetoChannel(message: Uint8Array, channel: number): Uint8Array {
    message[0] &= 0xf0;
    message[0] |= (channel - 1) & 0x0f;
    return message;
};

export function generateCorrections(selectedNotes: Set<string>, majorTonic: Note) {
    const offset = getMajorTonicNoteOffset(majorTonic);
    let corrections = new Array(numMidiNotes).fill(null); // Assume no correction
    for (let noteId of selectedNotes) {
        let note = byUniqueName[noteId];
        corrections[(note.midiNote + offset) % numMidiNotes] = note.pitchCorrection;
    }
    return corrections;
}


const adj1: Array<Coord> = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const adjDiag: Array<Coord> = [[1, 1], [-1, -1]];
// const adj2: Array<Coord> = [[1, -1], [-1, 1], [0, 2], [2, 0], [0, -2], [-2, 0]]; // Removed the non direct diagonals
// const adj2: Array<Coord> = [[0, 2], [2, 0], [0, -2], [-2, 0]];


type Adj = { [key: string]: [string] | [string, string] };

type AdjTableType = { [key: string]: Adj };

function generateAdjTable(): AdjTableType {
    function getEdgeId([x1, y1]: [number, number], [x2, y2]: [number, number]): string {
        if (x1 > x2 || y1 > y2) {
            [x2, y2, x1, y1] = [x1, y1, x2, y2];
        }
        // \\3A is used to escape : in the ID within CSS. A better solution would be to avoid : on the ids
        return `#e_${x1}_${y1}\\3A ${x2}_${y2}`;
    }

    function addOneEdge(origin: HarmonicEntry, target: HarmonicEntry, noteAdj: Adj) {
        const edgeId = getEdgeId(origin.coords, target.coords);
        noteAdj[target.uniqueName] = [edgeId];
    }
    // function addTwoEdges(origin: HarmonicEntry, target: HarmonicEntry, noteAdj: Adj) {
    //   const [x1, y1] = origin.coords;
    //   const [x3, y3] = target.coords;
    //   const middleCoords: [number, number] = [(x3 - x1) / 2 + x1, (y3 - y1) / 2 + y1]

    //   const edgeId = getEdgeId(origin.coords, middleCoords);
    //   const edgeId2 = getEdgeId(middleCoords, target.coords);
    //   noteAdj[target.uniqueName] = [edgeId, edgeId2];
    // }
    function addAdjacent(adjacence: Array<Coord>, addEdges: (origin: HarmonicEntry, target: HarmonicEntry, noteAdj: Adj) => void, origin: HarmonicEntry, noteAdj: Adj) {
        for (const offset of adjacence) {
            const targetCoords = sumCoordinates(origin.coords, offset);
            const target = searchByCoord(targetCoords);
            if (target !== undefined) {
                addEdges(origin, target, noteAdj);
            }
        }
    }

    let table: AdjTableType = {};
    for (const origin of harmonicInfo) {
        let noteAdj: Adj = {};

        addAdjacent(adj1, addOneEdge, origin, noteAdj);
        addAdjacent(adjDiag, addOneEdge, origin, noteAdj);
        // addAdjacent(adj2, addTwoEdges, origin, noteAdj);
        table[origin.uniqueName] = noteAdj;
    }

    return table;
}

export const adjTable = generateAdjTable();

export function getMajorTonicNoteOffset(majorTonicNote: Note) {
    return eqTmpNamePosition.indexOf(majorTonicNote);
}