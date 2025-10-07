'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useCamera } from '@/hooks/useCamera'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Square, Camera } from 'lucide-react'

interface EmotionResult {
  emotion: string
  confidence: number
  music: any
  subject: any
  timestamp: string
}

export const RealTimeEmotionDetector: React.FC = () => {
  const {
    isConnected,
    emotionResult,
    isAnalyzing,
    startEmotionDetection,
    stopEmotionDetection,
    analyzeFrame
  } = useSocket()

  const { videoRef, canvasRef, isStreaming, startCamera, stopCamera, captureFrame } = useCamera({
    width: 640,
    height: 480
  })

  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update current emotion when result changes
  useEffect(() => {
    if (emotionResult) {
      setCurrentEmotion(emotionResult)
    }
  }, [emotionResult])

  // Start/stop frame analysis based on analyzing state
  useEffect(() => {
    if (isAnalyzing && isStreaming) {
      intervalRef.current = setInterval(() => {
        const frameData = captureFrame()
        if (frameData) {
          analyzeFrame(frameData)
        }
      }, 1000) // Analyze every second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAnalyzing, isStreaming, analyzeFrame, captureFrame])

  const handleStartDetection = async () => {
    try {
      await startCamera()
      startEmotionDetection()
    } catch (error) {
      console.error('Failed to start detection:', error)
    }
  }

  const handleStopDetection = () => {
    stopEmotionDetection()
    stopCamera()
    setCurrentEmotion(null)
  }

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happy: 'bg-yellow-500',
      sad: 'bg-blue-500',
      angry: 'bg-red-500',
      fear: 'bg-purple-500',
      surprise: 'bg-orange-500',
      neutral: 'bg-gray-500',
      calm: 'bg-green-500',
      excited: 'bg-pink-500',
      stressed: 'bg-red-600',
      focused: 'bg-indigo-500',
      tired: 'bg-slate-500'
    }
    return colors[emotion.toLowerCase()] || 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            Backend Connection: {isConnected ? 'Connected' : 'Disconnected'}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Camera and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Real-Time Emotion Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Display */}
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full max-w-md mx-auto border border-gray-600 rounded-lg"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-lg">
                <p className="text-gray-400">Camera not active</p>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 justify-center">
            {!isAnalyzing ? (
              <Button
                onClick={handleStartDetection}
                disabled={!isConnected}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Detection
              </Button>
            ) : (
              <Button
                onClick={handleStopDetection}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop Detection
              </Button>
            )}
          </div>

          {/* Status */}
          {isAnalyzing && (
            <div className="text-center">
              <Badge variant="secondary" className="animate-pulse">
                Analyzing emotions...
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Emotion Result */}
      {currentEmotion && (
        <Card>
          <CardHeader>
            <CardTitle>Current Emotion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge className={`${getEmotionColor(currentEmotion.emotion)} text-white`}>
                {currentEmotion.emotion.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-400">
                Confidence: {(currentEmotion.confidence * 100).toFixed(1)}%
              </span>
            </div>

            {currentEmotion.music && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Recommended Music:</h4>
                <p className="text-sm text-gray-400">
                  {currentEmotion.music.playlist_name}
                </p>
                {currentEmotion.music.tracks && currentEmotion.music.tracks.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm">
                      🎵 {currentEmotion.music.tracks[0].name}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {currentEmotion.music.tracks[0].artist}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
