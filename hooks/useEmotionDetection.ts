'use client'

import { useState, useEffect, useCallback } from 'react'

export interface EmotionData {
  emotion: string
  confidence: number
  timestamp: number
}

export interface MusicRecommendation {
  title: string
  artist: string
  album?: string
  duration: number
  url?: string
  albumArt?: string
}

interface EmotionResponse {
  emotion: string
  confidence: number
  music: MusicRecommendation
  subject?: any
  timestamp?: string
}

export function useEmotionDetection() {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null)
  const [currentMusic, setCurrentMusic] = useState<MusicRecommendation | null>(null)
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Detection session management - NEW
  const [detectionSessionActive, setDetectionSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [nextDetectionTime, setNextDetectionTime] = useState<number | null>(null)
  const DETECTION_SESSION_DURATION = 600000 // 10 minutes in milliseconds

  // Backend API configuration
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

  // Real emotion detection API call with fallback
  const analyzeEmotion = useCallback(async (imageData: string): Promise<EmotionResponse> => {
    try {
      console.log('📡 Connecting to backend:', BACKEND_URL)

      const response = await fetch(`${BACKEND_URL}/detect-emotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData
        })
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      console.log('✅ Backend response:', data)
      return {
        emotion: data.emotion,
        confidence: data.confidence,
        music: data.music,
        subject: data.subject,
        timestamp: data.timestamp
      }
    } catch (error) {
      console.error('❌ Backend API error:', error)

      // Fallback to mock data if backend is not available
      console.log('🔄 Falling back to mock data')

      const emotions = [
        { emotion: 'happy', confidence: 0.85, music: { title: 'Happy - Pharrell Williams', artist: 'Pharrell Williams', duration: 285, albumArt: '🎵' } },
        { emotion: 'sad', confidence: 0.78, music: { title: 'Someone Like You', artist: 'Adele', duration: 285, albumArt: '🎵' } },
        { emotion: 'excited', confidence: 0.92, music: { title: 'Uptown Funk', artist: 'Bruno Mars', duration: 270, albumArt: '🎵' } },
        { emotion: 'calm', confidence: 0.88, music: { title: 'Weightless', artist: 'Marconi Union', duration: 480, albumArt: '🎵' } },
        { emotion: 'focused', confidence: 0.81, music: { title: 'Ludovico Einaudi - Nuvole Bianche', artist: 'Ludovico Einaudi', duration: 342, albumArt: '🎵' } },
        { emotion: 'energetic', confidence: 0.89, music: { title: 'Thunderstruck', artist: 'AC/DC', duration: 292, albumArt: '🎵' } },
        { emotion: 'relaxed', confidence: 0.76, music: { title: 'Claire de Lune', artist: 'Claude Debussy', duration: 300, albumArt: '🎵' } },
      ]

      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      const confidence = Math.max(0.6, Math.min(0.95, randomEmotion.confidence + (Math.random() - 0.5) * 0.2))

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

      return {
        emotion: randomEmotion.emotion,
        confidence: Math.round(confidence * 100) / 100,
        music: randomEmotion.music
      }
    }
  }, [BACKEND_URL])

  const processSnapshot = useCallback(async (imageData: string) => {
    // Check if we're in an active detection session
    if (detectionSessionActive) {
      console.log('⏳ Detection session active - waiting for 10 minutes to complete')
      return
    }

    if (isAnalyzing) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeEmotion(imageData)

      const emotionData: EmotionData = {
        emotion: result.emotion,
        confidence: result.confidence,
        timestamp: Date.now()
      }

      // Start new detection session
      setDetectionSessionActive(true)
      setSessionStartTime(Date.now())
      setNextDetectionTime(Date.now() + DETECTION_SESSION_DURATION)

      setCurrentEmotion(emotionData)
      setCurrentMusic(result.music)

      // Add to history (keep last 20 entries)
      setEmotionHistory(prev => {
        const newHistory = [...prev, emotionData]
        return newHistory.slice(-20)
      })

      console.log(`🎯 Emotion detected: ${result.emotion} | Session started for 10 minutes`)

    } catch (err) {
      console.error('Error analyzing emotion:', err)
      setError('Failed to analyze emotion. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [analyzeEmotion, isAnalyzing, detectionSessionActive, DETECTION_SESSION_DURATION])

  // Monitor detection session and allow next detection after 10 minutes
  useEffect(() => {
    if (detectionSessionActive && nextDetectionTime) {
      const interval = setInterval(() => {
        const now = Date.now()
        if (now >= nextDetectionTime) {
          // 10 minutes passed, end session
          console.log('✅ 10-minute session completed - ready for next detection')
          setDetectionSessionActive(false)
          setSessionStartTime(null)
          setNextDetectionTime(null)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [detectionSessionActive, nextDetectionTime])

  // Manual trigger for next detection (for testing)
  const allowNextDetection = () => {
    setDetectionSessionActive(false)
    setSessionStartTime(null)
    setNextDetectionTime(null)
  }

  // Auto-capture every 4 seconds (only when session is NOT active)
  const [shouldCapture, setShouldCapture] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnalyzing && !detectionSessionActive) {
        setShouldCapture(true)
        setTimeout(() => setShouldCapture(false), 100)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isAnalyzing, detectionSessionActive])

  return {
    currentEmotion,
    currentMusic,
    emotionHistory,
    isAnalyzing,
    error,
    processSnapshot,
    shouldCapture,
    detectionSessionActive,
    sessionStartTime,
    nextDetectionTime,
    allowNextDetection
  }
}
