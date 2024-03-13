import fiddle3D from "./fiddle3D"

class testThing extends fiddle3D {
  constructor(gl, color) {
    // The core icosahedron coordinates.
    const X = 0.525731112119133606
    const Z = 0.850650808352039932

    super(
      gl,

      [
        [-X, 0.0, Z],
        [X, 0.0, Z],
        [-X, 0.0, -Z],
        [X, 0.0, -Z],
        [0.0, Z, X],
        [0.0, Z, -X],
        [0.0, -Z, X],
        [0.0, -Z, -X],
        [Z, X, 0.0],
        [-Z, X, 0.0],
        [Z, -X, 0.0],
        [-Z, -X, 0.0]
      ],

      [
        [1, 4, 0],
        [4, 9, 0],
        [4, 5, 9],
        [8, 5, 4],
        [1, 8, 4],
        [1, 10, 8],
        [10, 3, 8],
        [8, 3, 5],
        [3, 2, 5],
        [3, 7, 2],
        [3, 10, 7],
        [10, 6, 7],
        [6, 11, 7],
        [6, 0, 11],
        [6, 1, 0],
        [10, 1, 6],
        [11, 0, 9],
        [2, 11, 9],
        [5, 2, 9],
        [11, 2, 7]
      ],

      color
    )
  }
}

export { testThing }