import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import { Dispatch, memo } from 'react'
import { WheelActions } from './wheelReducer'

function WinnerDialog({ open, label, dispatch }: { open: boolean; label: string; dispatch: Dispatch<WheelActions> }) {
  const onClose = (hideOption: boolean) => dispatch({ type: 'CloseWinnerDialog', hideOption })

  return (
    <Dialog open={open} onClose={() => onClose(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <DialogTitle id="alert-dialog-title" className="text-center">
        Winner!
      </DialogTitle>
      <DialogContent id="alert-dialog-description">
        <DialogContentText>
          <Typography component="span" variant="h1">
            {label}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <Button onClick={() => onClose(false)} autoFocus>
        Done
      </Button>
      <Button onClick={() => onClose(true)}>Hide Option</Button>
    </Dialog>
  )
}

export default memo(WinnerDialog)
