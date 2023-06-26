'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LoginForm from '@/components/auth/LoginForm'

export default function Login() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        throw error
      }
      router.push(searchParams.get('redirectedFrom') || '/')
    } catch (error: any) {
      enqueueSnackbar(error.error_description || error.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Login</h1>
      <LoginForm loading={loading} onSubmit={handleLogin} />
    </main>
  )
}
