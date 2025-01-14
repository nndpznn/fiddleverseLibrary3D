import { FiddleMatrix } from "./matrix"

class PerspectiveMatrix extends FiddleMatrix {
    constructor(screenWidth, screenHeight, nearPlane, farPlane){

        // Start with the identity matrix.
        super()

        // Defined by six numbers: Left, Right, Top, Bottom, Far, and Near.

        // Aspect ratio = width / height aka 

        let l = -(screenWidth/2)
        let r = screenWidth/2
        let t = screenHeight/2
        let b = -(screenHeight/2)
        let n = nearPlane
        let f = farPlane
        // console.log(`left: ${l}, right: ${r}, top: ${t}, bottom: ${b}, near: ${n}, far: ${f}`)

        this.matrix = [
            [(2*n)/(r-l),     0,  (r+l)/(r-l),              0],
            [0,     (2*n)/(t-b),  (t+b)/(t-b),              0],
            [0,               0, -(f+n)/(f-n), -(2*n*f)/(f-n)],
            [0,               0,         -1,              0],
        ]

        //Re-set rows and columns so that the scalar values show up in those attributes - IMPORTANT FOR MATRIX OPERATIONS
        this.updateRC()
    }
}

export default PerspectiveMatrix