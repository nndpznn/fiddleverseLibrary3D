import { useState, useEffect, useRef } from 'react'

// import { initSimpleShaderProgram } from './glsl-utilities'
import { Fiddleverse } from '../fiddleverse/fiddleverse'
import { octocylinderShape } from '../fiddleverse/octocylinder'
import RotationMatrix from '../matrix-library/rotationMatrix'
import TranslationMatrix from '../matrix-library/translationMatrix'


/* ISSUES:
    - The z-axis has strange behaviors. When moving back and forth through it, the near
    and far plane appear to be very limiting. The animation is not nearly as smooth, as well.
*/
// Slightly-leveled-up GLSL shaders.
const VERTEX_SHADER = `
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
  // Now, instead of being hardcoded, lightDirection is variable depending on our light variable.
  vec3 lightDirection = light;

  vec3 transformedNormal = mat3(transform) * vertexNormal;

  float reflectedLight = dot(
    normalize(lightDirection), 
    normalize(transformedNormal)
  );

  gl_Position = projection * camera * transform * vec4(vertexPosition, 1.0);

  pixelVertexColor = vec4(
     reflectedLight < 0.0 ? vec3(0.0, 0.0, 0.0) : reflectedLight * vertexColor, 
     1.0
  );

  //pixelVertexColor = vec4(vertexColor, 1.0);
}
`

const FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec3 color;

  varying vec4 pixelVertexColor;

  void main(void) {
    gl_FragColor = pixelVertexColor;
  }
`

/**
 * If you don’t know React well, don’t worry about the trappings. Just focus on the code inside
 * the useEffect hook.
 */
const MainTest = props => {

  const screenHeight = 6
  const screenWidth = 10

  const [fiddleverse, setFiddleverse] = useState(null)
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Grab the WebGL rendering context.
    const fiddleverse = new Fiddleverse(canvas, screenHeight, screenWidth, VERTEX_SHADER, FRAGMENT_SHADER)
    const gl = fiddleverse.gl

    const blueColor = {r: 0.18, g: 0.62, b: 0.82}
    const grayColor = {r: 0.3,  g: 0.3,  b: 0.3}

    const octocylinderTest = new octocylinderShape(gl, blueColor)
    octocylinderTest.wireframe = false
    // octocylinderTest.smooth = true

    const octocylinderOutline = new octocylinderShape(gl, grayColor)
    octocylinderOutline.wireframe = true

    // octocylinderTest.add(octocylinderOutline)

    const tiltMatrix = new RotationMatrix(0, 1, 0, 0)
    // octocylinderTest.setInstanceTransformation(tiltMatrix)

    // Pass the vertices to WebGL.
    fiddleverse.add(octocylinderTest)
    // fiddleverse.add(octocylinderOutline)
    
    fiddleverse.process()
    fiddleverse.light = [0, 0, -1]
    fiddleverse.cameraPosition = [0, 0, -1]
    fiddleverse.cameraView = [0, 0, 0]

    /*
     * Displays the scene.
     */
    let currentRotation = 0.0
    fiddleverse.drawScene(currentRotation)

    /*
     * Animates the scene.
     */
    let animationActive = false
    let previousTimestamp = null

    let cameraSwitched = true

    const FRAMES_PER_SECOND = 60
    const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

    const DEGREES_PER_MILLISECOND = 0.5
    const FULL_CIRCLE = 360.0
    let moveRate = -0.01

    const advanceScene = timestamp => {
      // Check if the user has turned things off.
      if (!animationActive) {
        return
      }

      // Initialize the timestamp.
      if (!previousTimestamp) {
        previousTimestamp = timestamp
        window.requestAnimationFrame(advanceScene)
        return
      }

      // Check if it’s time to advance.
      const progress = timestamp - previousTimestamp
      if (progress < MILLISECONDS_PER_FRAME) {
        // Do nothing if it’s too soon.
        window.requestAnimationFrame(advanceScene)
        return
      }

      // All clear.
      currentRotation += DEGREES_PER_MILLISECOND * progress

      // fiddleverse.translationVector[0] -= 0.01

      const rotateOctoX = new RotationMatrix(DEGREES_PER_MILLISECOND, 1, 0, 0)
      const rotateOctoY = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 1, 0)
      const rotateOctoZ = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 0, 1)
      octocylinderTest.setInstanceTransformation(rotateOctoX)
      octocylinderTest.setInstanceTransformation(rotateOctoY)
      octocylinderTest.setInstanceTransformation(rotateOctoZ)

      const moveMatrix = new TranslationMatrix(moveRate, 0, 0)
      // octocylinderTest.setInstanceTransformation(moveMatrix)

      if (fiddleverse.translationVector[0] < -0.5) {
        fiddleverse.translationVector[0] = 1
      }

      if (fiddleverse.translationVector[1] < -.9) {
        fiddleverse.translationVector[1] = 1
      }

      if (currentRotation >= FULL_CIRCLE) {
        currentRotation -= FULL_CIRCLE
      }

      fiddleverse.drawScene(currentRotation)

      // Request the next frame.
      previousTimestamp = timestamp
      window.requestAnimationFrame(advanceScene)
    }

    // Draw the initial scene.
    fiddleverse.drawScene(currentRotation)

    setFiddleverse({
      toggleRotation: () => {
        animationActive = !animationActive
        if (animationActive) {
          previousTimestamp = null
          window.requestAnimationFrame(advanceScene)
        }
      },

      switchCamera: () =>{
        console.log("Switching camera")
        cameraSwitched = !cameraSwitched
        //Toggle cameraPosition to demonstrate camera controls
        if(cameraSwitched){
          fiddleverse.cameraPosition = [0, 0, -1]
        }
        else{
          fiddleverse.cameraPosition = [0, -1, -1]
        }
        
        //Redraw scene so that we can see the change
        fiddleverse.drawScene(currentRotation)
      }
    })
  }, [canvasRef])


  // Set up the rotation toggle: clicking on the canvas does it.
  const handleCanvasClick = event => fiddleverse.toggleRotation()

  const handleSwitchCamera = event => {
    fiddleverse.switchCamera()
    console.log("HEY!")
  }

  return (
    <article>
      {/* Yes, still square. */}
      <canvas width="512" height="512" ref={canvasRef} onClick={fiddleverse ? handleCanvasClick : undefined}>
        Your favorite update-your-browser message here.
      </canvas>

      <button disabled={!fiddleverse} onClick={handleSwitchCamera}>
            Switch Camera
      </button>

    </article>
  )
}

export default MainTest
