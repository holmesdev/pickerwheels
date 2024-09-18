import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useState } from 'react'

export default function ResetPasswordForm({ loading, onSubmit }: { loading: boolean; onSubmit: (email: string) => {} }) {
  const [email, setEmail] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(email)
      }}
    >
      <Stack spacing={2}>
        <TextField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required></TextField>
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading' : 'Reset Password'}
        </Button>
      </Stack>
    </form>
  )
}
