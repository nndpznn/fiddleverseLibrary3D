import fiddle3D from "./fiddle3D"

class cubeShape extends fiddle3D {
  constructor(gl, color, size, position) {
    // The core icosahedron coordinates.
    const SIZE = size               // Provided in the form of "double". How far the faces are from the center. 
    const POSITION = position       // Provided in the form of {x: , y: , z: }, for the center.

    super(
      gl,

      [
        [ POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z + SIZE],  // Front top right
        [ POSITION.x - SIZE, POSITION.y + SIZE, POSITION.z + SIZE],  // Front top left
        [ POSITION.x + SIZE, POSITION.y - SIZE, POSITION.z + SIZE],  // Front bottom right
        [ POSITION.x - SIZE, POSITION.y - SIZE, POSITION.z + SIZE],  // Front bottom left
        [ POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z - SIZE],  // Back top right
        [ POSITION.x - SIZE, POSITION.y + SIZE, POSITION.z - SIZE],  // Back top left
        [ POSITION.x + SIZE, POSITION.y - SIZE, POSITION.z - SIZE],  // Back bottom right
        [ POSITION.x - SIZE, POSITION.y - SIZE, POSITION.z - SIZE]   // Back bottom left
      ],

      [
        [0, 1, 3],
        [3, 2, 0],
        [1, 0, 4],
        [4, 5, 1],
        [4, 0, 2],
        [2, 6, 4],
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

export { cubeShape }