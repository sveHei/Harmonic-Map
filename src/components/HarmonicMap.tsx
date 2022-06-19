import React, { MouseEvent } from 'react'
import HarmonicMapSvg from '../icons/HarmonicMap'; // Generated with https://svg2jsx.com/
import { harmonicInfo, adjTable, PlayingNotes, byField, byUniqueName, numMidiNotes, getMajorTonicNoteOffset, MapStage, MapStageDefinition, filterByTuning } from '../harmonicInfo';

type HarmonicMapProps = {
  playingNotes: PlayingNotes,
  onClickNote: (ev: string) => void,
  selected: Set<string>,
  majorTonic: Note,
  viewBaseNote: boolean,
  mapStage: MapStage
}

export const HarmonicMap = ({ playingNotes, onClickNote, selected, majorTonic, viewBaseNote, mapStage }: HarmonicMapProps) => {
  let highlightedStyle = "fill-opacity: 0.3;";
  let edgeHighlightedStyle = "stroke-width: 0.8;";
  let selectedStyle = "text-transform: uppercase;";
  let transparentCirclesStyle = "display: none";
  let hiddenStyle = "display: none";

  const highlighted = filterByTuning(MidiToNotes(playingNotes), selected);
  //const playingNotesFiltered = Object.fromEntries(Object.entries(playingNotes).map(([k, v]) => [k, filterByTuning(v, selected)]));

  // Choose svg ids to hide
  let transparentIds = generateTransparentIds(highlighted);
  let transparentCircles = generateTransparentCircles(viewBaseNote ? playingNotes : [], majorTonic, selected);

  // Generate the ids for the selected notes
  let selectedIds = generateSelectedIds(selected);
  const hiddenIds = generateHiddenIds(mapStage);

  let onClickEvent = onClick(onClickNote);

  let highlightedEdges: Array<string> = generateHighlightedEdges(highlighted);

  return (
    <div onClick={onClickEvent}>
      <style>
        {hiddenIds.join(", ")} {"{"} {
          hiddenStyle
        } {"}"}
        {transparentIds.join(", ")} {"{"} {
          highlightedStyle
        } {"}"}
        {transparentCircles.join(", ")} {"{"} {
          transparentCirclesStyle
        } {"}"}
        {highlightedEdges.join(", ")} {"{"} {
          edgeHighlightedStyle
        } {"}"}
        {selectedIds.join(", ")} {"{"} {
          selectedStyle
        } {"}"}
      </style>
      <HarmonicMapSvg />
    </div>

  )
}

function generateHighlightedEdges(highlighted: string[]) {
  let highlightedEdges: Array<string> = [];
  let highlightedEntries: Array<string> = [...highlighted];
  for (const [i1, h1] of highlightedEntries.entries()) {
    for (const [i2, h2] of highlightedEntries.entries()) {
      if (i2 > i1) {
        highlightedEdges = [...highlightedEdges, ...(adjTable[h1][h2] ?? [])];
      }
    }
  }
  return highlightedEdges;
}

function onClick(onClickNote: (ev: string) => void) {
  return (ev: MouseEvent) => {
    let composedPath = ev.nativeEvent.composedPath();
    if (composedPath.length <= 1) {
      console.log(`The path to the svg has less than 2 elements ${composedPath}`);
      return;
    }
    let elementId = (composedPath[1] as Element).id;

    let entry = harmonicInfo.find((el) => el.svgId === elementId);
    if (entry) {
      onClickNote(entry.uniqueName);
    } else {
      console.log(`No note selected ${elementId}`);
    }
  };
}

function generateTransparentIds(highlighted: string[]) {
  let transparentIds = [];
  for (const note of harmonicInfo) {
    if (!highlighted.includes(note.uniqueName)) {
      transparentIds.push("#" + note.svgId);
    }
  }
  return transparentIds;
}

function generateTransparentCircles(playingNotes: PlayingNotes, majorTonic: Note, selected: Set<string>) {
  const offset = getMajorTonicNoteOffset(majorTonic);

  function range(size: number, startAt: number = 0): ReadonlyArray<number> {
    return [...Array(size).keys()].map(i => i + startAt);
  }

  let svgIds: Set<string>;
  if (Object.keys(playingNotes).length > 0) {
    const baseNote = Math.min(...Object.keys(playingNotes).map(i => Number(i) - offset));
    const byMidiNote = byField("midiNote");
    // Ugly conversion, better refactor filterByTuning to avoid the double conversion
    const harmonicEntries = byMidiNote[(baseNote + numMidiNotes) % numMidiNotes];
    const notes = harmonicEntries.map((e) => e.uniqueName);

    svgIds = new Set(filterByTuning(notes, selected).map(e => byUniqueName[e].svgId));
  } else {
    svgIds = new Set();
  }

  let transparentCircles = [];
  for (const i of range(8, -3)) {
    for (const j of range(8, -3)) {
      if (!svgIds.has(`note_${i}_${j}`)) {
        transparentCircles.push(`#c_${i}_${j}`);
      }
    }
  }
  return transparentCircles;
}

function generateSelectedIds(selected: Set<string>) {
  let selectedIds = [];
  for (const note of harmonicInfo) {
    if (selected.has(note.uniqueName)) {
      selectedIds.push("#" + note.svgId);
    }
  }
  return selectedIds;
}

function generateHiddenIds(mapStage: MapStage) {
  return MapStageDefinition[mapStage].map((e) => "#" + e);
}



function MidiToNotes(midiNotes: PlayingNotes): Array<string> {
  let notes: Array<string> = [];
  for (const note in midiNotes) {
    notes = [...notes, ...midiNotes[note]];
  }
  return notes;
}

