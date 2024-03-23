import fiddle3D, { BufferGeometry, BufferAttribute, MeshPhongMaterial, Mesh, Group } from './fiddle3D'

class starshape extends fiddle3D{
    constructor(gl,size,color,position) {
        const SIZE = size
        const POSITION = position

        super(
            gl,
            [
        [ POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z + SIZE], // 1
        [ POSITION.x - SIZE, POSITION.y + SIZE, POSITION.z + SIZE], // 2
        [ POSITION.x - SIZE, POSITION.y + SIZE, POSITION.z + SIZE], // 3
        [ POSITION.x - SIZE, POSITION.y + SIZE, POSITION.z + SIZE], // 4
        [ POSITION.x - SIZE, POSITION.y - SIZE, POSITION.z + SIZE], // 5
        [ POSITION.x + SIZE, POSITION.y - SIZE, POSITION.z + SIZE], // 6
        [ POSITION.x + SIZE, POSITION.y - SIZE, POSITION.z + SIZE], // 7
        [ POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z + SIZE], // 8
        [ POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z + SIZE], // 9
        [ POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z + SIZE], // 10
        [ POSITION.x + SIZE, POSITION.y + SIZE, POSITION.z + SIZE]  // 0
              ],
              [
                [0, 0, 1],  // 0 middle of star for 3d
                [0, 2.5, 0], // 1 top of the star
                [-0.5, 1, 0], //2
                [-2.5, 1, 0], //3
                [-1, 0, 0], //4
                [-1.5, -2, 0], //5      //these comments are old the numbers don't mean anything for now so ignore them, I'm using gthem to help me make open vertices for them
                [0, -1, 0], // 6
                [1.5, -2, 0], //7
                [1, 0, 0], //8
                [0.5, 1, 0], //9
                [2.5, 1, 0] //10
              ],

              color
        )
    }
}

export {starshape}