/**
 * Build out this component to display your pitched scene—the one that goes full circle to the first assignment,
 * but now done using your own 3D library. It doesn’t have to be the same scene of course—that was done with
 * a different group, many many weeks ago!
 */
import { useState, useEffect, useRef } from 'react'

import { Fiddleverse } from '../fiddleverse/fiddleverse'
import { octocylinderShape } from '../fiddleverse/octocylinder'
import { cubeShape } from '../fiddleverse/cube'
import RotationMatrix from '../matrix-library/rotationMatrix'
import TranslationMatrix from '../matrix-library/translationMatrix'
import { StarShape } from '../fiddleverse/star'
import FiddlewingThing from '../fiddleverse/FiddlewingThing'
import IcosphereThing from '../fiddleverse/IcosphereThing'
import { pyramidShape } from '../fiddleverse/pyramid'
import ScaleMatrix from '../matrix-library/scaleMatrix'

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 512

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

const PitchedScene = props => {
  const screenHeight = 6
  const screenWidth = 10
  let cubeMoving = false

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

    const blueColor = { r: 0.18, g: 0.62, b: 0.82 }
    const grayColor = { r: 0.3, g: 0.3, b: 0.3 }
    const yellowColor = { r: 0.95, g: 0.73, b: 0.05 }

    const cubeTest = new cubeShape(gl, grayColor, 0.5, { x: 0, y: 0, z: 0 })
    cubeTest.wireframe = false
    cubeTest.smooth = false

    const octocylinder1 = new octocylinderShape(gl, blueColor)
    octocylinder1.wireframe = false
    octocylinder1.smooth = false
    const rotateOctoX = new RotationMatrix(90, 1, 0, 0)
    octocylinder1.setInstanceTransformation(rotateOctoX)

    const octocylinderOutline = new octocylinderShape(gl, grayColor)
    octocylinderOutline.wireframe = true

    const starTest = new StarShape(gl, 0.65, yellowColor, { x: 0, y: 0, z: 0 })
    starTest.wireframe = false
    starTest.smooth = false
    const rotateStarY = new RotationMatrix(90, 1, 0, 0)

    const sphereTest = new IcosphereThing(gl, yellowColor)
    sphereTest.wireframe = false
    sphereTest.smooth = true

    const pyramid1Test = new pyramidShape(gl, grayColor)
    pyramid1Test.wireframe = false
    pyramid1Test.smooth = false

    const pyramid2Test = new pyramidShape(gl, grayColor)
    pyramid2Test.wireframe = false
    pyramid2Test.smooth = false

    const wing1 = new FiddlewingThing(gl)
    wing1.wireframe = false
    const rotateWingY = new RotationMatrix(90, 0, 1, 0)
    const rotateWingZ = new RotationMatrix(90, 0, 0, 1)
    const translateWing = new TranslationMatrix(-0.5, 0, 0)
    wing1.setInstanceTransformation(rotateWingY)
    wing1.setInstanceTransformation(rotateWingZ)
    wing1.setInstanceTransformation(translateWing)

    const wing2 = new FiddlewingThing(gl)
    wing2.wireframe = false
    const rotateWing2Y = new RotationMatrix(-90, 0, 1, 0)
    const rotateWing2Z = new RotationMatrix(-90, 0, 0, 1)
    const translateWing2 = new TranslationMatrix(0.5, 0, 0)
    wing2.setInstanceTransformation(rotateWing2Y)
    wing2.setInstanceTransformation(rotateWing2Z)
    wing2.setInstanceTransformation(translateWing2)

    octocylinder1.add(wing1)
    octocylinder1.add(wing2)

    const moveLeft = new TranslationMatrix(-2.3, 0, 0)
    const moveRight = new TranslationMatrix(2, 0, 0)
    const moveUp = new TranslationMatrix(0, 1, 0)
    const moveDown = new TranslationMatrix(0, -1.3, 0)
    const setMiddle = new TranslationMatrix(0, 0, 0)

    starTest.setInstanceTransformation(moveLeft)
    sphereTest.setInstanceTransformation(moveLeft)

    pyramid1Test.setInstanceTransformation(new RotationMatrix(90, 0, 0, 1))
    pyramid1Test.setInstanceTransformation(new TranslationMatrix(1, 0, 0))
    pyramid2Test.setInstanceTransformation(new RotationMatrix(-90, 0, 0, 1))
    pyramid2Test.setInstanceTransformation(new TranslationMatrix(3, 0, 0))
    cubeTest.setInstanceTransformation(moveRight)

    //FORM THE UFO
    cubeTest.add(pyramid1Test)
    cubeTest.add(pyramid2Test)

    const halfSize = new ScaleMatrix(0.5, 0.5, 0.5)
    // pyramid1Test.setInstanceTransformation(halfSize)
    // pyramid2Test.setInstanceTransformation(halfSize)
    cubeTest.setInstanceTransformation(halfSize)
    cubeTest.setInstanceTransformation(new TranslationMatrix(1, 0, 0))

    const rectangleTest = new cubeShape(gl, blueColor, 0.5, { x: 0, y: 0, z: 0 })
    rectangleTest.setInstanceTransformation(new ScaleMatrix(1, 1.5, 1))
    rectangleTest.setInstanceTransformation(moveDown)
    rectangleTest.wireframe = false
    rectangleTest.smooth = false

    sphereTest.add(starTest)

    // Pass the vertices to WebGL.
    fiddleverse.add(octocylinder1)
    fiddleverse.add(cubeTest)
    fiddleverse.add(starTest)
    fiddleverse.add(sphereTest)
    fiddleverse.add(pyramid1Test)
    fiddleverse.add(pyramid2Test)
    fiddleverse.add(rectangleTest)

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

      const rotateX = new RotationMatrix(DEGREES_PER_MILLISECOND, 1, 0, 0)
      //  const rotateY = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 1, 0)
      //  const rotateZ = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 0, 1)

      octocylinder1.setInstanceTransformation(rotateX)
      //  octocylinder1.setInstanceTransformation(rotateOctoY)
      //  octocylinder1.setInstanceTransformation(rotateOctoZ)

      if (cubeMoving) {
        cubeTest.setInstanceTransformation(rotateX)
      }

      //  const moveMatrix = new TranslationMatrix(0, 0, -1)

      if (fiddleverse.translationVector[0] < -0.5) {
        fiddleverse.translationVector[0] = 1
      }

      if (fiddleverse.translationVector[1] < -0.9) {
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

      switchCamera: () => {
        console.log('Switching camera')
        cameraSwitched = !cameraSwitched
        //Toggle cameraPosition to demonstrate camera controls
        if (cameraSwitched) {
          fiddleverse.cameraPosition = [0, 0, -1]
        } else {
          fiddleverse.cameraPosition = [0, -1, -1]
        }

        //Redraw scene so that we can see the change
        fiddleverse.drawScene(currentRotation)
      },

      startCube: () => {
        cubeMoving = !cubeMoving //look here for cube when searching
      },

      removeSomething: () => {
        if (octocylinder1.present) {
          fiddleverse.remove(octocylinder1)
          fiddleverse.drawScene(currentRotation)
        } else {
          fiddleverse.add(octocylinder1)
          fiddleverse.drawScene(currentRotation)
        }
      }
    })
  }, [canvasRef])

  // Set up the rotation toggle: clicking on the canvas does it.
  const handleStartStop = event => fiddleverse.toggleRotation()

  const handleSwitchCamera = event => fiddleverse.switchCamera()

  const handleStartCube = event => fiddleverse.startCube()

  const handleRemove = event => fiddleverse.removeSomething()

  const handleStartSun = event => fiddleverse.startSun()

  const handleStartPyramid = event => fiddleverse.startPyramid()

  return (
    <article>
      <p>Use this component to implement your pitched scene—the one with an intended purpose, use cases, etc.</p>

      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}>
        Your favorite update-your-browser message here.
      </canvas>

      <button disabled={!fiddleverse} onClick={handleStartStop}>
        Master Start/Stop
      </button>

      <button disabled={!fiddleverse} onClick={handleSwitchCamera}>
        Switch Camera
      </button>

      <button disabled={!fiddleverse} onClick={handleStartCube}>
        Start/Stop Cube
      </button>

      <button disabled={!fiddleverse} onClick={handleRemove}>
        Add/Remove Satellite
      </button>

      <button disabled={!fiddleverse} onClick={handleStartSun}>
        Start/Stop Sun
      </button>

      <button disabled={!fiddleverse} onClick={handleStartPyramid}>
        Start/Stop Pyramid
      </button>
    </article>
  )
}

export default PitchedScene
