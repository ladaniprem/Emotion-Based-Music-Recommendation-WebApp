'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/signin')
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* AI Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400/30 border-t-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300 font-mono text-lg">{'>'} Initializing Neural Network...</p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>
    )
  }

  return null // Will redirect based on auth state
}
