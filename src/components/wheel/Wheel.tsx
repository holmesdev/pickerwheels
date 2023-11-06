import { Dispatch, memo, useEffect, useRef } from 'react'
import { Option } from './Option'
import { SelectedWheelSound, WheelActions } from './wheelReducer'
import robotoFlex from '@/utils/fonts'
import { SOUND_CATEGORY } from './SoundCategory'

const PI = Math.PI
const TAU = 2 * PI
const friction = 0.991 // 0.995=soft, 0.99=mid, 0.98=hard
const minimumAngularVelocity = 0.002 // Below that number will be treated as a stop
const rand = (min: number, max: number) => Math.random() * (max - min) + min

const playSound = (src: string, loop: boolean) => {
  const audio = new Audio(src)
  if (loop) {
    audio.loop = true
  }
  audio.play()
  return audio
}

function Wheel({
  options,
  colors,
  stoppedAngularPosition,
  showOptionLabels,
  selectedWheelSounds,
  height,
  width,
  dispatch,
}: {
  options: Option[]
  colors: string[]
  stoppedAngularPosition: number
  showOptionLabels: boolean
  selectedWheelSounds: SelectedWheelSound[]
  height: number
  width: number
  dispatch: Dispatch<WheelActions>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onSpin = useRef<() => void>()
  const currentAngularRotation = useRef(stoppedAngularPosition || 0)
  const spinningAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')!
    const optionCount = options.filter((o) => o.enabled).length
    const arc = TAU / optionCount

    let currentAngularVelocity = 0
    let maximumAngularVelocity = 0
    let isSpinning = false
    let isAccelerating = false
    let animationFrame: number | null = null

    const getSoundUrl = (soundCategoryId: SOUND_CATEGORY) =>
      selectedWheelSounds.find((s) => s.soundCategoryId === soundCategoryId)?.soundUrl

    //* CSS rotate CANVAS Element */
    const rotate = () => {
      ctx.canvas.style.transform = `rotate(${currentAngularRotation.current - PI / 2}rad)`
      // elSpin.textContent = !angVel ? 'SPIN' : sector.label
      // elSpin.style.background = sector.color
    }

    const drawSector = (option: Option, i: number) => {
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

    const frame = () => {
      if (!isSpinning) {
        return
      }

      if (currentAngularVelocity >= maximumAngularVelocity) {
        isAccelerating = false
      }

      if (isAccelerating) {
        currentAngularVelocity = (currentAngularVelocity || minimumAngularVelocity) * 1.1
      } else {
        currentAngularVelocity = currentAngularVelocity * friction

        // SPIN END:
        if (currentAngularVelocity < minimumAngularVelocity) {
          isSpinning = false
          currentAngularVelocity = 0
          cancelAnimationFrame(animationFrame!)
          const endSoundUrl = getSoundUrl(SOUND_CATEGORY.END)
          if (endSoundUrl) {
            playSound(endSoundUrl, false)
          }
          if (spinningAudioRef.current) {
            spinningAudioRef.current.pause()
          }
          dispatch({ type: 'SpinningStopped', stoppedAngularPosition: currentAngularRotation.current })
        }
      }

      const previousAngularRotation = currentAngularRotation.current
      currentAngularRotation.current = (currentAngularRotation.current + currentAngularVelocity) % TAU
      const tickSoundUrl = getSoundUrl(SOUND_CATEGORY.TICK)
      if (tickSoundUrl && Math.trunc(currentAngularRotation.current / arc) !== Math.trunc(previousAngularRotation / arc)) {
        playSound(tickSoundUrl, false)
      }

      rotate() // CSS rotate!
    }

    const engine = () => {
      frame()
      animationFrame = requestAnimationFrame(engine)
    }

    onSpin.current = () => {
      if (isSpinning) {
        return
      }
      dispatch({ type: 'Spin' })
      isSpinning = true
      isAccelerating = true
      maximumAngularVelocity = rand(0.5, 0.9)
      const startSoundUrl = getSoundUrl(SOUND_CATEGORY.START)
      if (startSoundUrl) {
        playSound(startSoundUrl, false)
      }
      const spinningSoundUrl = getSoundUrl(SOUND_CATEGORY.SPINNING)
      if (spinningSoundUrl) {
        spinningAudioRef.current = playSound(spinningSoundUrl, true)
      }
      engine() // Start engine!
    }

    // INIT!
    options.filter((option) => option.enabled).forEach((option, i) => drawSector(option, i))
    rotate()
  }, [colors, dispatch, options, showOptionLabels, stoppedAngularPosition, width, height, selectedWheelSounds])

  return (
    <div id="wheelWrapper" className="inline-flex relative overflow-hidden">
      <canvas id="wheel" ref={canvasRef} className="block" width={width} height={height}></canvas>
      <div
        id="spin"
        // eslint-disable-next-line max-len
        className="text-2xl select-none cursor-pointer flex justify-center items-center absolute top-[50%] left-[50%] w-[20%] h-[20%] m-[-10%] bg-slate-500 text-white shadow-[0_0_0_8px_currentColor,0_0px_15px_5px_rgba(0,0,0,0.6)] rounded-[50%] transition-[0.8s] after:absolute after:top-[-17px] after:border-[10px] after:border-solid after:border-transparent after:border-b-current after:[border-top:none] after:content-['']"
        onClick={onSpin.current}
      >
        Spin!
      </div>
    </div>
  )
}

export default memo(Wheel)
