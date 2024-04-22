import fiddle3D from "./fiddle3D";

class StarShape extends fiddle3D {
  constructor(gl, size, color, position) {
    const SIZE = size;
    const POSITION = position;

    super(
      gl,[
        [POSITION.x, POSITION.y + SIZE, POSITION.z], // 0 (Top center)
        [POSITION.x - SIZE, POSITION.y + SIZE, POSITION.z], // 1 (Top left)
        [POSITION.x - SIZE * 0.5, POSITION.y + SIZE * 0.5, POSITION.z], // 2 (Top left center)
        [POSITION.x - SIZE * 2.5, POSITION.y + SIZE * 0.5, POSITION.z], // 3 (Top left outer)
        [POSITION.x - SIZE * 1, POSITION.y, POSITION.z], // 4 (Left center)
        [POSITION.x - SIZE * 1.5, POSITION.y - SIZE * 2, POSITION.z], // 5 (Bottom left outer)
        [POSITION.x, POSITION.y - SIZE, POSITION.z], // 6 (Bottom center)
        [POSITION.x + SIZE * 1.5, POSITION.y - SIZE * 2, POSITION.z], // 7 (Bottom right outer)
        [POSITION.x + SIZE, POSITION.y, POSITION.z], // 8 (Right center)
        [POSITION.x + SIZE * 2.5, POSITION.y + SIZE * 0.5, POSITION.z], // 9 (Top right outer)
        [POSITION.x, POSITION.y + SIZE * 2, POSITION.z], // 10 (Top center)
        [POSITION.x, POSITION.y + SIZE * 1.5, POSITION.z - SIZE * 0.25], // 11 (Top center, slightly back)
        [POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z] // 12 (fixed vertice for 10)
        //try another point becuase 10 is not placed
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
        // [0, 9, 10],
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
        // [11, 10, 9],
        [0, 10, 1],
        [0, 9, 12],
        [0, 12, 10],
        [0, 8, 9],
        [0, 7, 8],
        [0, 6, 7],
        
      ],
      color
    );

    // this.normals = (
    //   0.0, 1.0, 0.0,
    //   0.0, 1.0, 0.0, //0
    //   0.0, 1.0, 0.0, 

    //   -1.0, 1.0, 0.0, 
    //   -1.0, 1.0, 0.0, //1
    //   -1.0, 1.0, 0.0, 

    //   -1.0, 1.0, 0.0, 
    //   -1.0, 1.0, 0.0, //2
    //   -1.0, 1.0, 0.0,

    //   -1.0, 1.0, 0.0, 
    //   -1.0, 1.0, 0.0, //3
    //   -1.0, 1.0, 0.0,

    //   -1.0, 0.0, 0.0,
    //   -1.0, 0.0, 0.0, //4
    //   -1.0, 0.0, 0.0,

    //   -1.0, -1.0, 0.0,
    //   -1.0, -1.0, 0.0, //5
    //   -1.0, -1.0, 0.0,

    //   0.0, -1.0, 0.0,
    //   0.0, -1.0, 0.0, //6
    //   0.0, -1.0, 0.0,

    //   1.0, -1.0, 0.0,
    //   1.0, -1.0, 0.0, //7
    //   1.0, -1.0, 0.0, 

    //   1.0, 0.0, 0.0,
    //   1.0, 0.0, 0.0, //8
    //   1.0, 0.0, 0.0,

    //   1.0, 1.0, 0.0,
    //   1.0, 1.0, 0.0, //9
    //   1.0, 1.0, 0.0,

    //   0.0, 1.0, 0.0,
    //   0.0, 1.0, 0.0, //10
    //   0.0, 1.0, 0.0,

    //   0.0, 1.0, -1.0,
    //   0.0, 1.0, -1.0, //11
    //   0.0, 1.0, -1.0,

    //   1.0, 1.0, 0.0,
    //   1.0, 1.0, 0.0, //12
    //   1.0, 1.0, 0.0
    // )
  }
}

export { StarShape };