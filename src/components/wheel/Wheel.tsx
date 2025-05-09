import { Dispatch, memo, useEffect, useRef, useCallback } from 'react'
import { Option } from './option'
import { WheelActions } from './wheelReducer'
import robotoFlex from '@/utils/fonts'

const PI = Math.PI
const TAU = 2 * PI
const accelerationStopPercentage = 0.1
const duration = 6000
const rotationsForSpin = (duration / 1000) * 3
const rand = (min: number, max: number) => Math.random() * (max - min) + min
const TARGET_FPS = 120
const FRAME_TIME = 1000 / TARGET_FPS

// Improved easing function for more natural wheel physics
function easeInOutCubic(progressPercentage: number) {
  if (progressPercentage < accelerationStopPercentage) {
    // Acceleration phase - cubic ease-in
    const t = progressPercentage / accelerationStopPercentage
    return t * t * t
  } else {
    // Deceleration phase - cubic ease-out
    const t = (progressPercentage - accelerationStopPercentage) / (1 - accelerationStopPercentage)
    return 1 - (1 - t) * (1 - t) * (1 - t)
  }
}

function Wheel({
  options,
  colors,
  stoppedAngularPosition,
  showOptionLabels,
  height,
  width,
  dispatch,
}: {
  options: Option[]
  colors: string[]
  stoppedAngularPosition: number
  showOptionLabels: boolean
  height: number
  width: number
  dispatch: Dispatch<WheelActions>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const startingAngularRotation = useRef(stoppedAngularPosition || 0)
  const currentAngularRotation = useRef(stoppedAngularPosition || 0)
  const offsetToNewWinner = useRef(PI / 2)
  const optionCount = options.filter((o) => o.enabled).length
  const arc = TAU / optionCount
  const lastFrameTime = useRef(0)
  const animationFrameId = useRef<number>(0)

  let animationZero = 0
  let isSpinning = false

  const endSpin = () => {
    isSpinning = false
    animationZero = 0
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
    dispatch({ type: 'SpinningStopped', stoppedAngularPosition: currentAngularRotation.current % TAU })
  }

  const drawWheel = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const drawSector = (ctx: CanvasRenderingContext2D, option: Option, i: number) => {
        const ang = arc * i
        const diameter = ctx.canvas.width
        const radius = diameter / 2
        ctx.save()
        // COLOR
        ctx.beginPath()
        ctx.fillStyle = colors[i % colors.length]
        ctx.moveTo(radius, radius)
        ctx.arc(radius, radius, radius, ang, ang + arc)
        ctx.lineTo(radius, radius)
        ctx.fill()
        // TEXT
        ctx.translate(radius, radius)
        ctx.rotate(ang + arc / 2)
        ctx.textAlign = 'right'
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 30px ' + robotoFlex.style.fontFamily
        ctx.fillText(showOptionLabels ? option.label : '?', radius - 10, 10)
        //
        ctx.restore()
      }

      const centerX = ctx.canvas.width / 2
      const centerY = ctx.canvas.height / 2
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(currentAngularRotation.current - PI / 2)
      ctx.translate(-centerX, -centerY)
      options.filter((option) => option.enabled).forEach((option, i) => drawSector(ctx, option, i))
      ctx.restore()
    },
    [options, colors, showOptionLabels, arc],
  )

  const frame = (timestamp: number) => {
    if (!animationZero) {
      animationZero = timestamp
      lastFrameTime.current = timestamp
    }

    // Calculate time since last frame
    const deltaTime = timestamp - lastFrameTime.current

    // Only update if enough time has passed for 60 FPS
    if (deltaTime >= FRAME_TIME) {
      const progress = Math.min((timestamp - animationZero) / duration, 1)
      const easedProgress = easeInOutCubic(progress)
      currentAngularRotation.current = (rotationsForSpin * TAU + offsetToNewWinner.current) * easedProgress + startingAngularRotation.current
      drawWheel(canvasRef.current!.getContext('2d')!)
      lastFrameTime.current = timestamp
    }

    if (timestamp - animationZero < duration) {
      animationFrameId.current = requestAnimationFrame(frame)
    } else {
      endSpin()
    }
  }

  const onSpin = () => {
    if (isSpinning) {
      return
    }
    dispatch({ type: 'Spin' })
    isSpinning = true
    startingAngularRotation.current = currentAngularRotation.current
    offsetToNewWinner.current = rand(0, TAU)
    animationFrameId.current = requestAnimationFrame(frame)
  }

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  // Initialize wheel on mount and when dependencies change
  useEffect(() => {
    drawWheel(canvasRef.current!.getContext('2d')!)
  }, [drawWheel, width, height])

  return (
    <div id="wheelWrapper" className="inline-flex relative overflow-hidden">
      <canvas id="wheel" ref={canvasRef} className="block" width={width} height={height}></canvas>
      <div
        id="spin"
        // eslint-disable-next-line max-len
        className="text-2xl select-none cursor-pointer flex justify-center items-center absolute top-[50%] left-[50%] w-[20%] h-[20%] m-[-10%] bg-slate-500 text-white shadow-[0_0_0_8px_currentColor,0_0px_15px_5px_rgba(0,0,0,0.6)] rounded-[50%] transition-[0.8s] after:absolute after:top-[-17px] after:border-10 after:border-solid after:border-transparent after:border-b-current after:[border-top:none] after:content-['']"
        onClick={onSpin}
      >
        Spin!
      </div>
    </div>
  )
}

export default memo(Wheel)
