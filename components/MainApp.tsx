'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Settings, Info } from 'lucide-react'
import WebcamFeed from './WebcamFeed'
import EmotionDisplay from './EmotionDisplay'
import MusicPlayer from './MusicPlayer'
import EmotionGraph from './EmotionGraph'
import SessionSummary from './SessionSummary'
import SubjectSuggestions from './SubjectSuggestions'
import SettingsDialog from './SettingsDialog'
import { RealTimeEmotionDetector } from './RealTimeEmotionDetector'
import { useEmotionDetection } from '@/hooks/useEmotionDetection'

interface UserSettings {
  // Audio Settings
  defaultVolume: number
  autoPlayEnabled: boolean
  sessionDuration: number

  // UI Settings
  theme: 'dark' | 'light' | 'auto'
  showNotifications: boolean
  compactMode: boolean

  // Privacy Settings
  analyticsEnabled: boolean
  emotionLoggingEnabled: boolean
  dataRetentionDays: number

  // Profile Settings
  displayName: string
  preferredGenres: string[]
  emotionSensitivity: 'low' | 'medium' | 'high'
}

export default function MainApp() {
  const [appSessionStartTime] = useState(Date.now())
  const [showSummary, setShowSummary] = useState(false)
  const [useRealTimeDetection, setUseRealTimeDetection] = useState(false)

  // User Settings State
  const [userSettings, setUserSettings] = useState<UserSettings>({
    defaultVolume: 70,
    autoPlayEnabled: false,
    sessionDuration: 600, // 10 minutes

    theme: 'dark',
    showNotifications: true,
    compactMode: false,

    analyticsEnabled: true,
    emotionLoggingEnabled: true,
    dataRetentionDays: 30,

    displayName: 'Music User',
    preferredGenres: ['pop', 'electronic', 'ambient'],
    emotionSensitivity: 'medium'
  })
  
  const {
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
  } = useEmotionDetection()

  // Auto-show summary after 5 minutes or 10 detections
  useEffect(() => {
    const sessionDuration = (Date.now() - appSessionStartTime) / 1000 / 60 // minutes
    if (sessionDuration > 5 || emotionHistory.length >= 10) {
      setShowSummary(true)
    }
  }, [emotionHistory.length, appSessionStartTime])

  // Handle settings changes
  const handleSettingsChange = (newSettings: UserSettings) => {
    setUserSettings(newSettings)
    console.log('🎛️ Settings updated:', newSettings)

    // Apply theme changes
    if (newSettings.theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else if (newSettings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
    // 'auto' theme would require more complex logic with system preference detection
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono">
                    NEURAL MUSIC SYSTEM
                  </h1>
                  <div className="text-xs text-cyan-300/80 font-mono">
                    Welcome back, {userSettings.displayName}
                  </div>
                </div>
                
                {currentEmotion && (
                  <div className="hidden sm:flex items-center space-x-2 text-sm">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      detectionSessionActive ? 'bg-green-400' : 'bg-yellow-400'
                    }`} />
                    <span className="text-cyan-300 font-mono">
                      {detectionSessionActive ? 'SESSION_ACTIVE' : 'FACE_DETECTED'}
                    </span>
                    {detectionSessionActive && nextDetectionTime && (
                      <span className="text-cyan-400 text-xs">
                        ({Math.ceil((nextDetectionTime - Date.now()) / 1000 / 60)}m left)
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <SettingsDialog settings={userSettings} onSettingsChange={handleSettingsChange} />
                <Button variant="ghost" size="icon" className="text-cyan-400 hover:text-cyan-300">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Webcam and Emotion */}
          <div className="space-y-6">
            <WebcamFeed 
              onSnapshot={processSnapshot}
              isCapturing={shouldCapture}
              detectionSessionActive={detectionSessionActive}
              nextDetectionTime={nextDetectionTime}
            />
            
            <EmotionDisplay 
              emotion={currentEmotion}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Middle Column - Music Player */}
          <div className="space-y-6">
            <MusicPlayer 
              music={currentMusic}
              isLoading={isAnalyzing}
              currentEmotion={currentEmotion}
              userSettings={userSettings}
            />
            
            {emotionHistory.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-400">
                        {currentEmotion ? Math.round(currentEmotion.confidence * 100) : 0}%
                      </div>
                      <div className="text-xs text-slate-400">Confidence</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-400">
                        {currentEmotion ? 'Active' : 'Waiting'}
                      </div>
                      <div className="text-xs text-slate-400">Music Session</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-pink-400">
                        {sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000 / 60) : 0}m
                      </div>
                      <div className="text-xs text-slate-400">Detection Session</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-purple-400">
                        {nextDetectionTime ? Math.floor((nextDetectionTime - Date.now()) / 1000 / 60) : 0}m
                      </div>
                      <div className="text-xs text-slate-400">Next Detection</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Graph and Summary */}
          <div className="space-y-6">
            <SubjectSuggestions currentEmotion={currentEmotion} userSettings={userSettings} />
            
            <EmotionGraph emotionHistory={emotionHistory} />
            
            {showSummary && (
              <SessionSummary 
                emotionHistory={emotionHistory}
                sessionStartTime={sessionStartTime || Date.now()}
              />
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/20">
          <CardContent className="p-4">
            <div className="text-center text-sm text-cyan-300/80 space-y-2 font-mono">
              <p>
                {'>'} NEURAL_PROCESSING: All emotion detection happens locally in your neural network.
                No video data is stored or transmitted.
              </p>
              <div className="flex justify-center items-center space-x-4 text-xs">
                <span>Built with Next.js & AI Algorithms</span>
                <span>•</span>
                <span>Powered by Real-time Emotion Detection</span>
                <span>•</span>
                <span>© 2024 Neural Music System</span>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">SYSTEM_ONLINE</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
