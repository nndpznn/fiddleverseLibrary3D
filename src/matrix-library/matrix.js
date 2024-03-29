class FiddleMatrix {
    constructor() {
        this.matrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]

        this.rows = this.matrix

        this.columns = [
            [this.matrix[0][0], this.matrix[1][0], this.matrix[2][0], this.matrix[3][0]],
            [this.matrix[0][1], this.matrix[1][1], this.matrix[2][1], this.matrix[3][1]],
            [this.matrix[0][2], this.matrix[1][2], this.matrix[2][2], this.matrix[3][2]],
            [this.matrix[0][3], this.matrix[1][3], this.matrix[2][3], this.matrix[3][1]],
        ]
    }

    get matrix() {
        return this.matrix
    }

    set matrix(newMatrix) {
        // This better be a goddamn 4x4.
        this.matrix = newMatrix

        // Also re-initializing these attributes, just in case.
        this.rows = this.matrix

        this.columns = [
            [this.matrix[0][0], this.matrix[1][0], this.matrix[2][0], this.matrix[3][0]],
            [this.matrix[0][1], this.matrix[1][1], this.matrix[2][1], this.matrix[3][1]],
            [this.matrix[0][2], this.matrix[1][2], this.matrix[2][2], this.matrix[3][2]],
            [this.matrix[0][3], this.matrix[1][3], this.matrix[2][3], this.matrix[3][1]],
        ]
    }

    arrayX(row, column) {
        // Utility method for multiplying a row and column together. Obviously this can be used for any two arrays, but specific parameter names are added for convenience.
        return (row[0]*column[0] + row[1]*column[1] + row[2]*column[2] + row[3]*column[3])
    }

    multiply(other) {
        // In this case, we're assuming that this.matrix is the first matrix and otherMatrix is the second.
        let result = [
            [this.arrayX(this.rows[0],other.columns[0]), this.arrayX(this.rows[0],other.columns[1]), this.arrayX(this.rows[0],other.columns[2]), this.arrayX(this.rows[0],other.columns[3])],

            [this.arrayX(this.rows[1],other.columns[0]), this.arrayX(this.rows[1],other.columns[1]), this.arrayX(this.rows[1],other.columns[2]), this.arrayX(this.rows[1],other.columns[3])],

            [this.arrayX(this.rows[2],other.columns[0]), this.arrayX(this.rows[2],other.columns[1]), this.arrayX(this.rows[2],other.columns[2]), this.arrayX(this.rows[2],other.columns[3])],

            [this.arrayX(this.rows[3],other.columns[0]), this.arrayX(this.rows[3],other.columns[1]), this.arrayX(this.rows[3],other.columns[2]), this.arrayX(this.rows[3],other.columns[3])],
        ]

        return result
    }

    glForm() {
        // Flattens the matrix into a long array of its columns - meant for use when entering the matrix into the glsl shader
        return [...this.columns[0], ...this.columns[1], ...this.columns[2], ...this.columns[3]]
    }
}

export default FiddleMatrix