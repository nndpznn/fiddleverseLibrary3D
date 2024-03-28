class rotationMatrix extends fiddleMatrix{
    constructor(theta, x, y, z){
        //Rotation matrix for the angle theta on the arbitrary axis (x, y, z) - Credit to Dondi's barebones playground code
        super()
        const axisLength = Math.sqrt(x * x + y * y + z * z)
        const s = Math.sin((theta * Math.PI) / 180.0)
        const c = Math.cos((theta * Math.PI) / 180.0)
        const oneMinusC = 1.0 - c
        
        // Normalize the axis vector of rotation.
        x /= axisLength
        y /= axisLength
        z /= axisLength
        
        // Now we can calculate the other terms.
        // "2" for "squared."
        const x2 = x * x
        const y2 = y * y
        const z2 = z * z
        const xy = x * y
        const yz = y * z
        const xz = x * z
        const xs = x * s
        const ys = y * s
        const zs = z * s
        
        //fiddleMatrix expects this.matrix in row major order
        this.matrix = [
            [x2 * oneMinusC + c, xy * oneMinusC - zs, xz * oneMinusC + ys, 0.0,],
            [xy * oneMinusC + zs, y2 * oneMinusC + c, yz * oneMinusC - xs, 0.0,],
            [xz * oneMinusC - ys, yz * oneMinusC + xs, z2 * oneMinusC + c, 0.0,],
            [0.0, 0.0, 0.0, 1.0],
        ]

        //Re-set rows and columns so that rotation matrices show up in those attributes - IMPORTANT FOR MATRIX OPERATIONS
        this.rows = this.matrix
        this.columns = [
            [this.matrix[0][0], this.matrix[1][0], this.matrix[2][0], this.matrix[3][0]],
            [this.matrix[0][1], this.matrix[1][1], this.matrix[2][1], this.matrix[3][1]],
            [this.matrix[0][2], this.matrix[1][2], this.matrix[2][2], this.matrix[3][2]],
            [this.matrix[0][3], this.matrix[1][3], this.matrix[2][3], this.matrix[3][1]],
        ]
    }
}