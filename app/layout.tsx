import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { SocketProvider } from '@/contexts/SocketContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Emotion Music - AI-Powered Music Recommendations',
  description: 'Get personalized music recommendations based on your emotions detected through webcam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              {children}
            </div>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
