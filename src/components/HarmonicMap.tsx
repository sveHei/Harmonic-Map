import React, { MouseEvent } from 'react'
import HarmonicMapOpt2 from '../icons/Harmonic_map_complete_simple'; // Generated with https://svg2jsx.com/

type Coord = [number, number];

type HarmonicEntry = {
  eqTmpName: Note,
  uniqueName: string, // TODO: Change to specific type
  svgId: string,
  midiNote: number,
  coords: Coord,
  pitchCorrection: number,
}

type HarmonicInfo = Array<HarmonicEntry>

export const numMidiNotes = 12;

export const harmonicInfo: HarmonicInfo = [
  { uniqueName: "ra1", eqTmpName: "Db", svgId: "note_-2_-3", midiNote: 61 % 12, coords: [-2, -3], pitchCorrection: 50 - 16 },
  { uniqueName: "fa1", eqTmpName: "F", svgId: "note_-1_-3", midiNote: 65 % 12, coords: [-1, -3], pitchCorrection: 36 - 16 },
  { uniqueName: "la1", eqTmpName: "A", svgId: "note_0_-3", midiNote: 69 % 12, coords: [0, -3], pitchCorrection: 22 - 16 },
  { uniqueName: "di1", eqTmpName: "C#", svgId: "note_1_-3", midiNote: 61 % 12, coords: [1, -3], pitchCorrection: 8 - 16 },
  { uniqueName: "sa1", eqTmpName: "Gb", svgId: "note_-2_-2", midiNote: 66 % 12, coords: [-2, -2], pitchCorrection: 48 - 16 },
  { uniqueName: "ta1", eqTmpName: "Bb", svgId: "note_-1_-2", midiNote: 70 % 12, coords: [-1, -2], pitchCorrection: 34 - 16 },
  { uniqueName: "re1", eqTmpName: "D", svgId: "note_0_-2", midiNote: 62 % 12, coords: [0, -2], pitchCorrection: 20 - 16 },
  { uniqueName: "fi1", eqTmpName: "F#", svgId: "note_1_-2", midiNote: 66 % 12, coords: [1, -2], pitchCorrection: 6 - 16 },
  { uniqueName: "li1", eqTmpName: "A#", svgId: "note_2_-2", midiNote: 70 % 12, coords: [2, -2], pitchCorrection: -8 - 16 },
  { uniqueName: "ma1", eqTmpName: "Eb", svgId: "note_-1_-1", midiNote: 63 % 12, coords: [-1, -1], pitchCorrection: 32 - 16 },
  { uniqueName: "so1", eqTmpName: "G", svgId: "note_0_-1", midiNote: 67 % 12, coords: [0, -1], pitchCorrection: 18 - 16 },
  { uniqueName: "ti1", eqTmpName: "B", svgId: "note_1_-1", midiNote: 71 % 12, coords: [1, -1], pitchCorrection: 4 - 16 },
  { uniqueName: "ri1", eqTmpName: "D#", svgId: "note_2_-1", midiNote: 63 % 12, coords: [2, -1], pitchCorrection: -10 - 16 },
  { uniqueName: "lo1", eqTmpName: "Ab", svgId: "note_-1_0", midiNote: 68 % 12, coords: [-1, 0], pitchCorrection: 30 - 16 },
  { uniqueName: "do1", eqTmpName: "C", svgId: "note_0_0", midiNote: 60 % 12, coords: [0, 0], pitchCorrection: 16 - 16 },
  { uniqueName: "mi1", eqTmpName: "E", svgId: "note_1_0", midiNote: 64 % 12, coords: [1, 0], pitchCorrection: 2 - 16 },
  { uniqueName: "si1", eqTmpName: "G#", svgId: "note_2_0", midiNote: 68 % 12, coords: [2, 0], pitchCorrection: -12 - 16 },
  { uniqueName: "ra2", eqTmpName: "Db", svgId: "note_-1_1", midiNote: 61 % 12, coords: [-1, 1], pitchCorrection: 28 - 16 },
  { uniqueName: "fa2", eqTmpName: "F", svgId: "note_0_1", midiNote: 65 % 12, coords: [0, 1], pitchCorrection: 14 - 16 },
  { uniqueName: "la2", eqTmpName: "A", svgId: "note_1_1", midiNote: 69 % 12, coords: [1, 1], pitchCorrection: 0 - 16 },
  { uniqueName: "di2", eqTmpName: "C#", svgId: "note_2_1", midiNote: 61 % 12, coords: [2, 1], pitchCorrection: -14 - 16 },
  { uniqueName: "sa2", eqTmpName: "Gb", svgId: "note_-1_2", midiNote: 66 % 12, coords: [-1, 2], pitchCorrection: 26 - 16 },
  { uniqueName: "ta2", eqTmpName: "Bb", svgId: "note_0_2", midiNote: 70 % 12, coords: [0, 2], pitchCorrection: 12 - 16 },
  { uniqueName: "re2", eqTmpName: "D", svgId: "note_1_2", midiNote: 62 % 12, coords: [1, 2], pitchCorrection: -2 - 16 },
  { uniqueName: "fi2", eqTmpName: "F#", svgId: "note_2_2", midiNote: 66 % 12, coords: [2, 2], pitchCorrection: -14 - 16 },
  { uniqueName: "li2", eqTmpName: "A#", svgId: "note_3_2", midiNote: 70 % 12, coords: [3, 2], pitchCorrection: 30 - 16 },
  { uniqueName: "ma2", eqTmpName: "Eb", svgId: "note_0_3", midiNote: 63 % 12, coords: [0, 3], pitchCorrection: 10 - 16 },
  { uniqueName: "so2", eqTmpName: "G", svgId: "note_1_3", midiNote: 67 % 12, coords: [1, 3], pitchCorrection: -4 - 16 },
  { uniqueName: "ti2", eqTmpName: "B", svgId: "note_2_3", midiNote: 71 % 12, coords: [2, 3], pitchCorrection: -18 - 16 },
  { uniqueName: "ri2", eqTmpName: "D#", svgId: "note_3_3", midiNote: 63 % 12, coords: [3, 3], pitchCorrection: 32 - 16 },
]

