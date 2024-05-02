import { getGL, initVertexBuffer, initSimpleShaderProgram } from '../glsl-utilities'
import CameraMatrix from '../matrix-library/cameraMatrix'
import { FiddleMatrix } from '../matrix-library/matrix'
import OrthoMatrix from '../matrix-library/orthographicMatrix'
import PerspectiveMatrix from '../matrix-library/perspectiveMatrix'
import TranslationMatrix from '../matrix-library/translationMatrix'
import Vector from '../vector'

class Fiddleverse {
    constructor(canvas, screenHeight, screenWidth) {
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

        this.vertexShader = `
        #ifdef GL_ES
        precision highp float;
        #endif
        
        attribute vec3 vertexPosition;
        attribute vec3 vertexColor;
        varying vec4 pixelVertexColor;
        
        attribute vec3 vertexNormal;
        
        uniform mat4 projection;
        uniform mat4 transform;
        uniform mat4 camera;
        uniform vec3 light;
        
        void main(void) {
        
          vec3 ambientLight = vec3(0.2, 0.2, 0.2);
        
          // Now, instead of being hardcoded, lightDirection is variable depending on our light variable.
          vec3 lightDirection = light;
        
          vec3 transformedNormal = mat3(transform) * vertexNormal;
        
          float reflectedLight = dot(
            normalize(lightDirection), 
            normalize(transformedNormal)
          );
        
          gl_Position = projection * camera * transform * vec4(vertexPosition, 1.0);
        
          pixelVertexColor = vec4(
             (ambientLight * vertexColor) + (reflectedLight < 0.0 ? vec3(0.0, 0.0, 0.0) : reflectedLight * vertexColor
            ), 
             1.0
          );
        
          //pixelVertexColor = vec4(vertexColor, 1.0);
        }
        `

        this.fragmentShader = `
        #ifdef GL_ES
        precision highp float;
        #endif
      
        uniform vec3 color;
      
        varying vec4 pixelVertexColor;
      
        void main(void) {
          gl_FragColor = pixelVertexColor;
        }
      `

        let abort = false
        const shaderProgram = initSimpleShaderProgram(
          gl,
          this.vertexShader,
          this.fragmentShader,
    
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

        this.vertexNormal = gl.getAttribLocation(this.shaderProgram, "vertexNormal")
        gl.enableVertexAttribArray(this.vertexNormal)

        this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'projection')
        this.transformMatrix = gl.getUniformLocation(this.shaderProgram, 'transform')
        this.cameraMatrix = gl.getUniformLocation(this.shaderProgram, 'camera')
        this.lightVector = gl.getUniformLocation(this.shaderProgram, 'light')

        this.translationVector = [0, 0, 0]
        this.scaleVector = [1, 1, 1]
        this.lightSource = [1, 0, 0]
        this.camera = [new Vector(0, 0, 0), new Vector(0, 0, -1), new Vector(0, 1, 0)]

        this.projectionMode = true //Projection mode boolean: true - ortho; false - perspective

    }

    get light() {
      return this.lightSource
    }

    set light(newLight) {
      this.lightSource = newLight
      this.gl.uniform3f(this.lightVector, ...new Float32Array(this.lightSource))
    }

    get cameraPosition() {
      return this.camera[1]
    }

    set cameraPosition(newPosition) {
      this.camera[1] = new Vector(...newPosition)
      this.gl.uniformMatrix4fv(this.cameraMatrix, this.gl.FALSE, new Float32Array(new CameraMatrix(...this.camera).glForm()))
    }

    get cameraView() {
      return this.camera[0]
    }

    set cameraView(newView) {
      this.camera[0] = new Vector(...newView)
      this.gl.uniformMatrix4fv(this.cameraMatrix, this.gl.FALSE, new Float32Array(new CameraMatrix(...this.camera).glForm()))
    }

    get cameraUpOrientation() {
      return this.camera[2]
    }

