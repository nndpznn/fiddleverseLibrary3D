import fiddle3D from "./fiddle3D"

//Remaps the randomizer - mainly so we can avoid getting 0s (or near zeros), which don't make the shape that different from a normal cube
const remapRandomizer = (ran, low = 0.33, high = 0.66) => {
  return (low + ran*high)
}

//Gets a semi-random point within the constraints of the X/Y ranges given for use in the FRONT AND BACK faces (faces where Z isn't constrained)
const getRandomPointInZFace = (x1, x2, y1, y2, z, size) => {
  return [x1 + (remapRandomizer(Math.random())*(x2-x1)), y1 + (remapRandomizer(Math.random())*(y2-y1)), z + (remapRandomizer(Math.random(), 0.25, 0.5)*size)] 
}

//Gets a semi-random point within the constraints of the X/Z ranges given for use in the TOP AND BOTTOM faces (faces where Y isn't constrained)
const getRandomPointInYFace = (x1, x2, y, size, z1, z2,) => {
  return [x1 + (remapRandomizer(Math.random())*(x2-x1)), y + (remapRandomizer(Math.random(), 0.25, 0.5)*size), z1 + (remapRandomizer(Math.random())*(z2-z1))] 
}

//Gets a semi-random point within the constraints of the Y/Z ranges given for use in the LEFT AND RIGHT faces (faces where X isn't constrained)
const getRandomPointInXFace = (x, size, y1, y2, z1, z2) => {
  return [x + (remapRandomizer(Math.random(), 0.25, 0.5)*size), y1 + (remapRandomizer(Math.random())*(y2-y1)), z1 + (remapRandomizer(Math.random())*(z2-z1))] 
}


class AsteroidThing extends fiddle3D { //AsteroidThing based on Nolan's CubeThing class
  constructor(gl, color, size, position) {
    const SIZE = size               // Provided in the form of "double". How far the faces are from the center. 
    const POSITION = position       // Provided in the form of {x: , y: , z: }, for the center.
    console.log("Generating CubeShape")

    super(
      gl,

      [
        [ POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z + SIZE],  //0: Front top right
        [ POSITION.x - SIZE, POSITION.y + SIZE, POSITION.z + SIZE],  //1: Front top left
        [ POSITION.x + SIZE, POSITION.y - SIZE, POSITION.z + SIZE],  //2: Front bottom right
        [ POSITION.x - SIZE, POSITION.y - SIZE, POSITION.z + SIZE],  //3: Front bottom left
        [ POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z - SIZE],  //4: Back top right
        [ POSITION.x - SIZE, POSITION.y + SIZE, POSITION.z - SIZE],  //5: Back top left
        [ POSITION.x + SIZE, POSITION.y - SIZE, POSITION.z - SIZE],  //6: Back bottom right
        [ POSITION.x - SIZE, POSITION.y - SIZE, POSITION.z - SIZE],   //7: Back bottom left
        getRandomPointInZFace(POSITION.x - SIZE, POSITION.x + SIZE, POSITION.y - SIZE, POSITION.y + SIZE, POSITION.z + SIZE, SIZE), //8: Front face randomizer
        getRandomPointInZFace(POSITION.x - SIZE, POSITION.x + SIZE, POSITION.y - SIZE, POSITION.y + SIZE, POSITION.z - SIZE, -SIZE), //9: Back face randomizer
        getRandomPointInYFace(POSITION.x - SIZE, POSITION.x + SIZE, POSITION.y + SIZE, SIZE, POSITION.z - SIZE, POSITION.z + SIZE), //10: Top face randomizer
        getRandomPointInYFace(POSITION.x - SIZE, POSITION.x + SIZE, POSITION.y - SIZE, -SIZE, POSITION.z - SIZE, POSITION.z + SIZE), //11: Bottom face randomizer
        getRandomPointInXFace(POSITION.x - SIZE, -SIZE, POSITION.y - SIZE, POSITION.y + SIZE, POSITION.z - SIZE, POSITION.z + SIZE), //12: Left face randomizer
        getRandomPointInXFace(POSITION.x + SIZE, SIZE, POSITION.y - SIZE, POSITION.y + SIZE, POSITION.z - SIZE, POSITION.z + SIZE), //13: Right face randomizer

      ],

      [
        //Front Face
        /*
        Original:
        [0, 1, 3],
        [3, 2, 0],
        */
        [0, 1, 8], [8, 1, 3], [2, 8, 3], [0, 8, 2],
        //Top Face
        /*
        Original:
        [1, 0, 4],
        [4, 5, 1],
        */
        [1, 0, 10], [10, 1, 5], [10, 5, 4], [0, 10, 4],
        //Right Face
        /*
        Original:
        [4, 0, 2],
        [2, 6, 4],
        */
        [4, 0, 13], [13, 0, 2], [2, 6, 13], [6, 4, 13],
        //Back Face
        /*
        Original:
        [5, 4, 6],
        [6, 7, 5],
        */
        [5, 4, 9], [9, 7, 5], [6, 7, 9], [9, 4, 6],
        //Left Face
        /*
        Original:
        [1, 5, 7],
        [7, 3, 1],
        */
        [1, 5, 12], [5, 12, 7], [12, 7, 3], [3, 12, 1],
        //Bottom Face
        /*
        Original:
        [6, 2, 3],
        [3, 7, 6]
        */
        [6, 2, 11], [2, 11, 3], [11, 6, 7], [11, 7, 3],
      ],

      color
    )
  }
}

export { AsteroidThing }