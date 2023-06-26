import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useState } from 'react'

export default function ChangePasswordForm({ loading, onSubmit }: { loading: boolean; onSubmit: (password: string) => {} }) {
  const [password, setPassword] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(password)
      }}
    >
      <Stack spacing={2}>
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></TextField>
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading' : 'Change Password'}
        </Button>
      </Stack>
    </form>
  )
}
