import { useEffect, useState } from 'react'

export default function useCurrentUrl() {
  const [currentUrl, setCurrentUrl] = useState('')
  useEffect(() => {
    function handlePopState() {
      setCurrentUrl(window.location.href)
    }
    handlePopState() // Update current URL on client side.
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return currentUrl
}
