import fiddle3D from "./fiddle3D";

class StarShape extends fiddle3D {
  constructor(gl, size, color, position) {
    const SIZE = size;
    const POSITION = position;

    super(
      gl,
      [
        [POSITION.x, POSITION.y + SIZE, POSITION.z], // 0 
        [POSITION.x - SIZE, POSITION.y + SIZE, POSITION.z], // 1
        [POSITION.x - SIZE * 0.5, POSITION.y + SIZE * 0.5, POSITION.z], // 2
        [POSITION.x - SIZE * 2.5, POSITION.y + SIZE * 0.5, POSITION.z], // 3
        [POSITION.x - SIZE * 1, POSITION.y, POSITION.z], // 4
        [POSITION.x - SIZE * 1.5, POSITION.y - SIZE * 2, POSITION.z], // 5
        [POSITION.x, POSITION.y - SIZE, POSITION.z], // 6
        [POSITION.x + SIZE * 1.5, POSITION.y - SIZE * 2, POSITION.z], // 7
        [POSITION.x + SIZE, POSITION.y, POSITION.z], // 8
        [POSITION.x + SIZE * 2.5, POSITION.y + SIZE * 0.5, POSITION.z], // 9
        [POSITION.x + SIZE * 0.5, POSITION.y + SIZE * 0.5, POSITION.z], // 10
        [POSITION.x, POSITION.y + SIZE, POSITION.z - SIZE * 0.5] //11
      ],
      [
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 5],
        [0, 5, 6],
        [0, 6, 7],
        [0, 7, 8],
        [0, 8, 9],
        [0, 9, 10],
        [0, 10, 1], 
        [11, 1, 10],
        [11, 2, 1],
        [11, 3, 2],
        [11, 4, 3],
        [11, 5, 4],
        [11, 6, 5],
        [11, 7, 6],
        [11, 8, 7],
        [11, 9, 8],
        [11, 10, 9]

      ],
      color
    );
  }
}

export { StarShape };