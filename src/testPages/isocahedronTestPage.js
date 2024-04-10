import { useState, useEffect, useRef } from 'react'

// import { initSimpleShaderProgram } from './glsl-utilities'
import { Fiddleverse } from '../fiddleverse/fiddleverse'
import { dondiShape } from '../fiddleverse/dondiShape'
import { cubeShape } from '../fiddleverse/cube'
import { octocylinderShape } from '../fiddleverse/octocylinder'
import OrthoMatrix from '../matrix-library/orthographicMatrix'
import RotationMatrix from '../matrix-library/rotationMatrix'


// Slightly-leveled-up GLSL shaders.
const VERTEX_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 vertexPosition;
attribute vec3 vertexColor;
varying vec3 pixelVertexColor;

uniform mat4 projectionMatrix;
uniform mat4 transform;
uniform mat4 camera;

void main(void) {
  gl_Position = projectionMatrix * camera * transform * vec4(vertexPosition, 1.0);
  pixelVertexColor = vertexColor;
}
`

const FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec3 color;

  varying vec4 pixelVertexColor;

  void main(void) {
    gl_FragColor = vec4(color, 1.0);

  }
`

/**
 * If you don’t know React well, don’t worry about the trappings. Just focus on the code inside
 * the useEffect hook.
 */
const IsocahedronTest = props => {

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

    const octocylinderTest = new octocylinderShape(gl, grayColor)
    octocylinderTest.wireframe = false

    const octocylinderOutline = new octocylinderShape(gl, blueColor)
    octocylinderOutline.wireframe = true

    octocylinderTest.add(octocylinderOutline)

    const tiltMatrix = new RotationMatrix(0, 1, 0, 0)
    octocylinderTest.setInstanceTransformation(tiltMatrix)

    // Pass the vertices to WebGL.
    fiddleverse.add(octocylinderTest)
    // fiddleverse.add(octocylinderOutline)
    
    fiddleverse.process()

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

    const FRAMES_PER_SECOND = 60
    const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

    const DEGREES_PER_MILLISECOND = 0.033
    const FULL_CIRCLE = 360.0

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

      fiddleverse.translationVector[0] -= 0.01

      if (fiddleverse.translationVector[0] < -0.9) {
        fiddleverse.translationVector[0] += 1.8
      }

      if (fiddleverse.translationVector[1] < -.9) {
        fiddleverse.translationVector[1] = 1
      }

      if (fiddleverse.translationVector[2] < -5.0) {
        fiddleverse.translationVector[2] = 5.0
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
      }
    })
  }, [canvasRef])

  // Set up the rotation toggle: clicking on the canvas does it.
  const handleCanvasClick = event => fiddleverse.toggleRotation()

  return (
    <article>
      {/* Yes, still square. */}
      <canvas width="512" height="512" ref={canvasRef} onClick={fiddleverse ? handleCanvasClick : undefined}>
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export default IsocahedronTest
