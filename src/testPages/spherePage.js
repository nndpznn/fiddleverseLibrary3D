import { useState, useEffect, useRef } from 'react'

// import { initSimpleShaderProgram } from './glsl-utilities'
import { Fiddleverse } from '../fiddleverse/fiddleverse'
import IcosphereThing from '../fiddleverse/IcosphereThing'
import RotationMatrix from '../matrix-library/rotationMatrix'
import TranslationMatrix from '../matrix-library/translationMatrix'

const SphereTest = props => {

  const screenHeight = 4
  const screenWidth = 8
  var smoothOrNah = true

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
    const grayColor = {r: 0.25, g: 0.25, b: 0.25}

    const icosphereTest = new IcosphereThing(gl, grayColor)
    icosphereTest.wireframe = false
    icosphereTest.smooth = true
    const icosphereFrame = new IcosphereThing(gl, blueColor)

    const move100 = new TranslationMatrix(0,0,-100)
    // icosphereTest.setInstanceTransformation(move100)

    // Pass the vertices to WebGL.
    fiddleverse.add(icosphereTest)
    fiddleverse.add(icosphereFrame)
    
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
      },

      toggleGeometry: () => {
        fiddleverse.toggleGeometry()
        //Redraw scene so that we can see the change
        fiddleverse.drawScene(currentRotation)
      },

      toggleWireframe: () => {
        fiddleverse.toggleWireframe()
        fiddleverse.drawScene(currentRotation)
      },

      toggleProjection: () => {
        fiddleverse.toggleProjection()
        fiddleverse.drawScene(currentRotation)
      },
    })
  }, [canvasRef, smoothOrNah])

  // Set up the rotation toggle: clicking on the canvas does it.
  const handleCanvasClick = event => fiddleverse.toggleRotation()

  const handleToggleGeometry = event => {
    fiddleverse.toggleGeometry()
    smoothOrNah = !smoothOrNah
  }

  const handleToggleWireframe = event => {
    fiddleverse.toggleWireframe()
  }

  const handleToggleProjection = event => {
    fiddleverse.toggleProjection()
  }

  return (
    <article>
      {/* Yes, still square. */}
      {/* <h1>This sphere makes use of our {smoothOrNah ? "smooth" : "faceted"} geometry.</h1> */}
      <h1>This sphere makes use of our smooth/faceted geometry.</h1>
      <canvas width="1024" height="512" ref={canvasRef} onClick={fiddleverse ? handleCanvasClick : undefined}>
        Your favorite update-your-browser message here.
      </canvas>

      <button disabled={!fiddleverse} onClick={handleToggleGeometry}>
            Toggle Geometry
      </button>
      <button disabled={!fiddleverse} onClick={handleToggleWireframe}>
            Toggle Wireframe
      </button>
      <button disabled={!fiddleverse} onClick={handleToggleProjection}>
            Toggle Ortho/Perspective
      </button>
      
    </article>
  )
}

export default SphereTest
