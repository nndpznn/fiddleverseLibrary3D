import { FiddleMatrix } from "./matrix"

class OrthoMatrix extends FiddleMatrix {
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

        this.matrix = [
            [2/(r-l),       0,        0,  -(r+l)/(r-l)],
            [0,       2/(t-b),        0,  -(t+b)/(t-b)],
            [0,             0, -2/(f-n),  -(f+n)/(f-n)],
            [0,             0,        0,             1],
        ]

        //Re-set rows and columns so that the scalar values show up in those attributes - IMPORTANT FOR MATRIX OPERATIONS
        this.updateRC()
    }
}

export default OrthoMatrix