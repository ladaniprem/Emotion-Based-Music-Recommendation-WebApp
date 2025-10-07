'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LandingPage from '@/components/LandingPage'
import MainApp from '@/components/MainApp'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [hasStarted, setHasStarted] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/signin')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* AI Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-black to-purple-900/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Matrix-like grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-40 grid-rows-40 h-full w-full">
            {Array.from({ length: 1600 }).map((_, i) => (
              <div key={i} className="border border-cyan-500/10"></div>
            ))}
          </div>
        </div>

        {/* AI Header */}
        <header className="relative z-10 bg-black/40 backdrop-blur-xl border-b border-cyan-500/20 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono">
                  NEURAL MUSIC SYSTEM
                </h1>
                <p className="text-sm text-cyan-300/80 font-mono">
                  {'>'} Connected: {user?.name} | Status: ACTIVE
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-mono">AI_ONLINE</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-mono text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:scale-105"
              >
                {'>> DISCONNECT'}
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="relative z-10 min-h-[calc(100vh-80px)]">
          {!hasStarted ? (
            <LandingPage onStart={() => setHasStarted(true)} />
          ) : (
            <MainApp />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
