'use client'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { NextAppDirEmotionCacheProvider } from './EmotionCache'
import { useTheme } from '@/hooks/useTheme'
import { CssBaseline } from '@mui/material'

export default function ThemeProvider({ darkModeCookie, children }: { darkModeCookie: string | undefined; children: React.ReactNode }) {
  const theme = useTheme(darkModeCookie)
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  )
}
