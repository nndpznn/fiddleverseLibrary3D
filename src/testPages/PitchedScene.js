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
import StarTest from './starPage'
import IcosphereThing from '../fiddleverse/IcosphereThing'
import SphereTest from './spherePage'
// import IcosphereThing from '../fiddleverse/IcosphereThing'
// import icosphereTest from '../fiddleverse/IcosphereThing'
// import FiddlewingThing from '../fiddleverse/FiddlewingThing'


const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 512

const FRAMES_PER_SECOND = 30
const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

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

 const cubeTest = new cubeShape(gl, blueColor, 0.5, {x: 0, y: 0, z: 0})
 cubeTest.wireframe = false
 cubeTest.smooth = true

 const octocylinderTest = new octocylinderShape(gl, blueColor)
 octocylinderTest.wireframe = false
 octocylinderTest.smooth = true

 const octocylinderOutline = new octocylinderShape(gl, grayColor)
 octocylinderOutline.wireframe = true

 const starTest = new StarShape(gl, blueColor, 0.5, {x: 0, y: 0, z: 0})
 starTest.wireframe = false
 starTest.smooth = true

//  const sphereTest = new IcosphereThing(gl, blueColor, 0.5, {x: 0, y: 0, z: 0})
//  cubeTest.wireframe = false
//  cubeTest.smooth = true

//  const FiddlewingTest = new FiddlewingThing(gl, blueColor, 0.5, {x: 0, y: 0, z: 0})
//  cubeTest.wireframe = false
//  cubeTest.smooth = true
 

 const tiltMatrix = new RotationMatrix(0, 1, 0, 0)
 const move100 = new TranslationMatrix(0,0,-100)
 const moveLeft = new TranslationMatrix(-2, 0, 0)
 octocylinderTest.setInstanceTransformation(moveLeft)
 const moveRight = new TranslationMatrix(2, 0, 0)
 cubeTest.setInstanceTransformation(moveRight)
 starTest.setInstanceTransformation(moveRight)
 


 // Pass the vertices to WebGL.
 fiddleverse.add(octocylinderTest)
 fiddleverse.add(cubeTest)
 fiddleverse.add(starTest)
//  fiddleverse.add(sphereTest)
 
 fiddleverse.process()
 fiddleverse.light = [0, -1, 0]
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

   const rotateOctoX = new RotationMatrix(DEGREES_PER_MILLISECOND, 1, 0, 0)
   const rotateOctoY = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 1, 0)
   const rotateOctoZ = new RotationMatrix(DEGREES_PER_MILLISECOND, 0, 0, 1)

   octocylinderTest.setInstanceTransformation(rotateOctoX)
  //  octocylinderTest.setInstanceTransformation(rotateOctoY)
  //  octocylinderTest.setInstanceTransformation(rotateOctoZ)

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
  const handleStartStop = event => fiddleverse.toggleRotation()

  const handleSwitchCamera = event => {
    fiddleverse.switchCamera()
  }

  return (
    <article>
      <p>Use this component to implement your pitched scene—the one with an intended purpose, use cases, etc.</p>

      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}>
        Your favorite update-your-browser message here.
      </canvas>

      <button disabled={!fiddleverse} onClick={handleStartStop}>
            Start/Stop
      </button>

      <button disabled={!fiddleverse} onClick={handleSwitchCamera}>
            Switch Camera
      </button>

    </article>
  )
}

export default PitchedScene
