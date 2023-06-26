'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm'

export default function ChangePassword() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const changePassword = async (password: string) => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        throw error
      }
      enqueueSnackbar('Password updated successfully!', { variant: 'success' })
      router.push(searchParams.get('redirectedFrom') || '/')
    } catch (error: any) {
      enqueueSnackbar(error.error_description || error.message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Change Password</h1>
      <ChangePasswordForm loading={loading} onSubmit={changePassword} />
    </main>
  )
}
