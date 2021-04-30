# Harmonic-Map

How will this app work and what are its benefits 

In 12-tone equal temperament, all relations between tones are represented by multiples of . Through this “trick”, we can induce many more notes than the 12 that actually sound.

In order to completely understand the harmonic possibilities of 12-tone equal temperament, one has to be aware of the implied relations, the “meant tones”, not the ones that actually sound.

The HARMONIC MAP is a representation of 30 distinct pitches that can be induced through harmonic context:

Perfect fifths (frequency relation of 3:2) are connected by vertical lines

Major thirds (frequency relation of 5:4) are connected by horizontal lines.

All other intervals can be expressed as combinations or inversions of those two.

## The INTERACTIVE HARMONIC MAP will have two different modes:

1. analytical mode: any incoming MIDI-note will be shown on the map on all the possible spots (up to four). This can help to grasp harmonic ambiguities and possibilities better.

2. tuning mode: you can choose a tone collection on the map. Any incoming MIDI-note will be returned through pitch bend messages to the pure tuning interval (the “meant tone”). Subsequently, an algorithm could be implemented that interprets the incoming MIDI-notes and finds the most probable tuning for the given context.
