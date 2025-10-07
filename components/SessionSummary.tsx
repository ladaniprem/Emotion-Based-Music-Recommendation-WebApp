'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Download, BarChart3, Clock, Smile } from 'lucide-react'
import { EmotionData } from '@/hooks/useEmotionDetection'

interface SessionSummaryProps {
  emotionHistory: EmotionData[]
  sessionStartTime: number
}

export default function SessionSummary({ emotionHistory, sessionStartTime }: SessionSummaryProps) {
  const [isSharing, setIsSharing] = useState(false)

  if (emotionHistory.length === 0) {
    return null
  }

  // Calculate session statistics
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000 / 60) // minutes
  const emotionCounts = emotionHistory.reduce((acc, emotion) => {
    acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostFrequentEmotion = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)[0]

  const averageConfidence = emotionHistory.reduce((sum, emotion) => sum + emotion.confidence, 0) / emotionHistory.length

  const handleShare = async () => {
    setIsSharing(true)
    
    try {
      const shareData = {
        title: 'My Emotion Music Session',
        text: `I just completed a ${sessionDuration} minute emotion-based music session! My most frequent emotion was ${mostFrequentEmotion[0]} 🎵`,
        url: window.location.href
      }

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text}\n\nTry it yourself: ${shareData.url}`
        )
        alert('Session summary copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleDownload = () => {
    const summaryData = {
      sessionDate: new Date().toISOString(),
      duration: sessionDuration,
      totalDetections: emotionHistory.length,
      emotions: emotionCounts,
      mostFrequentEmotion: mostFrequentEmotion[0],
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      emotionHistory: emotionHistory
    }

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emotion-session-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Session Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-400" />
            <div className="text-lg font-semibold">{sessionDuration}m</div>
            <div className="text-xs text-slate-400">Duration</div>
          </div>
          
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-400" />
            <div className="text-lg font-semibold">{emotionHistory.length}</div>
            <div className="text-xs text-slate-400">Detections</div>
          </div>
          
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <Smile className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-lg font-semibold capitalize">{mostFrequentEmotion[0]}</div>
            <div className="text-xs text-slate-400">Top Emotion</div>
          </div>
          
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-lg font-semibold">{Math.round(averageConfidence * 100)}%</div>
            <div className="text-xs text-slate-400">Avg Confidence</div>
          </div>
        </div>

        {/* Emotion Breakdown */}
        <div>
          <h4 className="font-semibold mb-3">Emotion Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(emotionCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([emotion, count]) => {
                const percentage = Math.round((count / emotionHistory.length) * 100)
                return (
                  <div key={emotion} className="flex items-center justify-between">
                    <span className="capitalize text-slate-300">{emotion}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-400 w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {isSharing ? 'Sharing...' : 'Share Session'}
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Data
          </Button>
        </div>

        <p className="text-xs text-slate-500 text-center">
          Share your emotional music journey with friends or download your session data for personal insights.
        </p>
      </CardContent>
    </Card>
  )
}
