'use client'

import { useEffect, useReducer, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import useWindowDimensions from '@/hooks/useWindowDimensions'
import OptionsEditor from './OptionsEditor'
import WinnerDialog from './WinnerDialog'
import { WheelData, WheelState, defaultInitialState, getCurrentSelection, wheelReducer } from './wheelReducer'
import Wheel from './Wheel'
import { Database } from '@/db/types'
import { Button, IconButton } from '@mui/material'
import Share from '@mui/icons-material/Share'
import Twitter from '@mui/icons-material/Twitter'
import { useSnackbar } from 'notistack'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import useCurrentUrl from '@/hooks/useCurrentUrl'
import { SupabaseClient } from '@supabase/supabase-js'

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

function saveData(supabase: SupabaseClient<Database>, router: AppRouterInstance, state: WheelState) {
  return supabase
    .rpc('upsert_wheel', {
      short_url: state.shortUrl || null,
      last_position: state.stoppedAngularPosition,
      show_option_labels: state.showOptionLabels,
      option_labels: state.options.map((o) => o.label),
      options_enabled: state.options.map((o) => o.enabled),
      colors: state.colors,
    })
    .then((response) => {
      if (!response.error && !state.shortUrl) {
        router.replace('/' + response.data)
      }
      return response
    })
}

export default function WheelPage({ wheelData }: { wheelData: WheelData | null }) {
  const supabase = createClient()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const isUpdate = useRef(false)
  const { width: windowWidth } = useWindowDimensions()
  const currentUrl = useCurrentUrl()
  const [state, dispatch] = useReducer(wheelReducer, getInitialState(wheelData))

  const share = () => {
    saveData(supabase, router, state).then(() => {
      if (typeof navigator.share !== 'undefined') {
        navigator.share({ title: 'Picker Wheels', url: currentUrl })
      } else {
        navigator.clipboard.writeText(currentUrl).then(() => {
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
      <main className="flex min-h-screen flex-col items-center p-4 pt-8">
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl w-full mx-auto md:justify-center">
          {/* Wheel Section */}
          <div className="flex flex-col items-center gap-4">
            <Wheel
              options={state.options}
              colors={state.colors}
              stoppedAngularPosition={state.stoppedAngularPosition}
              showOptionLabels={state.showOptionLabels}
              width={wheelWidth}
              height={wheelHeight}
              dispatch={dispatch}
            />
            <div className="flex gap-2">
              <Button onClick={share} variant="contained" startIcon={<Share />}>
                Share
              </Button>
              <IconButton
                href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20wheel%20at&url=${currentUrl}`}
                target="_blank"
                color="primary"
              >
                <Twitter />
              </IconButton>
            </div>
          </div>

          {/* Options Section */}
          <div className="w-full md:w-auto md:min-w-[300px]">
            <OptionsEditor options={state.options} dispatch={dispatch} />
          </div>
        </div>
      </main>
      <WinnerDialog open={state.showWinnerDialog} label={currentSelectionLabel} dispatch={dispatch} />
    </>
  )
}
