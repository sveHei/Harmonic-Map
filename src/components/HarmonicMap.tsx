import React, { Component } from 'react';
import HarmonicMapOpt from '../icons/HarmonicMapOpt';

const notesToIds = { "C": ["note_0_0"], "D": ["note_2_1", "note_-2_0"], "E": ["note_0_1"], "F": ["note_1_0"], "G": ["note_-1_0"], "A": ["note_1_1",], "G#": [ "note_2_0","note_0_-1"], "B": ["note_-1_1"] }
export type Note = keyof typeof notesToIds;

type HarmonicMapProps = {
  highlighted: Array<Note>
}
export default class HarmonicMap extends Component<HarmonicMapProps> {
  render() {
    var mapstyle = "fill-opacity: 0";
    console.log(this.props.highlighted);

    // Choose svg ids to hide
    let transparentIds = [];
    for (const [note, svgIds] of Object.entries(notesToIds)) {
       if (!this.props.highlighted.includes(note as Note)) {
      //if (!this.props.highlighted.includes(note)) {
        for (const id of svgIds) {
          transparentIds.push("#" + id)
        }
      }
    }
    let selector = transparentIds.join(", ")

    return (
      <div>
        <style>
          {selector} {"{"} {
            mapstyle
          } {"}"}
        </style>
        <HarmonicMapOpt />
      </div>

    )
  }
}

