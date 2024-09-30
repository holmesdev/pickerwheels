import { createTheme, ThemeOptions } from '@mui/material/styles'

import RobotoFlex from '@/utils/fonts'
import { useDarkMode } from './useDarkMode'
import Link from 'next/link'
import { forwardRef } from 'react'

export function useTheme(darkModeCookie: string | undefined) {
  const darkMode = useDarkMode(darkModeCookie)
  const LinkBehavior = forwardRef(function LinkBehavior(props: any, ref) {
    return <Link ref={ref} {...props} />
  })
  return createTheme(
    {
      components: {
        MuiLink: {
          defaultProps: {
            // @ts-ignore
            component: LinkBehavior,
          },
        },
        MuiButtonBase: {
          defaultProps: {
            LinkComponent: LinkBehavior,
          },
        },
      },
      palette: {
        mode: darkMode ? 'dark' : 'light',
      },
      typography: {
        allVariants: { fontFamily: RobotoFlex.style.fontFamily },
      },
    },
    {} satisfies ThemeOptions,
  )
}
