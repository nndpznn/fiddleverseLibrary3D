import { useState, useEffect, useRef } from 'react'

// import { initSimpleShaderProgram } from './glsl-utilities'
import { Fiddleverse } from '../fiddleverse/fiddleverse'
import { cubeShape } from '../fiddleverse/cube'
import { AsteroidThing } from '../fiddleverse/AsteroidThing'
import FiddlewingThing from '../fiddleverse/FiddlewingThing'
import TranslationMatrix from '../matrix-library/translationMatrix'
// import ScaleMatrix from './matrix-library/scaleMatrix'
import RotationMatrix from '../matrix-library/rotationMatrix'

const TestPage3 = props => {

  const screenHeight = 4
  const screenWidth = 8

  const [fiddleverse, setFiddleverse] = useState(null)
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Grab the WebGL rendering context.
    const fiddleverse = new Fiddleverse(canvas, screenHeight, screenWidth)
    const gl = fiddleverse.gl

    const blueColor = {r: 0.18, g: 0.62, b: 0.82}
    const grayColor = {r:0.3,g:0.3,b:0.3}

    const translationMatrix = new TranslationMatrix(0.25, 0, 0)
    const rotationMatrix = new RotationMatrix(45, 1, 0, 0)
    const comboMatrix = rotationMatrix.multiply(translationMatrix)

    const cubeThing = new cubeShape(gl, grayColor, 0.5, {x: 0, y: 0, z: 0})
    cubeThing.wireframe = false
  
    const cubeTest = new cubeShape(gl, blueColor, 0.5, {x: 0, y: 0, z: 0})
    cubeTest.wireframe = true

    const asteroidTest = new AsteroidThing(gl, blueColor, 0.1, {x: 0, y: 0, z: 0})

    const fiddlewingTest = new FiddlewingThing(gl)
    fiddlewingTest.wireframe = false
    fiddlewingTest.setInstanceTransformation(comboMatrix)

    const wingFrame = new FiddlewingThing(gl, blueColor)
    wingFrame.setInstanceTransformation(new TranslationMatrix(0, -0.25, 0))
    fiddlewingTest.add(wingFrame)
    
    // Pass the vertices to WebGL.
    // fiddleverse.add(cubeTest.meshThing(gl))
    // fiddleverse.add(cubeThing.meshThing(gl))

    fiddleverse.add(asteroidTest)
    fiddleverse.add(fiddlewingTest)
  
    
    fiddleverse.process()

    console.log(fiddlewingTest)

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
      <h1>Reload the page -- the asteroid uses randomly generated vertices!</h1>
      <canvas width="1024" height="512" ref={canvasRef} onClick={fiddleverse ? handleCanvasClick : undefined}>
        Your favorite update-your-browser message here.
      </canvas>
      <h1>NOTE - the wing frame is offset on purpose to test child transformation</h1>
    </article>
  )
}

export default TestPage3