export const eqTmpNamePosition = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

type groupBy = { [key: string]: Array<HarmonicEntry> }

export function byField(field: keyof Omit<HarmonicEntry, "coords">): groupBy {
  return harmonicInfo.reduce<groupBy>((groups, item) => ({
    ...groups,
    [item[field]]: [...(groups[item[field]] || []), item]
  }), {});
}

export let allEqTmpNames = new Set(harmonicInfo.map((el) => el.eqTmpName));

export let byUniqueName: { [key: string]: HarmonicEntry } = {}
for (let note of harmonicInfo) {
  byUniqueName[note.uniqueName] = note;
}

const adj1: Array<Coord> = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const adjDiag: Array<Coord> = [[1, 1], [-1, -1]];
// const adj2: Array<Coord> = [[1, -1], [-1, 1], [0, 2], [2, 0], [0, -2], [-2, 0]]; // Removed the non direct diagonals
const adj2: Array<Coord> = [[0, 2], [2, 0], [0, -2], [-2, 0]];


type Adj = { [key: string]: [string] | [string, string] };

type AdjTableType = { [key: string]: Adj };


function searchByCoord(coord: Coord): HarmonicEntry | undefined {
  return harmonicInfo.find((el) => el.coords[0] === coord[0] && el.coords[1] === coord[1]);
}

function sumCoordinates([x1, y1]: Coord, [x2, y2]: Coord): Coord {
  return [x1 + x2, y1 + y2];
}

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
  function addTwoEdges(origin: HarmonicEntry, target: HarmonicEntry, noteAdj: Adj) {
    const [x1, y1] = origin.coords;
    const [x3, y3] = target.coords;
    const middleCoords: [number, number] = [(x3 - x1) / 2 + x1, (y3 - y1) / 2 + y1]

    const edgeId = getEdgeId(origin.coords, middleCoords);
    const edgeId2 = getEdgeId(middleCoords, target.coords);
    noteAdj[target.uniqueName] = [edgeId, edgeId2];
  }
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
    addAdjacent(adj2, addTwoEdges, origin, noteAdj);
    table[origin.uniqueName] = noteAdj;
  }

  return table;
}

const adjTable = generateAdjTable();

export function noteToChannel(midiNote: number): number {
  let naturalChannel = midiNote % 12 + 1;
  // Channels 10 and 11 are reserved for percussion
  return naturalChannel >= 10 ? naturalChannel + 2 : naturalChannel;
}

export function generateCorrections(selectedNotes: Set<string>) {
  let corrections = new Array(numMidiNotes).fill(null); // Assume no correction
  for (let noteId of selectedNotes) {
    let note = byUniqueName[noteId];
    corrections[note.midiNote] = note.pitchCorrection;
  }
  return corrections;
}


type HarmonicMapProps = {
  highlighted: Array<string>,
  onClickNote: (ev: string) => void,
  selected: Set<string>,
}

export const HarmonicMap = ({ highlighted, onClickNote, selected }: HarmonicMapProps) => {
  let highlightedStyle = "fill-opacity: 0.3;";
  let edgeHighlightedStyle = "stroke-width: 0.8;";
  let selectedStyle = "text-transform: uppercase;";

  // Choose svg ids to hide
  let transparentIds = [];
  for (const note of harmonicInfo) {
    if (!highlighted.includes(note.uniqueName)) {
      transparentIds.push("#" + note.svgId)
    }
  }

  let selectedIds = [];
  for (const note of harmonicInfo) {
    if (selected.has(note.uniqueName)) {
      selectedIds.push("#" + note.svgId)
    }
  }

  let onClickEvent = (ev: MouseEvent) => {
    let composedPath = ev.nativeEvent.composedPath();
    if (composedPath.length <= 1) {
      console.log(`The path to the svg has less than 2 elements ${composedPath}`);
      return
    }
    let elementId = (composedPath[1] as Element).id;

    let entry = harmonicInfo.find((el) => el.svgId === elementId)
    if (entry) {
      onClickNote(entry.uniqueName);
    } else {
      console.log(`No note selected ${elementId}`);
    }
  };

  // const byEqTempName = byField("eqTmpName");
  let highlightedEdges: Array<string> = [];
  let highlightedEntries: Array<string> = [...highlighted];
  // for (const element of highlighted) {
  //   highlightedEntries = [...highlightedEntries, element]
  // }
  for (const [i1, h1] of highlightedEntries.entries()) {
    for (const [i2, h2] of highlightedEntries.entries()) {
      if (i2 > i1) {
        highlightedEdges = [...highlightedEdges, ...(adjTable[h1][h2] ?? [])]
      }
    }
  }

  return (
    <div onClick={onClickEvent}>
      <style>
        {transparentIds.join(", ")} {"{"} {
          highlightedStyle
        } {"}"}
        {highlightedEdges.join(", ")} {"{"} {
          edgeHighlightedStyle
        } {"}"}
        {selectedIds.join(", ")} {"{"} {
          selectedStyle
        } {"}"}
      </style>
      <HarmonicMapOpt2 />
    </div>

  )
}