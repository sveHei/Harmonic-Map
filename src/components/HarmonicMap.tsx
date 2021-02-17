import React, { Component } from 'react'

export default class HarmonicMap extends Component {
  render() {
    return (
      <div>
        <object type="image/svg+xml" data={process.env.PUBLIC_URL + '/harmonic_map.svg'} className="logo" aria-label="harmonic map" />
      </div>
    )
  }
}

