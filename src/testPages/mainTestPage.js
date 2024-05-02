import { useState, useEffect, useRef } from 'react'

import { Fiddleverse } from '../fiddleverse/fiddleverse'
import { octocylinderShape } from '../fiddleverse/octocylinder'
import { cubeShape } from '../fiddleverse/cube'
import RotationMatrix from '../matrix-library/rotationMatrix'
import TranslationMatrix from '../matrix-library/translationMatrix'

const MainTest = props => {

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
    const grayColor = {r: 0.3,  g: 0.3,  b: 0.3}

    const cubeTest = new cubeShape(gl, blueColor, 0.5, {x: 0, y: 0, z: 0})
    cubeTest.wireframe = false
    cubeTest.smooth = true

    const octocylinderTest = new octocylinderShape(gl, blueColor)
    octocylinderTest.wireframe = false
    // octocylinderTest.smooth = true

    const octocylinderOutline = new octocylinderShape(gl, grayColor)
    octocylinderOutline.wireframe = true

    // octocylinderTest.add(octocylinderOutline)

    const tiltMatrix = new RotationMatrix(0, 1, 0, 0)
    const move100 = new TranslationMatrix(0,0,-100)
    // octocylinderTest.setInstanceTransformation(move100)

    // Pass the vertices to WebGL.
    fiddleverse.add(octocylinderTest)
    
    fiddleverse.process()
    fiddleverse.light = [0, 0, -1]
    fiddleverse.cameraPosition = [0, 0, -1]
    fiddleverse.cameraView = [0, 0, 0]

    /*
     * Displays the scene.
     */
    let currentRotation = 0.0
    fiddleverse.drawScene()

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

      const rotateOctoX = new RotationMatrix(DEGREES_PER_MILLISECOND, 1, 0, 0)
      const rotateOctoY = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 1, 0)
      const rotateOctoZ = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 0, 1)

      octocylinderTest.setInstanceTransformation(rotateOctoX)
      octocylinderTest.setInstanceTransformation(rotateOctoY)
      octocylinderTest.setInstanceTransformation(rotateOctoZ)

      cubeTest.setInstanceTransformation(rotateOctoX)
      cubeTest.setInstanceTransformation(rotateOctoY)
      cubeTest.setInstanceTransformation(rotateOctoZ)

      const moveMatrix = new TranslationMatrix(0, 0, -1)
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

      fiddleverse.drawScene()

      // Request the next frame.
      previousTimestamp = timestamp
      window.requestAnimationFrame(advanceScene)
    }

    // Draw the initial scene.
    fiddleverse.drawScene()

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
        fiddleverse.drawScene()
      }
    })
  }, [canvasRef])


  // Set up the rotation toggle: clicking on the canvas does it.
  const handleCanvasClick = event => fiddleverse.toggleRotation()

  const handleSwitchCamera = event => {
    fiddleverse.switchCamera()
  }

  return (
    <article>
      {/* Yes, still square. */}
      <canvas width="1024" height="512" ref={canvasRef} onClick={fiddleverse ? handleCanvasClick : undefined}>
        Your favorite update-your-browser message here.
      </canvas>

      <button disabled={!fiddleverse} onClick={handleSwitchCamera}>
            Switch Camera
      </button>

    </article>
  )
}

export default MainTest
