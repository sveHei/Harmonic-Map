import React, { MouseEvent } from 'react'
import HarmonicMapOpt from '../icons/HarmonicMapOpt';

type HarmonicEntry = {
  eqTmpName: Note,
  uniqueName: String,
  svgId: String,
  midiNote: Number,
  coords: [Number, Number],
  pitchCorrection: Number,
}

type HarmonicInfo = Array<HarmonicEntry>

export const harmonicInfo: HarmonicInfo = [
  { uniqueName: "re_so", eqTmpName: "D", svgId: "note_-2_0", midiNote: 62, coords: [0, -2], pitchCorrection: 4 },
  { uniqueName: "so", eqTmpName: "G", svgId: "note_-1_0", midiNote: 67, coords: [0, -1], pitchCorrection: 2 },
  { uniqueName: "ti", eqTmpName: "B", svgId: "note_-1_1", midiNote: 71, coords: [1, -1], pitchCorrection: -12 },
  { uniqueName: "lo", eqTmpName: "Ab", svgId: "note_0_-1", midiNote: 68, coords: [-1, 0], pitchCorrection: 14 },
  { uniqueName: "do", eqTmpName: "C", svgId: "note_0_0", midiNote: 60, coords: [0, 0], pitchCorrection: 0 },
  { uniqueName: "mi", eqTmpName: "E", svgId: "note_0_1", midiNote: 64, coords: [1, 0], pitchCorrection: -14 },
  { uniqueName: "si", eqTmpName: "G#", svgId: "note_2_0", midiNote: 68, coords: [2, 0], pitchCorrection: -28 },
  { uniqueName: "fa", eqTmpName: "F", svgId: "note_1_0", midiNote: 65, coords: [0, 1], pitchCorrection: -2 },
  { uniqueName: "la", eqTmpName: "A", svgId: "note_1_1", midiNote: 69, coords: [1, 1], pitchCorrection: -16 },
  { uniqueName: "re_la", eqTmpName: "D", svgId: "note_2_1", midiNote: 62, coords: [1, 2], pitchCorrection: -18 },
]

type HarmonicMapProps = {
  highlighted: Array<Note>,
  onClickNote: (ev: String) => void,
  selected: Set<String>,
}

export const HarmonicMap = ({ highlighted, onClickNote, selected }: HarmonicMapProps) => {
  let mapstyle = "fill-opacity: 0.3";
  let selectedStyle = "text-transform: uppercase";

  // Choose svg ids to hide
  let transparentIds = [];
  for (const note of harmonicInfo) {
    if (!highlighted.includes(note.eqTmpName)) {
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

  return (
    <div onClick={onClickEvent}>
      <style>
        {transparentIds.join(", ")} {"{"} {
          mapstyle
        } {"}"}
        {selectedIds.join(", ")} {"{"} {
          selectedStyle
        } {"}"}
      </style>
      <HarmonicMapOpt />
    </div>

  )
}