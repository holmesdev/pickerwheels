import Header from '@/components/layout/Header'
import './globals.css'
import robotoFlex from '@/components/theme/fonts'
import ThemeProvider from '@/components/theme/ThemeProvider'
import { cookies } from 'next/headers'
import SnackbarProvider from '@/components/theme/SnackbarProvider'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'spinner-wheel-upgrade',
  description: 'spinner-wheel-upgrade app created by Pain Driven Dev',
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
