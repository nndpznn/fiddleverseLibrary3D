import { getGL, initVertexBuffer, initSimpleShaderProgram } from '../glsl-utilities'
import { getRotationMatrix } from '../matrixFunctions'

class Fiddleverse {
    constructor(canvas, vertexShader, fragmentShader) {
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

        this.cast = new Set()

        let abort = false
        const shaderProgram = initSimpleShaderProgram(
          gl,
          vertexShader,
          fragmentShader,
    
          // Very cursory error-checking here...
          shader => {
            abort = true
            alert('Shader problem: ' + gl.getShaderInfoLog(shader))
          },
    
          // Another simplistic error check: we don't even access the faulty
          // shader program.
          shaderProgram => {
            abort = true
            alert('Could not link shaders...sorry.')
          }
        )
    
        // If the abort variable is true here, we can't continue.
        if (abort) {
          alert('Fatal errors encountered; we cannot continue.')
          return
        }
    
        // All done --- tell WebGL to use the shader program from now on.
        gl.useProgram(shaderProgram)

        this.gl = gl
        this.shaderProgram = shaderProgram
    
        // Hold on to the important variables within the shaders.
        this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'vertexPosition')
        gl.enableVertexAttribArray(this.vertexPosition)
        this.vertexColor = gl.getAttribLocation(this.shaderProgram, 'vertexColor')
        gl.enableVertexAttribArray(this.vertexColor)
        this.rotationMatrix = gl.getUniformLocation(this.shaderProgram, 'rotationMatrix')

    }

    /*
    * Displays an individual object.
    */
    drawMesh(fiddle3Dmesh) {
        const gl = this.gl

        // console.log(object)
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.colorsBuffer)
        gl.vertexAttribPointer(this.vertexColor, 3, gl.FLOAT, false, 0, 0)

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.verticesBuffer)
        gl.vertexAttribPointer(this.vertexPosition, 3, gl.FLOAT, false, 0, 0)
        gl.drawArrays(fiddle3Dmesh.mode, 0, fiddle3Dmesh.vertices.length / 3)
    }

    drawScene(currentRotation) {
        const gl = this.gl
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  
        // Set up the rotation matrix.
        gl.uniformMatrix4fv(this.rotationMatrix, gl.FALSE, new Float32Array(getRotationMatrix(currentRotation, 0, 1, 0)))
  
        // Display the objects.
        this.cast.forEach(mesh => {
          this.drawMesh(mesh)
        })
  
        // All done.
        gl.flush()
    }

    add = (object) => {
      this.cast.add(object)
    }

    remove = (object) => {
      this.cast.delete(object)
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

    initializeShader = () => {
      
    }
}

export { Fiddleverse }