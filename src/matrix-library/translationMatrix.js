import FiddleMatrix from "./matrix"

class TranslationMatrix extends FiddleMatrix {
    constructor(dx, dy, dz){
        //Start with an identity matrix so that the first three columns are correct
        super()
        //Fix the last column with our x, y, and z offset values
        this.matrix[0][3] = dx
        this.matrix[1][3] = dy
        this.matrix[2][3] = dz

        //Re-set rows and columns so that the offset values show up in those attributes - IMPORTANT FOR MATRIX OPERATIONS
        this.updateRC()
    }
}

export default TranslationMatrix