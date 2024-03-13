import { toRawLineArray, toRawTriangleArray } from "../shapes"
import { initVertexBuffer } from '../glsl-utilities'

class fiddle3D {
    constructor(gl, vertices, facesByIndex, color) {
        this.gl = gl
        this.vertices = vertices ?? []
        this.facesByIndex = facesByIndex ?? []
        this.color = color ?? { r: 0.5, g: 0.5, b: 0.5 }

        this.wireframeValue = true
        this.rawVertices = toRawLineArray(this)

        this.verticesBuffer = initVertexBuffer(this.gl, this.rawVertices)

        this.colors = []
        for (let i = 0, max = this.rawVertices.length / 3; i < max; i += 1) {
            this.colors = this.colors.concat(this.color.r, this.color.g, this.color.b)
        }
        this.colorsBuffer = initVertexBuffer(this.gl, this.colors)

    }

    get wireframe() {
        return this.wireframeValue
    }

    set wireframe(newWireframeValue) {
        this.wireframeValue = newWireframeValue
        this.rawVertices = newWireframeValue ? toRawLineArray(this) : toRawTriangleArray(this)
        
        this.verticesBuffer = initVertexBuffer(this.gl, this.rawVertices)

        this.colors = []
        for (let i = 0, max = this.rawVertices.length / 3; i < max; i += 1) {
            this.colors = this.colors.concat(this.color.r, this.color.g, this.color.b)
        }
        this.colorsBuffer = initVertexBuffer(this.gl, this.colors)
    }

    meshThing() {
        return {
            color: this.color,
            vertices: this.rawVertices,
            mode: this.wireframeValue ? this.gl.LINES : this.gl.TRIANGLES,
            verticesBuffer: this.verticesBuffer,
            colorsBuffer: this.colorsBuffer
        }
    }

}

// class ThingGroup {
//     constructor() {
//         this.children = []
//     }

//     add(fiddle3D) {
//         this.children.push(fiddle3D)
//     }

//     remove(fiddle3D) {
//         this.children = this.children.filter(item => item !== fiddle3D)
//     }

//     draw(gl) {
//         this.children.forEach(child => child.draw(gl))
//     }
// }

export default fiddle3D