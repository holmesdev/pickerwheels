import './globals.css'
import { cookies } from 'next/headers'
import ThemeProvider from '@/components/theme/ThemeProvider'
import SnackbarProvider from '@/components/theme/SnackbarProvider'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import robotoFlex from '@/utils/fonts'

export const metadata = {
  title: 'Spinner Wheel',
  description: 'Spin that wheel!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const useDarkMode = cookies().get('dark-mode')?.value
  return (
    <html lang="en">
      <body className={robotoFlex.className}>
        <ThemeProvider darkModeCookie={useDarkMode}>
          <SnackbarProvider>
            <Header />
            {children}
            <Footer />
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
