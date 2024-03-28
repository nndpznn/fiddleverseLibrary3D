class scaleMatrix extends fiddleMatrix{
    constructor(sx, sy, sz){
        //Start with the identity matrix
        super()
        //Override the ones in the identity matrix with our scalar values
        this.matrix[0][0] = sx
        this.matrix[1][1] = sy
        this.matrix[2][2] = sz

        //Re-set rows and columns so that the scalar values show up in those attributes - IMPORTANT FOR MATRIX OPERATIONS
        this.rows = this.matrix
        this.columns = [
            [this.matrix[0][0], this.matrix[1][0], this.matrix[2][0], this.matrix[3][0]],
            [this.matrix[0][1], this.matrix[1][1], this.matrix[2][1], this.matrix[3][1]],
            [this.matrix[0][2], this.matrix[1][2], this.matrix[2][2], this.matrix[3][2]],
            [this.matrix[0][3], this.matrix[1][3], this.matrix[2][3], this.matrix[3][1]],
        ]
    }
}