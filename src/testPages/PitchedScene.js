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

const PitchedScene = props => {
  const screenHeight = 4
  const screenWidth = 8

  const [fiddleverse, setFiddleverse] = useState(null)
  const canvasRef = useRef()

  useEffect(() => {
    let cubeMoving = false
    let ufoMoving = false
    let sunMoving = false
    let shipMoving = false

    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    // Grab the WebGL rendering context.
    const fiddleverse = new Fiddleverse(canvas, screenHeight, screenWidth)
    const gl = fiddleverse.gl

    const blueColor = { r: 0.18, g: 0.62, b: 0.82 }
    const grayColor = { r: 0.3, g: 0.3, b: 0.3 }
    const yellowColor = { r: 0.95, g: 0.73, b: 0.05 }
    const redColor = { r: 255, g: 0, b: 0 }
    const whiteColor = { r: 255, g: 255, b: 255 }
    const orangeColor = { r: 255, g: 15, b: 0 }
    const greenColor = { r: 0, g: 255, b: 0 }

    const cameraPositions = [
      [0, 0, -1],
      [-0.5, 0, -0.5],
      [-1, 0, 0],
      [-0.5, 0, 0.5],
      [0, 0, 1],
      [0.5, 0, 0.5],
      [1, 0, 0],
      [0.5, 0, -0.5]
    ]
    let cameraPosition = 0

    // MATRICES
    const moveLeft = new TranslationMatrix(-2.3, 0, 0)
    const moveRight = new TranslationMatrix(2, 0, 0)
    const moveUp = new TranslationMatrix(0, 1, 0)
    const setMiddle = new TranslationMatrix(0, 0, 0)
    const halfSize = new ScaleMatrix(0.5, 0.5, 0.5)
    const stretch = new ScaleMatrix(0, 0, 0.25)
    //

    // SATELLITE
    const satelliteBody = new octocylinderShape(gl, blueColor)
    satelliteBody.wireframe = false
    satelliteBody.smooth = false
    const rotateOctoX = new RotationMatrix(90, 1, 0, 0)
    satelliteBody.setInstanceTransformation(rotateOctoX)

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

    satelliteBody.add(wing1)
    satelliteBody.add(wing2)

    satelliteBody.setInstanceTransformation(halfSize)
    satelliteBody.setInstanceTransformation(moveLeft)
    //

    // UFO
    const ufo = new cubeShape(gl, grayColor, 0.5, { x: 0, y: 0, z: 0 })
    ufo.wireframe = false
    ufo.smooth = false

    const pyramid1Test = new pyramidShape(gl, grayColor)
    pyramid1Test.wireframe = false
    pyramid1Test.smooth = false

    const pyramid2Test = new pyramidShape(gl, grayColor)
    pyramid2Test.wireframe = false
    pyramid2Test.smooth = false

    const ufoBeam = new octocylinderShape(gl, greenColor)
    ufoBeam.lockedFrame = true

    pyramid1Test.setInstanceTransformation(new RotationMatrix(90, 0, 0, 1))
    pyramid1Test.setInstanceTransformation(new TranslationMatrix(1, 0, 0))
    pyramid2Test.setInstanceTransformation(new RotationMatrix(-90, 0, 0, 1))
    pyramid2Test.setInstanceTransformation(new TranslationMatrix(3, 0, 0))
    ufoBeam.setInstanceTransformation(new TranslationMatrix(2, -1.0, 0))
    ufoBeam.setInstanceTransformation(new ScaleMatrix(1, 0.75, 0.75))
    ufo.setInstanceTransformation(moveRight)

    ufo.add(pyramid1Test)
    ufo.add(pyramid2Test)
    ufo.add(ufoBeam)

    ufo.setInstanceTransformation(halfSize)
    ufo.setInstanceTransformation(new TranslationMatrix(2, 0, 0))
    //

    // SUN
    const starTest = new StarShape(gl, 0.65, yellowColor, { x: 0, y: 0, z: 0 })
    starTest.wireframe = false
    starTest.smooth = false

    const sunBody = new IcosphereThing(gl, yellowColor)
    sunBody.wireframe = false
    sunBody.smooth = true

    starTest.add(sunBody)
    starTest.setInstanceTransformation(halfSize)
    // starTest.setInstanceTransformation(moveLeft)
    // sunBody.setInstanceTransformation(moveLeft)
    //

    // ROCKET
    const rocketBody = new cubeShape(gl, whiteColor, 0.5, { x: 0, y: 0, z: 0 })
    rocketBody.setInstanceTransformation(new ScaleMatrix(1, 1.5, 1))
    rocketBody.wireframe = false
    rocketBody.smooth = false

    const rocketTop = new pyramidShape(gl, redColor)
    rocketTop.wireframe = false
    rocketTop.smooth = false

    const rocketEngine = new pyramidShape(gl, grayColor)
    rocketEngine.wireframe = false
    rocketEngine.smooth = false

    const octocylinderOutline = new octocylinderShape(gl, grayColor)
    octocylinderOutline.wireframe = true

    const rocketBooster = new pyramidShape(gl, orangeColor)
    rocketBooster.wireframe = false
    rocketBooster.smooth = false

    rocketTop.setInstanceTransformation(new TranslationMatrix(0, 1.25, 0))
    rocketEngine.setInstanceTransformation(new TranslationMatrix(0, -0.75, 0))
    rocketBooster.setInstanceTransformation(new TranslationMatrix(0, -0.85, 0))

    rocketBody.add(rocketTop)
    rocketBody.add(rocketEngine)
    rocketEngine.add(rocketBooster)

    rocketBody.setInstanceTransformation(new ScaleMatrix(0.4, 0.4, 0.4))
    rocketBody.setInstanceTransformation(new RotationMatrix(-90, 0, 0, 1))
    rocketBody.setInstanceTransformation(new TranslationMatrix(0, -1.25, 0))

    rocketBody.setInstanceTransformation(new TranslationMatrix(-4, 0, 0))
    
    //

    // PROCESSING
    fiddleverse.add(satelliteBody)
    fiddleverse.add(ufo)
    fiddleverse.add(starTest)
    fiddleverse.add(rocketBody)

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

    const FRAMES_PER_SECOND = 60
    const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

    const DEGREES_PER_MILLISECOND = 0.5
    const FULL_CIRCLE = 360.0

    let boosterScale = 1.025
    let beamScale = .01
    let currentBeamY = -1

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
      const rotateXFast = new RotationMatrix(2, 1, 0, 0)
      const rotateY = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 1, 0)
      const rotateYFast = new RotationMatrix(2, 0, 1, 0)
      const rotateZ = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 0, 1)
      const rotateZFast = new RotationMatrix(2, 0, 0, 1)

      satelliteBody.setInstanceTransformation(rotateX)
      // satelliteBody.setInstanceTransformation(rotateY)
      satelliteBody.setInstanceTransformation(rotateZ)

      ufoBeam.setInstanceTransformation(new TranslationMatrix(0, beamScale, 0))
      currentBeamY += beamScale
      if(currentBeamY >= -0.66 || currentBeamY <= -1){
        beamScale = -beamScale
      }
      

      if (ufoMoving) {
        ufo.setInstanceTransformation(rotateYFast)
        if(!ufoBeam.present){
          ufoBeam.setInstanceTransformation(rotateYFast)
        }
      }

      if (currentRotation >= FULL_CIRCLE) {
        currentRotation -= FULL_CIRCLE
      }

      if (sunMoving) {
        starTest.setInstanceTransformation(rotateY)
        sunBody.setInstanceTransformation(rotateZ)
      }

      if (currentRotation >= FULL_CIRCLE) {
        currentRotation -= FULL_CIRCLE
      }

      if (shipMoving) {
        rocketBody.setInstanceTransformation(new TranslationMatrix(0.05, 0, 0))
        rocketBooster.setInstanceTransformation(new ScaleMatrix(boosterScale, 1.0, 1.0))
        boosterScale = 1/boosterScale
        if(!rocketEngine.present){
          rocketEngine.setInstanceTransformation(new TranslationMatrix(0.05, 0, 0))
        }
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

      switchCamera: () => {
        console.log('Switching camera')

        if (cameraPosition === cameraPositions.length - 1) {
          cameraPosition = 0
        } else {
          cameraPosition++
        }

        fiddleverse.cameraPosition = cameraPositions[cameraPosition]

        //Redraw scene so that we can see the change
        fiddleverse.drawScene()
      },

      startCube: () => {
        cubeMoving = !cubeMoving //look here for cube when searching
      },

      startUFO: () => {
        ufoMoving = !ufoMoving
      },

      toggleUFOCamo: () =>{
        ufo.wireframe = !ufo.wireframe
        if(ufo.wireframe){
          ufo.remove(ufoBeam)
        }
        else{
          ufo.add(ufoBeam)
        }
      },

      startSun: () => {
        sunMoving = !sunMoving
      },

      startShip: () => {
        shipMoving = !shipMoving
      },

      addRemoveEngine: () => {
        console.log("Toggling engine")
        if (rocketEngine.present) {
          rocketBody.remove(rocketEngine)
          fiddleverse.drawScene(currentRotation)
        } else {
          rocketBody.add(rocketEngine)
          fiddleverse.drawScene(currentRotation)
        }
      },

      removeSomething: () => {
        if (satelliteBody.present) {
          fiddleverse.remove(satelliteBody)
          fiddleverse.drawScene()
        } else {
          fiddleverse.add(satelliteBody)
          fiddleverse.drawScene()
        }
      }
    })
  }, [canvasRef])

  // Set up the rotation toggle: clicking on the canvas does it.
  const handleStartStop = event => fiddleverse.toggleRotation()

  const handleSwitchCamera = event => fiddleverse.switchCamera()

  // const handleStartCube = event => fiddleverse.startCube()

  const handleStartUFO = event => fiddleverse.startUFO()

  const handleUFOCamo = event => fiddleverse.toggleUFOCamo()

  const handleRemove = event => fiddleverse.removeSomething()

  const handleStartSun = event => fiddleverse.startSun()

  const handleStartShip = event => fiddleverse.startShip()

  const handleAddRemoveEngine = event => {
    if (fiddleverse) {
      fiddleverse.addRemoveEngine()
    }
  }

  return (
    <article>
      <p>Use this component to implement your pitched scene—the one with an intended purpose, use cases, etc.</p>

      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} style={{ backgroundColor: 'black' }}>
        Your favorite update-your-browser message here.
      </canvas>

      <button disabled={!fiddleverse} onClick={handleStartStop}>
        Master Start/Stop
      </button>

      <button disabled={!fiddleverse} onClick={handleSwitchCamera}>
        Switch Camera
      </button>

      <button disabled={!fiddleverse} onClick={handleStartUFO}>
        Start/Stop UFO
      </button>

      <button disabled={!fiddleverse} onClick={handleUFOCamo}>
        Engage UFO Camo
      </button>

      <button disabled={!fiddleverse} onClick={handleRemove}>
        Add/Remove Satellite
      </button>

      <button disabled={!fiddleverse} onClick={handleStartSun}>
        Start/Stop Sun
      </button>

      <button disabled={!fiddleverse} onClick={handleStartShip}>
        Launch Rocket
      </button>

      <button disabled={!fiddleverse} onClick={handleAddRemoveEngine}>
        Add/Remove Engine
      </button>
    </article>
  )
}

export default PitchedScene
