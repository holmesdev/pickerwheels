import { Option } from './option'

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
              o.id === state.options.filter((o) => o.enabled)[getIndex(state)].id ? { ...o, enabled: !o.enabled } : o,
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
  }
}

export function getCurrentSelection(state: WheelState) {
  return state.options.filter((o) => o.enabled)[getIndex(state)]
}

export type WheelState = {
  colors: string[]
  isSpinning: boolean
  options: Option[]
  shortUrl: string | null
  showOptionLabels: boolean
  showWinnerDialog: boolean
  stoppedAngularPosition: number
}

export type WheelActions =
  | { type: 'AddOption'; label: string }
  | { type: 'CloseWinnerDialog'; hideOption: boolean }
  | { type: 'CopyOption'; id: number }
  | { type: 'RemoveOption'; id: number }
  | { type: 'RenameOption'; id: number; label: string }
  | { type: 'Spin' }
  | { type: 'SpinningStopped'; stoppedAngularPosition: number }
  | { type: 'ToggleOption'; id: number }
  | { type: 'ToggleOptionLabels' }

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
}
