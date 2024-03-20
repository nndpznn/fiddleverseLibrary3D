import { useState, useEffect, useRef } from 'react'

// import { initSimpleShaderProgram } from './glsl-utilities'
import { Fiddleverse } from './fiddleverse/fiddleverse'
import { dondiShape } from './fiddleverse/dondiShape'
import { cubeShape } from './fiddleverse/cube'

// Slightly-leveled-up GLSL shaders.
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

// `
//   #ifdef GL_ES
//   precision highp float;
//   #endif

//   attribute vec3 vertexPosition;

//   // Note this new additional output.
//   attribute vec3 vertexColor;
//   varying vec4 finalVertexColor;
//   uniform mat4 rotationMatrix;

//   uniform vec3 translation;

//   void main(void) {
//     gl_Position = rotationMatrix * vec4(
//       vertexPosition.x + translation.x,
//       vertexPosition.y + translation.y,
//       vertexPosition.z + translation.z, 
//       1.0);
//     finalVertexColor = vec4(vertexColor, 1.0);
//   }
// `

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

/**
 * If you don’t know React well, don’t worry about the trappings. Just focus on the code inside
 * the useEffect hook.
 */
const IsocahedronTest = props => {
  const [fiddleverse, setFiddleverse] = useState(null)
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Grab the WebGL rendering context.
    const fiddleverse = new Fiddleverse(canvas, VERTEX_SHADER, FRAGMENT_SHADER)
    const gl = fiddleverse.gl

    const isocahedron = new dondiShape(gl)
    isocahedron.wireframe = false

    const blueColor = {r: 0.18, g: 0.62, b: 0.82}
    const isocahedronFrame = new dondiShape(gl, blueColor)

    isocahedron.children.push(isocahedronFrame.meshThing(gl))

    const cubeTest = new cubeShape(gl, blueColor, 0.5, {x: 0, y: 0, z: 0})
    cubeTest.wireframe = true

    // Pass the vertices to WebGL.
    fiddleverse.add(isocahedron.meshThing(gl))
    // fiddleverse.add(isocahedronFrame.meshThing(gl))
    // fiddleverse.add(cubeTest.meshThing(gl))

    // fiddleverse.remove(isocahedron.meshThing(gl))
    
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
      fiddleverse.translationVector[0] += 0.00
      fiddleverse.drawScene(currentRotation)

      if (fiddleverse.translationVector[0] > 1.0) {
        fiddleverse.translationVector[0] = -1.0
      }

      if (currentRotation >= FULL_CIRCLE) {
        currentRotation -= FULL_CIRCLE
      }

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
