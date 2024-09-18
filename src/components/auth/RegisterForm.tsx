import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useState } from 'react'

export default function RegisterForm({ loading, onSubmit }: { loading: boolean; onSubmit: (email: string, password: string) => {} }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(email, password)
      }}
    >
      <Stack spacing={2}>
        <TextField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading' : 'Sign Up'}
        </Button>
      </Stack>
    </form>
  )
}
