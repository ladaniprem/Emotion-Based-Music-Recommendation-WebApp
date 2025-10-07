'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call - replace with actual authentication
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user exists in localStorage (mock database)
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const existingUser = users.find((u: any) => u.email === email && u.password === password)
    
    if (existingUser) {
      const userData = { id: existingUser.id, email: existingUser.email, name: existingUser.name }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const existingUser = users.find((u: any) => u.email === email)
    
    if (existingUser) {
      setIsLoading(false)
      return false // User already exists
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password // In real app, this should be hashed
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    // Auto login after signup
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
