import { toRawLineArray } from "../shapes"

class fiddle3D {
    constructor(vertices, facesByIndex) {
        this.vertices = vertices ?? []
        this.facesByIndex = facesByIndex ?? []

        this.wireframe = true
        this.rawVertices = toRawLineArray(this)
    }

    meshThing() {
        return {
            color: { r: 0.0, g: 0.5, b: 0.0 },
            vertices: this.rawVertices,
            mode: gl.LINES
        }
    }
}

export default fiddle3D