import fiddle3D from "./fiddle3D"

class cube extends fiddle3D {
  constructor(gl, color, size, position) {
    // The core icosahedron coordinates.
    const SIZE = size                 // Provided in the form of "double". How far the faces are from the center. 
    const POSITION = position         // Provided in the form of {x: , y: , z: }, for the center.

    super(
      gl,

      [
        [ SIZE,  SIZE,  SIZE],  // Front top right
        [-SIZE,  SIZE,  SIZE],  // Front top left
        [ SIZE, -SIZE,  SIZE],  // Front bottom right
        [-SIZE, -SIZE,  SIZE],  // Front bottom left
        [ SIZE,  SIZE, -SIZE],  // Back top right
        [-SIZE,  SIZE, -SIZE],  // Back top left
        [ SIZE, -SIZE, -SIZE],  // Back bottom right
        [-SIZE, -SIZE, -SIZE]   // Back bottom left
      ],

      [
        [0, 1, 3],
        [3, 2, 0],
        [1, 0, 4],
        [4, 5, 1],
        [0, 2, 6],
        [6, 4, 0],
        [5, 4, 6],
        [6, 7, 5],
        [1, 5, 7],
        [7, 3, 1],
        [6, 2, 3],
        [3, 7, 6]
      ],

      color
    )
  }
}

export { cube }