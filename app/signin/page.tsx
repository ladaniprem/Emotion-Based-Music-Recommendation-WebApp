'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function SigninPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const success = await login(email, password)
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* AI Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-bounce"></div>
      </div>
      
      {/* Matrix-like grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-cyan-500/20"></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 bg-black/40 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        {/* AI Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            AI AUTHENTICATION
          </h1>
          <p className="text-cyan-300/80 font-mono text-sm">
            {'>'} Accessing Neural Music Network...
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-mono text-cyan-300 mb-2">
              {'>'} USER_ID
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/60 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono transition-all duration-300"
              placeholder="neural.user@ai.system"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-mono text-cyan-300 mb-2">
              {'>'} ACCESS_KEY
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/60 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono transition-all duration-300"
              placeholder="••••••••••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 animate-pulse">
              <p className="text-red-300 text-sm font-mono">{'>'} ERROR: {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-mono font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                AUTHENTICATING...
              </span>
            ) : (
              '>> INITIALIZE CONNECTION'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-cyan-300/60 font-mono text-sm">
            {'>'} New to the neural network?{' '}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold underline decoration-cyan-400/50 hover:decoration-cyan-300">
              REGISTER_AI_PROFILE
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center border-t border-cyan-500/20 pt-4">
          <p className="text-xs text-cyan-400/40 font-mono">
            {'>'} DEMO_MODE: Any credentials will create neural profile
          </p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-mono">AI_SYSTEM_ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  )
}
