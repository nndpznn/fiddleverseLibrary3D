import { FiddleMatrix } from "./matrix"

class ScaleMatrix extends FiddleMatrix {
    constructor(sx, sy, sz){
        //Start with the identity matrix
        super()
        //Override the ones in the identity matrix with our scalar values
        this.matrix[0][0] = sx
        this.matrix[1][1] = sy
        this.matrix[2][2] = sz

        //Re-set rows and columns so that the scalar values show up in those attributes - IMPORTANT FOR MATRIX OPERATIONS
        this.updateRC()
    }
}

export default ScaleMatrix