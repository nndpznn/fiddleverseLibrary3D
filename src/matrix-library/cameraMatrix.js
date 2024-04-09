import { FiddleMatrix } from "./matrix"

class CameraMatrix extends FiddleMatrix {
    /* 
    Makes the viewer the center of the universe. Repositions the entire world as though
    we're moving through it, but really it's moving around us!
        THE CALCULATION SHOULD WORK THIS WAY: [Perspective][Camera][Transforms]
        meaning transforms first, then camera, then perspective. 
    */

    constructor(p, q, up){
        
        // Uh.. I guess we need a vector class?

        // const ze = p.subtract(Q).unit
        // const ye = up.subtract(up.projection(ze)).unit
        // const xe = ye.cross(ze)

        // Start with the identity matrix.
        super()

        // Defined by six numbers: Left, Right, Top, Bottom, Far, and Near.

        // Aspect ratio = width / height aka 

        // THIS ISN'T RIGHT YET LMAO
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

export default CameraMatrix