'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Navbar from './Navbar'

export default function Header() {
  const supabase = createClientComponentClient()
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const onLogOut = async () => {
    await supabase.auth.signOut()
  }

  return <Navbar loggedIn={loggedIn} onLogOut={onLogOut} />
}
