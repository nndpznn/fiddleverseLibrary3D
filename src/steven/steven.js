import { getGL, initVertexBuffer } from '../glsl-utilities'

class Fiddleverse {
    constructor(canvas) {
    // Grab the WebGL rendering context.
        const gl = getGL(canvas)
        if (!gl) {
          alert('No WebGL context found...sorry.')

        // No WebGL, no use going on...
          return
        }

        // Set up settings that will not change.  This is not "canned" into a
        // utility function because these settings really can vary from program
        // to program.
        gl.enable(gl.DEPTH_TEST)
        gl.clearColor(0.0, 0.0, 0.0, 0.0)
        gl.viewport(0, 0, canvas.width, canvas.height)

        this.gl = gl
        this.cast = new Set()

    }

    add = (objectsToAdd) => {
      objectsToAdd.forEach(object => {
        this.cast.add(object)
      })
    }

    remove = (objectsToRemove) => {
      objectsToRemove.forEach(object => {
        this.cast.delete(object)
      })
    }

    process = () => {
      this.cast.forEach(objectToDraw => {

        objectToDraw.verticesBuffer = initVertexBuffer(this.gl, objectToDraw.vertices)
  
        if (!objectToDraw.colors) {
          // If we have a single color, we expand that into an array
          // of the same color over and over.
          objectToDraw.colors = []
          for (let i = 0, maxi = objectToDraw.vertices.length / 3; i < maxi; i += 1) {
            objectToDraw.colors = objectToDraw.colors.concat(
              objectToDraw.color.r,
              objectToDraw.color.g,
              objectToDraw.color.b
            )
          }
        }
  
        objectToDraw.colorsBuffer = initVertexBuffer(this.gl, objectToDraw.colors)
      })
    }
}

export { Fiddleverse }