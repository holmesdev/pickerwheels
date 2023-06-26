'use client'

import { useEffect, useReducer, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SupabaseClient, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import useWindowDimensions from '@/hooks/useWindowDimensions'
import OptionsEditor from './OptionsEditor'
import WinnerDialog from './WinnerDialog'
import { WheelData, WheelState, defaultInitialState, getCurrentSelection, wheelReducer } from './wheelReducer'
import Wheel from './Wheel'
import { Database } from '@/db/types'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { Button } from '@mui/material'
import { Share } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

function getInitialState(wheelData: WheelData | null) {
  let initialState = { ...defaultInitialState }
  if (wheelData) {
    initialState = {
      ...initialState,
      shortUrl: wheelData.short_url,
      stoppedAngularPosition: wheelData.last_position || defaultInitialState.stoppedAngularPosition,
      showOptionLabels: wheelData.show_option_labels || defaultInitialState.showOptionLabels,
      options: wheelData.wheel_options.map((o, i) => ({
        id: i,
        label: o.label,
        enabled: o.enabled,
      })),
      colors: wheelData.wheel_colors.map((c) => c.hex_code),
    }
  }
  return initialState
}

async function saveData(supabase: SupabaseClient<Database>, router: AppRouterInstance, state: WheelState) {
  const { data, error } = await supabase.rpc('upsert_wheel', {
    short_url: state.shortUrl || null,
    last_position: state.stoppedAngularPosition,
    show_option_labels: state.showOptionLabels,
    option_labels: state.options.map((o) => o.label),
    options_enabled: state.options.map((o) => o.enabled),
    colors: state.colors,
  })
  if (!error && !state.shortUrl) {
    router.replace('/' + data)
  }
}

export default function WheelPage({ wheelData }: { wheelData: WheelData | null }) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const isUpdate = useRef(false)
  const { width: windowWidth } = useWindowDimensions()
  const [state, dispatch] = useReducer(wheelReducer, getInitialState(wheelData))

  const share = () => {
    saveData(supabase, router, state).then(() => {
      if (typeof navigator.share !== 'undefined') {
        navigator.share({ title: 'Spinner Wheel', url: window.location.href })
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          enqueueSnackbar('Link copied to clipboard', { variant: 'success' })
        })
      }
    })
  }

  useEffect(() => {
    if (state.shortUrl && isUpdate.current) {
      saveData(supabase, router, state)
    }

    isUpdate.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.shortUrl, state.stoppedAngularPosition, state.showOptionLabels, state.options, state.colors])

  const wheelWidth = Math.min(windowWidth - 20, 500)
  const wheelHeight = Math.min(windowWidth - 20, 500)
  const currentSelectionLabel = getCurrentSelection(state).label

  return (
    <>
      <main className="flex min-h-screen flex-row items-start justify-center gap-5 flex-wrap mt-3">
        <OptionsEditor options={state.options} dispatch={dispatch} />
        <Button onClick={share}>
          <Share />
          Share
        </Button>
        <Wheel
          options={state.options}
          colors={state.colors}
          stoppedAngularPosition={state.stoppedAngularPosition}
          showOptionLabels={state.showOptionLabels}
          width={wheelWidth}
          height={wheelHeight}
          dispatch={dispatch}
        />
      </main>
      <WinnerDialog open={state.showWinnerDialog} label={currentSelectionLabel} dispatch={dispatch} />
    </>
  )
}
