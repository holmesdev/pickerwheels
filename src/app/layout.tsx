import './globals.css'
import { cookies } from 'next/headers'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import ThemeProvider from '@/components/theme/ThemeProvider'
import SnackbarProvider from '@/components/theme/SnackbarProvider'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import robotoFlex from '@/utils/fonts'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Roboto } from 'next/font/google'

export const metadata = {
  title: 'Picker Wheels',
  description: 'Spin that wheel!',
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const useDarkMode = cookieStore.get('dark-mode')?.value

  return (
    <html lang="en" className={roboto.variable}>
      <body className={robotoFlex.className}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider darkModeCookie={useDarkMode}>
            <SnackbarProvider>
              <Header />
              {children}
              <Footer />
              <Analytics />
              <SpeedInsights />
            </SnackbarProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
