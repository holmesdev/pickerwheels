import { Add } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { FormEvent, useState } from 'react'

export default function OptionCreator({ onAdd }: { onAdd: (value: string) => void }) {
  onAdd ||= () => {}

  const [label, setLabel] = useState('')

  return (
    <form
      className="flex"
      onSubmit={(e: FormEvent) => {
        e.preventDefault()
        onAdd(label)
        setLabel('')
      }}
    >
      <TextField
        label=""
        variant="outlined"
        className="flex-1"
        value={label}
        placeholder="Type new item here"
        onChange={(event) => setLabel(event.currentTarget.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="add" type="submit">
                <Add />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  )
}
