import { CopyAll, DeleteForever } from '@mui/icons-material'
import { Checkbox, IconButton, InputAdornment, TextField } from '@mui/material'
import { Option } from './option'

export default function OptionEditor({
  option,
  onLabelChange,
  onEnableChange,
  onCopy,
  onDelete,
}: {
  option: Option
  onLabelChange: (value: string) => void
  onEnableChange: (value: boolean) => void
  onCopy: () => void
  onDelete: () => void
}) {
  onLabelChange ||= () => {}
  onEnableChange ||= () => {}
  onCopy ||= () => {}
  onDelete ||= () => {}

  return (
    <TextField
      variant="outlined"
      value={option.label}
      hiddenLabel={true}
      aria-label={'Edit ' + option.label}
      onChange={(event) => onLabelChange(event.currentTarget.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {/* <DragIndicator /> */}
            <Checkbox checked={option.enabled} onChange={(e) => onEnableChange(e.currentTarget.checked)} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="copy" onClick={onCopy}>
              <CopyAll />
            </IconButton>
            <IconButton aria-label="delete" onClick={onDelete}>
              <DeleteForever />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
