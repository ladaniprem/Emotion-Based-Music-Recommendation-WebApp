'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface EmotionResult {
  emotion: string
  confidence: number
  music: any
  subject: any
  timestamp: string
}

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  emotionResult: EmotionResult | null
  isAnalyzing: boolean
  startEmotionDetection: () => void
  stopEmotionDetection: () => void
  analyzeFrame: (imageData: string) => void
  getEmotionTimeline: () => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

interface SocketProviderProps {
  children: React.ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling']
    })

    // Connection events
    socketInstance.on('connect', () => {
      console.log('Connected to backend')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from backend')
      setIsConnected(false)
      setIsAnalyzing(false)
    })

    // Emotion detection events
    socketInstance.on('connected', (data) => {
      console.log('Socket connected:', data)
    })

    socketInstance.on('emotion_detection_started', (data) => {
      console.log('Emotion detection started:', data)
      setIsAnalyzing(true)
    })

    socketInstance.on('emotion_detection_stopped', (data) => {
      console.log('Emotion detection stopped:', data)
      setIsAnalyzing(false)
    })

    socketInstance.on('emotion_result', (result: EmotionResult) => {
      console.log('Emotion result:', result)
      setEmotionResult(result)
    })

    socketInstance.on('emotion_timeline', (timeline) => {
      console.log('Emotion timeline:', timeline)
      // Handle timeline data if needed
    })

    socketInstance.on('emotion_timeline_error', (error) => {
      console.error('Emotion timeline error:', error)
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const startEmotionDetection = () => {
    if (socket) {
      socket.emit('start_emotion_detection')
    }
  }

  const stopEmotionDetection = () => {
    if (socket) {
      socket.emit('stop_emotion_detection')
    }
  }

  const analyzeFrame = (imageData: string) => {
    if (socket && isAnalyzing) {
      socket.emit('analyze_frame', { image: imageData })
    }
  }

  const getEmotionTimeline = () => {
    if (socket) {
      socket.emit('get_emotion_timeline')
    }
  }

  const value: SocketContextType = {
    socket,
    isConnected,
    emotionResult,
    isAnalyzing,
    startEmotionDetection,
    stopEmotionDetection,
    analyzeFrame,
    getEmotionTimeline
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
