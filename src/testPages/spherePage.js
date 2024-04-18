import { useState, useEffect, useRef } from 'react'

// import { initSimpleShaderProgram } from './glsl-utilities'
import { Fiddleverse } from '../fiddleverse/fiddleverse'
import { dondiShape } from '../fiddleverse/dondiShape'
import { cubeShape } from '../fiddleverse/cube'
import IcosphereThing from '../fiddleverse/IcosphereThing'
import RotationMatrix from '../matrix-library/rotationMatrix'

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

void main(void) {
  // Hardcoded light direction.

  vec3 lightDirection = vec3(1.0, 0.0, 0.0);

  vec4 transformedNormal = transform * vec4(vertexNormal, 1.0);

  float reflectedLight = dot(
    normalize(lightDirection), 
    normalize(vec3(transformedNormal))
  );

  gl_Position = projection * camera * transform * vec4(vertexPosition, 1.0);

  // pixelVertexColor = vec4(
  //   reflectedLight < 0.0 ? vec3(0.0, 0.0, 0.0) : reflectedLight * vertexColor, 
  //   1.0
  // );

  pixelVertexColor = vec4(vertexColor, 1.0);
}
`

const FRAGMENT_SHADER = `
  #ifdef GL_ES
  precision highp float;
  #endif

  // uniform vec3 color;

  varying vec4 pixelVertexColor;

  void main(void) {
    gl_FragColor = pixelVertexColor;
  }
`

/**
 * If you don’t know React well, don’t worry about the trappings. Just focus on the code inside
 * the useEffect hook.
 */
const SphereTest = props => {

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

    const isocahedron = new dondiShape(gl)
    isocahedron.wireframe = false

    const blueColor = {r: 0.18, g: 0.62, b: 0.82}
    const grayColor = {r: 0.25, g: 0.25, b: 0.25}
    const isocahedronFrame = new dondiShape(gl, blueColor)

    isocahedron.add(isocahedronFrame)

    const cubeTest = new cubeShape(gl, blueColor, 0.5, {x: 0, y: 0, z: 0})
    cubeTest.wireframe = true

    const icosphereTest = new IcosphereThing(gl, grayColor)
    icosphereTest.wireframe = false
    const icosphereFrame = new IcosphereThing(gl, blueColor)

    // Pass the vertices to WebGL.
    fiddleverse.add(icosphereTest)
    // fiddleverse.add(icosphereFrame)
    
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

    const DEGREES_PER_MILLISECOND = 0.5
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
      
      const rotateOctoX = new RotationMatrix(DEGREES_PER_MILLISECOND, 1, 0, 0)
      const rotateOctoY = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 1, 0)
      const rotateOctoZ = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 0, 1)
      icosphereTest.setInstanceTransformation(rotateOctoX)
      icosphereTest.setInstanceTransformation(rotateOctoY)
      icosphereTest.setInstanceTransformation(rotateOctoZ)

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

export default SphereTest
