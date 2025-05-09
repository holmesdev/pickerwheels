'use client'

import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import RegisterForm from '@/components/auth/RegisterForm'

export default function Register() {
  const supabase = createClient()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const register = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/callback` } })
    setLoading(false)
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    } else {
      router.push('/')
    }
  }

  return (
    <main>
      <h1>Sign up so you can save and edit your lists</h1>
      <RegisterForm loading={loading} onSubmit={register} />
    </main>
  )
}
