'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export default function ResetPassword() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/changePassword` })
      if (error) {
        throw error
      }
      enqueueSnackbar('Password reset email sent', { variant: 'success' })
      router.push('/')
    } catch (error: any) {
      enqueueSnackbar(error.error_description || error.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Reset Password</h1>
      <ResetPasswordForm loading={loading} onSubmit={resetPassword} />
    </main>
  )
}
