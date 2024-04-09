class FiddleMatrix {
    constructor(setMatrix) {
        this.transformMatrix = setMatrix ? setMatrix : [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]

        this.rows = this.transformMatrix

        this.columns = [
            [this.transformMatrix[0][0], this.transformMatrix[1][0], this.transformMatrix[2][0], this.transformMatrix[3][0]],
            [this.transformMatrix[0][1], this.transformMatrix[1][1], this.transformMatrix[2][1], this.transformMatrix[3][1]],
            [this.transformMatrix[0][2], this.transformMatrix[1][2], this.transformMatrix[2][2], this.transformMatrix[3][2]],
            [this.transformMatrix[0][3], this.transformMatrix[1][3], this.transformMatrix[2][3], this.transformMatrix[3][3]],
        ]
    }

    get matrix() {
        return this.transformMatrix
    }

    /**
     * @param {number[4][4]} newMatrix
     */
    set matrix(newMatrix) {
        // This better be a goddamn 4x4.
        this.transformMatrix = newMatrix
        // console.log(this.transformMatrix)

        // Also re-initializing these attributes, just in case.
        this.updateRC()
    }

    updateRC() {
        // Since we ended up doing this a lot... here's a helper method to reset rows and columns as the matrix is updated.
        this.rows = this.transformMatrix

        this.columns = [
            [this.transformMatrix[0][0], this.transformMatrix[1][0], this.transformMatrix[2][0], this.transformMatrix[3][0]],
            [this.transformMatrix[0][1], this.transformMatrix[1][1], this.transformMatrix[2][1], this.transformMatrix[3][1]],
            [this.transformMatrix[0][2], this.transformMatrix[1][2], this.transformMatrix[2][2], this.transformMatrix[3][2]],
            [this.transformMatrix[0][3], this.transformMatrix[1][3], this.transformMatrix[2][3], this.transformMatrix[3][3]],
        ]

    }

    arrayX(row, column) {
        // Utility method for multiplying a row and column together. Obviously this can be used for any two arrays, but specific parameter names are added for convenience.
        return (row[0]*column[0] + row[1]*column[1] + row[2]*column[2] + row[3]*column[3])
    }

    multiply(other) {
        var rtn = new FiddleMatrix()
        // In this case, we're assuming that this.matrix is the first matrix (left one) and otherMatrix is the second (right one).
        let result = [
            [this.arrayX(this.rows[0],other.columns[0]), this.arrayX(this.rows[0],other.columns[1]), this.arrayX(this.rows[0],other.columns[2]), this.arrayX(this.rows[0],other.columns[3])],

            [this.arrayX(this.rows[1],other.columns[0]), this.arrayX(this.rows[1],other.columns[1]), this.arrayX(this.rows[1],other.columns[2]), this.arrayX(this.rows[1],other.columns[3])],

            [this.arrayX(this.rows[2],other.columns[0]), this.arrayX(this.rows[2],other.columns[1]), this.arrayX(this.rows[2],other.columns[2]), this.arrayX(this.rows[2],other.columns[3])],

            [this.arrayX(this.rows[3],other.columns[0]), this.arrayX(this.rows[3],other.columns[1]), this.arrayX(this.rows[3],other.columns[2]), this.arrayX(this.rows[3],other.columns[3])],
        ]

        rtn.matrix = result

        return rtn
    }

    glForm() {
        // Flattens the matrix into a long array of its columns - meant for use when entering the matrix into the glsl shader
        return [...this.columns[0], ...this.columns[1], ...this.columns[2], ...this.columns[3]]
    }
}

export { FiddleMatrix }