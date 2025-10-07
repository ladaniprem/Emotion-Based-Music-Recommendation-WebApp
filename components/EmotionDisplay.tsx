'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmotionData } from '@/hooks/useEmotionDetection'

interface EmotionDisplayProps {
  emotion: EmotionData | null
  isAnalyzing: boolean
}

const emotionEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  excited: '🤩',
  calm: '😌',
  focused: '🧐',
  energetic: '⚡',
  relaxed: '😴',
  angry: '😠',
  surprised: '😲',
  neutral: '😐',
  stressed: '😰',
  tired: '🥱',
  confused: '😕',
  bored: '😑'
}

const emotionColors: Record<string, string> = {
  happy: 'text-yellow-400',
  sad: 'text-blue-400',
  excited: 'text-orange-400',
  calm: 'text-green-400',
  focused: 'text-purple-400',
  energetic: 'text-red-400',
  relaxed: 'text-teal-400',
  angry: 'text-red-500',
  surprised: 'text-pink-400',
  neutral: 'text-gray-400',
  stressed: 'text-red-600',
  tired: 'text-indigo-400',
  confused: 'text-amber-400',
  bored: 'text-slate-400'
}

const emotionDescriptions: Record<string, string> = {
  happy: 'Joyful and positive mood',
  sad: 'Feeling down or melancholic',
  excited: 'High energy and enthusiastic',
  calm: 'Peaceful and relaxed state',
  focused: 'Concentrated and attentive',
  energetic: 'Full of vitality and vigor',
  relaxed: 'At ease and stress-free',
  angry: 'Frustrated or irritated',
  surprised: 'Shocked or amazed',
  neutral: 'Balanced emotional state',
  stressed: 'Under pressure or anxious',
  tired: 'Fatigued and sleepy',
  confused: 'Uncertain or puzzled',
  bored: 'Uninterested or disengaged'
}

export default function EmotionDisplay({ emotion, isAnalyzing }: EmotionDisplayProps) {
  if (isAnalyzing) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-center">Analyzing Emotion...</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Avatar className="h-20 w-20 mx-auto">
            <AvatarFallback className="text-2xl bg-slate-700 animate-pulse">
              🤔
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="h-2 bg-slate-700 rounded animate-pulse" />
            <div className="h-2 bg-slate-700 rounded animate-pulse w-3/4 mx-auto" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!emotion) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-center">Ready to Detect</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Avatar className="h-20 w-20 mx-auto">
            <AvatarFallback className="text-2xl bg-slate-700">
              😊
            </AvatarFallback>
          </Avatar>
          <p className="text-slate-400">
            Position yourself in front of the camera to start emotion detection
          </p>
        </CardContent>
      </Card>
    )
  }

  const emoji = emotionEmojis[emotion.emotion] || '😐'
  const colorClass = emotionColors[emotion.emotion] || 'text-gray-400'
  const description = emotionDescriptions[emotion.emotion] || 'Emotional state detected'
  const confidencePercentage = Math.round(emotion.confidence * 100)

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center space-x-2">
          <span>Current Emotion</span>
          <div className={`w-2 h-2 rounded-full bg-green-400 animate-pulse`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <Avatar className="h-28 w-28 mx-auto ring-4 ring-slate-600/50">
          <AvatarFallback className={`text-5xl bg-gradient-to-br from-slate-700 to-slate-800 ${colorClass} shadow-lg`}>
            {emoji}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-4">
          <div>
            <h3 className={`text-3xl font-bold capitalize ${colorClass} mb-2`}>
              {emotion.emotion}
            </h3>
            <p className="text-slate-300 text-sm font-medium">
              {description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Detection Confidence</span>
              <span className={`font-mono ${colorClass}`}>{confidencePercentage}%</span>
            </div>
            <Progress
              value={confidencePercentage}
              className="h-3 bg-slate-700"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-slate-400 mb-1">Timestamp</div>
              <div className="text-slate-200 font-mono">
                {new Date(emotion.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-slate-400 mb-1">Processing</div>
              <div className="text-green-400 font-mono">
                Real-time
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
