import { Option } from './Option'
import { Sound } from './Sound'
import { SOUND_CATEGORY, SoundCategory } from './SoundCategory'
import { WheelSound } from './WheelSound'

const PI = Math.PI
const TAU = 2 * PI
const getIndex = (s: WheelState) => {
  const optionLength = s.options.filter((o) => o.enabled).length
  return Math.floor(optionLength - (s.stoppedAngularPosition / TAU) * optionLength) % optionLength
}

export function wheelReducer(state: WheelState, action: WheelActions): WheelState {
  switch (action.type) {
    case 'AddOption': {
      return {
        ...state,
        options: state.options.concat({
          id: Math.max(...state.options.map((o) => o.id)) + 1,
          label: action.label,
          enabled: true,
        }),
      }
    }
    case 'CloseWinnerDialog': {
      return {
        ...state,
        showWinnerDialog: false,
        options: action.hideOption
          ? state.options.map((o) =>
              o.id === state.options.filter((o) => o.enabled)[getIndex(state)].id ? { ...o, enabled: !o.enabled } : o
            )
          : state.options,
      }
    }
    case 'CopyOption': {
      const optionToCopy = state.options.find((o) => o.id === action.id)
      if (!optionToCopy) return state

      return {
        ...state,
        options: state.options.concat({
          id: Math.max(...state.options.map((o) => o.id)) + 1,
          label: optionToCopy.label,
          enabled: optionToCopy.enabled,
        }),
      }
    }
    case 'LoadSounds': {
      return { ...state, sounds: action.sounds }
    }
    case 'LoadSoundCategories': {
      return { ...state, soundCategories: action.soundCategories }
    }
    case 'LoadWheel': {
      return {
        ...state,
        shortUrl: action.wheel.short_url,
        stoppedAngularPosition: action.wheel.last_position,
        showOptionLabels: action.wheel.show_option_labels,
        options: action.wheel.wheel_options.map((o, i) => ({
          id: i,
          label: o.label,
          enabled: o.enabled,
        })),
        colors: action.wheel.wheel_colors.map((c) => c.hex_code),
        wheelSounds: action.wheel.wheel_sounds.map((ws) => ({
          soundCategoryId: ws.sound_category_id,
          soundId: ws.sound_id,
        })),
      }
    }
    case 'RemoveOption': {
      return {
        ...state,
        options: state.options.filter((o) => o.id !== action.id),
      }
    }
    case 'RenameOption': {
      return {
        ...state,
        options: state.options.map((o) => (o.id === action.id ? { ...o, label: action.label } : o)),
      }
    }
    case 'Spin': {
      return { ...state, isSpinning: true }
    }
    case 'SpinningStopped': {
      return { ...state, isSpinning: false, stoppedAngularPosition: action.stoppedAngularPosition, showWinnerDialog: true }
    }
    case 'ToggleOption': {
      return {
        ...state,
        options: state.options.map((o) => (o.id === action.id ? { ...o, enabled: !o.enabled } : o)),
      }
    }
    case 'ToggleOptionLabels': {
      return {
        ...state,
        showOptionLabels: !state.showOptionLabels,
      }
    }
    case 'UpdateWheelSound': {
      return {
        ...state,
        wheelSounds: state.wheelSounds
          .filter((s) => s.soundCategoryId !== action.soundCategoryId)
          .concat({ soundCategoryId: action.soundCategoryId, soundId: action.id }),
      }
    }
  }
}

export function getCurrentSelection(state: WheelState) {
  return state.options.filter((o) => o.enabled)[getIndex(state)]
}

export function getSelectedWheelSounds(state: WheelState): SelectedWheelSound[] {
  return state.wheelSounds.map((ws) => {
    const sound = state.sounds.find((s) => s.id === ws.soundId)
    return { soundCategoryId: ws.soundCategoryId, soundUrl: sound?.url }
  })
}

export type WheelState = {
  colors: string[]
  isSpinning: boolean
  options: Option[]
  shortUrl: string | null
  showOptionLabels: boolean
  showWinnerDialog: boolean
  stoppedAngularPosition: number
  sounds: Sound[]
  soundCategories: SoundCategory[]
  wheelSounds: WheelSound[]
}

export type WheelActions =
  | { type: 'AddOption'; label: string }
  | { type: 'CloseWinnerDialog'; hideOption: boolean }
  | { type: 'CopyOption'; id: number }
  | { type: 'LoadSounds'; sounds: Sound[] }
  | { type: 'LoadSoundCategories'; soundCategories: SoundCategory[] }
  | { type: 'LoadWheel'; wheel: WheelData }
  | { type: 'RemoveOption'; id: number }
  | { type: 'RenameOption'; id: number; label: string }
  | { type: 'Spin' }
  | { type: 'SpinningStopped'; stoppedAngularPosition: number }
  | { type: 'ToggleOption'; id: number }
  | { type: 'ToggleOptionLabels' }
  | { type: 'UpdateWheelSound'; soundCategoryId: number; id: number }

export const defaultInitialState: WheelState = {
  colors: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'], //https://coolors.co/palettes/trending
  isSpinning: false,
  options: [
    { id: 1, label: 'Pizza', enabled: true },
    { id: 2, label: 'Tacos', enabled: true },
    { id: 3, label: 'Pasta', enabled: true },
    { id: 4, label: 'Chicken', enabled: true },
    { id: 5, label: 'Chinese', enabled: true },
  ],
  shortUrl: null,
  showOptionLabels: true,
  showWinnerDialog: false,
  stoppedAngularPosition: 0,
  sounds: [],
  soundCategories: [],
  wheelSounds: [
    { soundCategoryId: SOUND_CATEGORY.START, soundId: 1 },
    { soundCategoryId: SOUND_CATEGORY.SPINNING, soundId: 2 },
    { soundCategoryId: SOUND_CATEGORY.TICK, soundId: 3 },
    { soundCategoryId: SOUND_CATEGORY.END, soundId: 4 },
  ],
}

export type WheelData = {
  short_url: string
  show_option_labels: boolean
  last_position: number
  wheel_options: {
    label: string
    enabled: boolean
  }[]
  wheel_colors: {
    hex_code: string
  }[]
  wheel_sounds: {
    sound_category_id: number
    sound_id: number
  }[]
}

export type SelectedWheelSound = {
  soundCategoryId: number
  soundUrl: string | undefined
}
