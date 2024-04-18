import { computeTriangleNormals, toRawLineArray, toRawTriangleArray } from "../shapes"
import { initVertexBuffer } from '../glsl-utilities'
import { FiddleMatrix } from "../matrix-library/matrix"

class fiddle3D {
    constructor(gl, vertices, facesByIndex, color) {
        this.gl = gl

        this.instanceTransformation = new FiddleMatrix()
        this.vertices = vertices ?? []
        this.facesByIndex = facesByIndex ?? []
        this.color = color ?? { r: 0.5, g: 0.5, b: 0.5 }

        this.children = []

        this.wireframeValue = true
        this.rawVertices = toRawLineArray(this)

        this.verticesBuffer = initVertexBuffer(this.gl, this.rawVertices)
        this.colors = []
        for (let i = 0, max = this.rawVertices.length / 3; i < max; i += 1) {
            this.colors = this.colors.concat(this.color.r, this.color.g, this.color.b)
        }
        // this.colors = computeTriangleNormals(this)
        this.colorsBuffer = initVertexBuffer(this.gl, this.colors)
        this.normalsBuffer = initVertexBuffer(this.gl, computeTriangleNormals(this))

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
        // this.colors = computeTriangleNormals(this)
        this.colorsBuffer = initVertexBuffer(this.gl, this.colors)
        this.normalsBuffer = initVertexBuffer(this.gl, computeTriangleNormals(this))
    }

    setInstanceTransformation(newMatrix) {
        /* 
        Setting this as a method instead of a setter function so that we can use this statement below without
        triggering an infinite loop. 
        NOTE: Because we need to use this function to propogate the translations through the list of children, WE CANNOT USE MESHTHINGS IN THE CHILDREN LIST
        */
        this.instanceTransformation = newMatrix.multiply(this.instanceTransformation)

        this.propogateTranslations(newMatrix)
    }

    propogateTranslations(matrixChange){
        /**
         * Propogates parent translations to any children if possible
         */
        if (this.children.length > 0) {
            this.children.forEach(child => {
                child.setInstanceTransformation(matrixChange)
            })
        }
    }

    add(fiddle3D) {
        this.children.push(fiddle3D)
        fiddle3D.instanceTransformation = this.instanceTransformation.multiply(fiddle3D.instanceTransformation)
    }

    remove(fiddle3D) {
        this.children = this.children.filter(item => item !== fiddle3D)
    }

    meshThing() {
        return {
            color: this.color,
            vertices: this.rawVertices,
            mode: this.wireframeValue ? this.gl.LINES : this.gl.TRIANGLES,
            verticesBuffer: this.verticesBuffer,
            colorsBuffer: this.colorsBuffer,
            normalsBuffer: this.normalsBuffer,
            children: this.children,
            instanceTransformation: this.instanceTransformation,
        }
    }

}

export default fiddle3D 