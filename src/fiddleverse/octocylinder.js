import fiddle3D from "./fiddle3D"

class octocylinderShape extends fiddle3D {
  constructor(gl, color) {
    // The core icosahedron coordinates.
    // const SIZE = size               // Provided in the form of "double". How far the faces are from the center. 
    // const POSITION = position       // Provided in the form of {x: , y: , z: }, for the center.

    super(
      gl,

      // FOR MY OWN SANITY: Octagon vertices are arranged like a book from the top left corner, viewed from the top.
      // FRONT IS POSITIVE, BACK IS NEGATIVE
      [
        // TOP
        [ -0.125,  0.5, -0.5  ], [  0.125,  0.5, -0.5  ],  // Row 1 (back)         0 | 1
        [ -0.5,    0.5, -0.125], [  0.5,    0.5, -0.125],  // Row 2 (mid-back)   2   |   3
        [ -0.5,    0.5,  0.125], [  0.5,    0.5,  0.125],  // Row 3 (mid-front)  4   |   5
        [ -0.125,  0.5,  0.5  ], [  0.125,  0.5,  0.5  ],  // Row 4 (front)        6 | 7

        // BOTTOM
        [ -0.125, -0.5, -0.5  ], [  0.125, -0.5, -0.5  ],  // Row 1 (back)         8 | 9
        [ -0.5,   -0.5, -0.125], [  0.5,   -0.5, -0.125],  // Row 2 (mid-back)  10   |   11
        [ -0.5,   -0.5,  0.125], [  0.5,   -0.5,  0.125],  // Row 3 (mid-front) 12   |   13
        [ -0.125, -0.5,  0.5  ], [  0.125, -0.5,  0.5  ],  // Row 4 (front)       14 | 15

        [ 0,  0.5,  0 ], // TOP CENTER      | 16
        [ 0, -0.5,  0 ] // BOTTOM CENTER   | 17
      ],

      [
        // SIDES
        [0, 1, 9],
        [9, 8, 0],

        [1, 3, 11],
        [11, 9, 1],

        [3, 5, 13],
        [13, 11, 3],

        [5, 7, 15],
        [15, 13, 5],

        [7, 6, 14],
        [14, 15, 7],

        [6, 4, 12],
        [12, 14, 6],

        [4, 2, 10],
        [10, 12, 4],

        [2, 0, 8],
        [8, 10, 2],

        // OCTAGONS

        [0, 16, 1], [1, 16, 3], [3, 16, 5], [5, 16, 7],
        [7, 16, 6], [6, 16, 4], [4, 16, 2], [2, 16, 0],

        [9, 17, 8], [11, 17, 9], [13, 17, 11], [15, 17, 13],
        [14, 17, 15], [12, 17, 14], [10, 17, 12], [8, 17, 10]
      ],

      color
    )
  }
}

export { octocylinderShape }