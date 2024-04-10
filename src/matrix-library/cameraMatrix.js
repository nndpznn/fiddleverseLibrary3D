import { FiddleMatrix } from "./matrix"
import Vector from "../vector"

class CameraMatrix extends FiddleMatrix {
    /* 
    Makes the viewer the center of the universe. Repositions the entire world as though
    we're moving through it, but really it's moving around us!
        THE CALCULATION SHOULD WORK THIS WAY: [Perspective][Camera][Transforms]
        meaning transforms first, then camera, then perspective. 
    */

    constructor(p, q, up){
        
        // Assuming p, q, and up are vectors

        const ze = p.subtract(q).unit
        const ye = (up.subtract(up.projection(ze))).unit
        const xe = ye.cross(ze)

        // Start with the identity matrix.
        super()

        // Defined by six numbers: Left, Right, Top, Bottom, Far, and Near.

        // Aspect ratio = width / height aka 

        /* THIS ISN'T RIGHT YET LMAO
        this.matrix = [
            [(2*n)/(r-l),     0,  (r+l)/(r-l),              0],
            [0,     (2*n)/(t-b),  (t+b)/(t-b),              0],
            [0,               0, -(f+n)/(f-n), -(2*n*f)/(f-n)],
            [0,               0,         -1,              0],
        ]*/

        console.log(p, xe, ye, ze, xe.multiply(p.x))

        // assuming the arguments are all vectors (they should be), this should be the correct matrix
        this.matrix = [
            [xe.x, xe.y, xe.z, -p.dot(xe)],
            [ye.x, ye.y, ye.z, -p.dot(ye)],
            [ze.x, ze.y, ze.z, -p.dot(ze)],
            [0, 0, 0, 1]
        ]

        //Re-set rows and columns so that the scalar values show up in those attributes - IMPORTANT FOR MATRIX OPERATIONS
        this.updateRC()
    }
}

export default CameraMatrix