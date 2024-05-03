import { computeFaceNormals, computeTriangleNormals, computeVertexNormals, toRawLineArray, toRawTriangleArray } from "../shapes"
import { initVertexBuffer } from '../glsl-utilities'
import { FiddleMatrix } from "../matrix-library/matrix"

class fiddle3D {
    constructor(gl, vertices, facesByIndex, color) {
        this.gl = gl
        this.present = false

        this.instanceTransformation = new FiddleMatrix()
        this.vertices = vertices ?? []
        this.facesByIndex = facesByIndex ?? []
        this.color = color ?? { r: 0.5, g: 0.5, b: 0.5 }

        this.children = []

        //Visual modifier values
        this.wireframeValue = true
        this.lockedFrame = false
        this.smoothValue = false
        this.visualizeNormals = false // THIS PART RE-ASSIGNS COLORS TO THE VERTEX NORMALS. SET IT TO FALSE FOR NORMAL COLORS


        this.rawVertices = toRawLineArray(this)
        this.faceNormals = computeFaceNormals(this)

        this.verticesBuffer = initVertexBuffer(this.gl, this.rawVertices)

        this.colors = []
        for (let i = 0, max = this.rawVertices.length / 3; i < max; i += 1) {
            this.colors = this.colors.concat(this.color.r, this.color.g, this.color.b)
        }

        // THIS PART RE-ASSIGNS COLORS TO THE VERTEX NORMALS. COMMENT IT OUT FOR THE OLD COLORS
        if(this.visualizeNormals){
            this.colors = computeTriangleNormals(this)
        }

        
        this.colorsBuffer = initVertexBuffer(this.gl, this.colors)
        this.normalsBuffer = initVertexBuffer(this.gl, this.smoothValue ? computeVertexNormals(this) : computeTriangleNormals(this))

    }

    get smooth() {
        return this.smoothValue
    }

    set smooth(newSmoothValue) {
        this.smoothValue = newSmoothValue
        this.normalsBuffer = initVertexBuffer(this.gl, this.smoothValue ? computeVertexNormals(this) : computeTriangleNormals(this))
    }

    get wireframe() {
        return this.wireframeValue
    }

    set wireframe(newWireframeValue) {
        if(!this.lockedFrame){
            this.wireframeValue = newWireframeValue
            this.rawVertices = newWireframeValue ? toRawLineArray(this) : toRawTriangleArray(this)
            
            this.verticesBuffer = initVertexBuffer(this.gl, this.rawVertices)

            this.colors = []
            for (let i = 0, max = this.rawVertices.length / 3; i < max; i += 1) {
                this.colors = this.colors.concat(this.color.r, this.color.g, this.color.b)
            }

            
            if(this.visualizeNormals){
                this.colors = computeTriangleNormals(this)
            }
            this.colorsBuffer = initVertexBuffer(this.gl, this.colors)
            this.normalsBuffer = initVertexBuffer(this.gl, this.smoothValue ? computeVertexNormals(this) : computeTriangleNormals(this))
        }
        if (this.children.length > 0) {
            this.children.forEach(child => {
                child.wireframe = newWireframeValue
            })
        }
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
        fiddle3D.present = true
        // fiddle3D.instanceTransformation = this.instanceTransformation.multiply(fiddle3D.instanceTransformation)
    }

    remove(fiddle3D) {
        this.children = this.children.filter(item => item !== fiddle3D)
        fiddle3D.present = false
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