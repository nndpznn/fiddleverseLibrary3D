/**
 * Build out this component to display a “sandbox” scene—see the description below.
 */
import { useEffect, useRef } from 'react'

const CANVAS_WIDTH = 512
const CANVAS_HEIGHT = 512

const FRAMES_PER_SECOND = 30
const MILLISECONDS_PER_FRAME = 1000 / FRAMES_PER_SECOND

const Sandbox = props => {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const renderingContext = canvas.getContext('2d')

    let previousTimestamp
    const nextFrame = timestamp => {
      // Initialize the timestamp.
      if (!previousTimestamp) {
        previousTimestamp = timestamp
        window.requestAnimationFrame(nextFrame)
        return
      }

      // Check if it’s time to advance.
      const progress = timestamp - previousTimestamp
      if (progress < MILLISECONDS_PER_FRAME) {
        // Do nothing if it’s too soon.
        window.requestAnimationFrame(nextFrame)
        return
      }

      // This is not the code you’re looking for.
      renderingContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      renderingContext.fillText(`timestamp: ${timestamp}`, 10, 20)

      // Request the next frame.
      previousTimestamp = timestamp
      window.requestAnimationFrame(nextFrame)
    }

    window.requestAnimationFrame(nextFrame)
  }, [canvasRef])

  return (
    <article>
      <p>
        The sandbox scene is where you can demonstrate features/capabilities of your library solely for the purpose of
        demonstrating them. It doesn’t have to fit any particular pitch or application.
      </p>

      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}>
        Your favorite update-your-browser message here.
      </canvas>
    </article>
  )
}

export default Sandbox
