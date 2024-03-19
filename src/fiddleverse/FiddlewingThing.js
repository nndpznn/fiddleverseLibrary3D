import fiddle3D from './fiddle3D'

class FiddlewingThing extends fiddle3D {
  constructor(gl, color, width = 0.5, length = 0.5, height = 0.1, x = 0, y = 0, z = 0) {
    // The wing "modifier" values.
    const W = width
    const L = length
    const H = height

    //Initializing the shape at 0,0,0
    const X = x
    const Y = y
    const Z = z

    super(
      gl,

      [
        [X, Y, Z], //0: y - bottom x - left z - bottom
        [X, Y, Z + H], //1: y - bottom x - left z - top
        [X, Y + W, Z + (H/2)], //2: y - bottom x - right z - N/A
        [X + L, Y, Z], //3: y - top x - left z - bottom
        [X + L, Y, Z + H], //4: y - top x - left z - top
        [X + L, Y + W, Z + (H/2)], //5: y - top x - right z - N/A
        [X - (L/5), Y + (W/4), Z + (H/2)], //6: Protruding middle back vertex
        [X + (L + (L/5)), Y + (W/4), Z + (H/2)] //7: Protruding middle top vertex
      ],

      [
        [0, 1, 2],
        [1, 3, 2],
        [2, 3, 5],
        [0, 3, 1],
        [1, 3, 4],
        [3, 5, 4],
        [0, 4, 2],
        [2, 4, 5],
        [0, 6, 2],
        [0, 1, 6],
        [6, 1, 2],
        [3, 7, 5],
        [3, 4, 7],
        [7, 4, 5],
      ],

      color
    )
  }
}

export default FiddlewingThing