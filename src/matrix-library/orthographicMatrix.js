import { FiddleMatrix } from "./matrix"

/* IMPORTANT! This matrix needs to be the last in any string of transformations. */
class OrthoMatrix extends FiddleMatrix {
    constructor(flatDim){

        // Start with the identity matrix.
        super()

        /* Depending on what dimension we want to "flatten" or get rid of, 
        we deal with a different row. */

        switch (flatDim) {
            case "x":
                flatDim = 0
                break
            case "y":
                flatDim = 1
                break
            case "z":
                flatDim = 2
                break
            default:
                flatDim = 2
        }
        
        this.matrix[flatDim][0] = 0
        this.matrix[flatDim][1] = 0
        this.matrix[flatDim][2] = 0

        //Re-set rows and columns so that the scalar values show up in those attributes - IMPORTANT FOR MATRIX OPERATIONS
        this.updateRC()
    }
}

export default OrthoMatrix