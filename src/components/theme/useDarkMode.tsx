import { useMediaQuery } from '@mui/material'
import { useEffect } from 'react'

export function useDarkMode(darkModeCookie: string | undefined) {
  const browserPreference = useMediaQuery('(prefers-color-scheme: dark)')
  useEffect(() => {
    if (darkModeCookie === undefined) {
      document.cookie = `dark-mode=${browserPreference ? 'true' : 'false'};expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure`
    }
  }, [browserPreference, darkModeCookie])
  return darkModeCookie !== undefined ? darkModeCookie === 'true' : browserPreference
}
