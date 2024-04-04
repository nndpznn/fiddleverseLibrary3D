import { getGL, initVertexBuffer, initSimpleShaderProgram } from '../glsl-utilities'
import OrthoMatrix from '../matrix-library/orthographicMatrix'
// import { getRotationMatrix } from '../matrixFunctions'
import TranslationMatrix from '../matrix-library/translationMatrix'

//default shaders
const VERTEX_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertexPosition;

// Note this new additional output.
attribute vec3 vertexColor;
varying vec4 finalVertexColor;

uniform mat4 transform;

void main(void) {
  gl_Position = transform * vec4( vertexPosition, 1.0);
  finalVertexColor = vec4(vertexColor, 1.0);
}
`

const FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec4 finalVertexColor;

  void main(void) {
    // We vary the color based on the fragment's z coordinate,
    // which, at this point, ranges from 0 (near) to 1 (far).
    // Note the ".rgb" subselector.
    gl_FragColor = vec4((1.0 - gl_FragCoord.z) * finalVertexColor.rgb, 1.0);
  }
`



class Fiddleverse {
    constructor(canvas, screenHeight, screenWidth, vertexShader, fragmentShader) {
    // Grab the WebGL rendering context.
        const gl = getGL(canvas)
        if (!gl) {
          alert('No WebGL context found...sorry.')

        // No WebGL, no use going on...
          return
        }
        
        gl.enable(gl.DEPTH_TEST)
        gl.clearColor(0.0, 0.0, 0.0, 0.0)
        gl.viewport(0, 0, canvas.width, canvas.height)

        this.cast = new Set()
        this.screenHeight = screenHeight
        this.screenWidth = screenWidth

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
        this.vertexColor = gl.getUniformLocation(this.shaderProgram, 'color')
        gl.enableVertexAttribArray(this.vertexColor)
        this.translationMatrix = gl.getUniformLocation(this.shaderProgram, 'transform')

        this.translationVector = [0, 0, 0]
        this.scaleVector = [1, 1, 1]

    }

    /*
    * Displays an individual object.
    */
    drawMesh(fiddle3Dmesh) {
      const gl = this.gl

      // let orthograpicOverlay = new OrthoMatrix(this.screenWidth, this.screenHeight, 1, 1000)

      if (fiddle3Dmesh.children.length === 0 ) { // THEN NO CHILDREN!

        //set the translation matrix to the instance matrix of the current object
        gl.uniformMatrix4fv(this.translationMatrix, gl.FALSE, new Float32Array(fiddle3Dmesh.instanceTransformation.glForm()))
        // console.log(object)
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.colorsBuffer)
        gl.vertexAttribPointer(this.vertexColor, 3, gl.FLOAT, false, 0, 0)
        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.verticesBuffer)
        gl.vertexAttribPointer(this.vertexPosition, 3, gl.FLOAT, false, 0, 0)
        gl.drawArrays(fiddle3Dmesh.mode, 0, fiddle3Dmesh.vertices.length / 3)

      } else { // THEN CHILDREN!

        //set the translation matrix to the instance matrix of the current object
        gl.uniformMatrix4fv(this.translationMatrix, gl.FALSE, new Float32Array(fiddle3Dmesh.instanceTransformation.glForm()))
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.colorsBuffer)
        // gl.uniform3f(this.vertexColor, ...fiddle3Dmesh.color)
        gl.vertexAttribPointer(this.vertexColor, 3, gl.FLOAT, false, 0, 0)
        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.verticesBuffer)
        gl.vertexAttribPointer(this.vertexPosition, 3, gl.FLOAT, false, 0, 0)
        gl.drawArrays(fiddle3Dmesh.mode, 0, fiddle3Dmesh.vertices.length / 3)

        fiddle3Dmesh.children.forEach(child => {
          //children aren't stored as their meshThings so we need to pass meshThings into drawMesh
          this.drawMesh(child.meshThing())
        })

      }
    }


    drawScene(currentRotation) {
        const gl = this.gl
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        let translation = new TranslationMatrix(...this.translationVector)
  
        // const transformMatrix = [
        //   this.scaleVector[0], 0, 0, 0, 
        //   0, this.scaleVector[1], 0, 0, 
        //   0, 0, this.scaleVector[2], 0,
        //   ...this.translationVector, 1]
        
        // Display the objects.
        this.cast.forEach(object => {
          
          object.setInstanceTransformation(translation)
          this.drawMesh(object.meshThing())
        })
  
        // All done.
        gl.flush()
    }

    /**
       * NOTE: Please make sure to add the fiddle3D object, not the meshThing()
       */ 
    add = (object) => {
      this.cast.add(object)
    }

    remove = (object) => {
      this.cast.delete(object)
    }

    process = () => {
      this.cast.forEach(objectToDraw => {
        // Redefine the meshThing for reduced confusion between children and parents - since children cannot be added as their meshThings, we're making it so that we also don't add meshthings directly to the universe
        let objectToDrawMesh = objectToDraw.meshThing()

        objectToDrawMesh.verticesBuffer = initVertexBuffer(this.gl, objectToDrawMesh.vertices)
  
        if (!objectToDrawMesh.colors) {
          // If we have a single color, we expand that into an array
          // of the same color over and over.
          objectToDrawMesh.colors = []
          for (let i = 0, maxi = objectToDraw.vertices.length / 3; i < maxi; i += 1) {
            objectToDrawMesh.colors = objectToDrawMesh.colors.concat(
              objectToDrawMesh.color.r,
              objectToDrawMesh.color.g,
              objectToDrawMesh.color.b
            )
          }
        }
  
        objectToDrawMesh.colorsBuffer = initVertexBuffer(this.gl, objectToDrawMesh.colors)
      })
    }
}

export { Fiddleverse }