import fiddle3D from './fiddle3D'

class pyramidShape extends fiddle3D {
  constructor(gl, color) {
    super(
      gl,
      // FRONT IS POSITIVE, BACK IS NEGATIVE
      [
        // TOP
        [0, 0.75, 0], // 0                  0
        //                                 / \
        //                               /    \
        // BOTTOM                      /        \
        [-0.5, -0.5, -0.5], // 1      1 - - - - - 2
        [0.5, -0.5, -0.5],  // 2     /           /
        [-0.5, -0.5, 0.5],  // 3    /           /
        [0.5, -0.5, 0.5]    // 4   3 - - - - - 4
      ],

      [
        // SIDES
        [0, 2, 1],
        [0, 1, 3],
        [0, 3, 4],
        [0, 4, 2],

        // BASE
        [1, 2, 4],
        [1, 4, 3]
      ],

      color
    )
  }
}

export { pyramidShape }
