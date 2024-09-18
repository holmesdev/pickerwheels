'use client'

import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack'

export default function SnackbarProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotistackSnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      {children}
    </NotistackSnackbarProvider>
  )
}
