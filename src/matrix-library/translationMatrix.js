class translationMatrix extends fiddleMatrix{
    constructor(dx, dy, dz){
        //Start with an identity matrix so that the first three columns are correct
        super()
        //Fix the last column with our x, y, and z offset values
        this.matrix[3][0] = dx
        this.matrix[3][1] = dy
        this.matrix[3][2] = dz

        //Re-set rows and columns so that the offset values show up in those attributes - IMPORTANT FOR MATRIX OPERATIONS
        this.rows = this.matrix
        this.columns = [
            [this.matrix[0][0], this.matrix[1][0], this.matrix[2][0], this.matrix[3][0]],
            [this.matrix[0][1], this.matrix[1][1], this.matrix[2][1], this.matrix[3][1]],
            [this.matrix[0][2], this.matrix[1][2], this.matrix[2][2], this.matrix[3][2]],
            [this.matrix[0][3], this.matrix[1][3], this.matrix[2][3], this.matrix[3][1]],
        ]
    }
}