    set cameraUpOrientation(newUp) {
      this.camera[2] = new Vector(...newUp)
      this.gl.uniformMatrix4fv(this.cameraMatrix, this.gl.FALSE, new Float32Array(new CameraMatrix(...this.camera).glForm()))
    }

    /*
    * Displays an individual object.
    */
    drawMesh(fiddle3Dmesh) {
      const gl = this.gl

      // let orthograpicOverlay = new OrthoMatrix(this.screenWidth, this.screenHeight, 1, 1000)

      if (fiddle3Dmesh.children.length === 0 ) { // THEN NO CHILDREN!

        //set the translation matrix to the instance matrix of the current object
        gl.uniformMatrix4fv(this.transformMatrix, gl.FALSE, new Float32Array(fiddle3Dmesh.instanceTransformation.glForm()))

        //set the vertex normals
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.normalsBuffer)
        gl.vertexAttribPointer(this.vertexNormal, 3, gl.FLOAT, false, 0, 0)

        // Set the varying colors.
        // gl.uniform3f(this.vertexColor, fiddle3Dmesh.color.r, fiddle3Dmesh.color.g, fiddle3Dmesh.color.b)
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.colorsBuffer)
        gl.vertexAttribPointer(this.vertexColor, 3, gl.FLOAT, false, 0, 0)

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.verticesBuffer)
        gl.vertexAttribPointer(this.vertexPosition, 3, gl.FLOAT, false, 0, 0)
        gl.drawArrays(fiddle3Dmesh.mode, 0, fiddle3Dmesh.vertices.length / 3)

      } else { // THEN CHILDREN!

        //set the translation matrix to the instance matrix of the current object
        gl.uniformMatrix4fv(this.transformMatrix, gl.FALSE, new Float32Array(fiddle3Dmesh.instanceTransformation.glForm()))

        //set the vertex normals
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.normalsBuffer)
        gl.vertexAttribPointer(this.vertexNormal, 3, gl.FLOAT, false, 0, 0)

        // Set the varying colors.
        // gl.uniform3f(this.vertexColor, fiddle3Dmesh.color.r, fiddle3Dmesh.color.g, fiddle3Dmesh.color.b)
        gl.bindBuffer(gl.ARRAY_BUFFER, fiddle3Dmesh.colorsBuffer)
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

    toggleGeometry() {
      // console.log("universe method")
      this.cast.forEach(object => {
        // console.log(`BEFORE: ${object.smoothValue}`)
        object.smooth = !object.smooth
        // console.log(`AFTER: ${object.smoothValue}`)
      })
    }

    toggleWireframe() {
      //console.log("toggling wireframe method")
      this.cast.forEach(object => {
        object.wireframe = !object.wireframe
      })
    }

    toggleProjection() {
      this.projectionMode = !this.projectionMode
    }

    drawScene(currentRotation) {
        const gl = this.gl
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        let translation = new TranslationMatrix(...this.translationVector)

        let ortho = new OrthoMatrix(this.screenWidth, this.screenHeight, 100, -1000)
        let projection = new PerspectiveMatrix(this.screenWidth, this.screenHeight, 100, -1000)
        //projection = new FiddleMatrix()
        gl.uniformMatrix4fv(this.projectionMatrix, gl.FALSE, new Float32Array(this.projectionMode ? ortho.glForm() : projection.glForm()))

        
        // gl.uniformMatrix4fv(this.projectionMatrix, gl.FALSE, new Float32Array(projection.glForm()))
        
        //NOTE: using the actual perspective code made it so nothing showed up on the canvas, so I'm just using an identity matrix for now
        // gl.uniformMatrix4fv(this.projectionMatrix, gl.FALSE, new Float32Array(new FiddleMatrix().glForm()))

        gl.uniformMatrix4fv(this.cameraMatrix, gl.FALSE, new Float32Array(new CameraMatrix(...this.camera).glForm()))

        gl.uniform3f(this.lightVector, ...new Float32Array(this.lightSource))
        
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
      object.present = true
    }

    remove = (object) => {
      this.cast.delete(object)
      object.present = false
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