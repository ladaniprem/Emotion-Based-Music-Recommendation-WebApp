'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Clock, Target, Zap, Brain, Coffee } from 'lucide-react'

interface EmotionData {
  emotion: string
  confidence: number
  timestamp: number
}

interface UserSettings {
  defaultVolume: number
  autoPlayEnabled: boolean
  sessionDuration: number
  theme: 'dark' | 'light' | 'auto'
  showNotifications: boolean
  compactMode: boolean
  analyticsEnabled: boolean
  emotionLoggingEnabled: boolean
  dataRetentionDays: number
  displayName: string
  preferredGenres: string[]
  emotionSensitivity: 'low' | 'medium' | 'high'
}

interface SubjectSuggestionsProps {
  currentEmotion: EmotionData | null
}

interface SubjectRecommendation {
  primary: string
  secondary: string[]
  duration: string
  tips: string[]
  reasoning: string
}

const SUBJECT_RECOMMENDATIONS: Record<string, SubjectRecommendation> = {
  happy: {
    primary: "Advanced Programming Projects",
    secondary: ["Machine Learning Implementation", "Creative Problem Solving", "System Design"],
    duration: "60-90 minutes",
    tips: ["Take advantage of high energy", "Use active learning methods", "Try creative approaches"],
    reasoning: "High energy and positive mood - perfect for tackling challenging new concepts!"
  },
  sad: {
    primary: "Mathematics Review",
    secondary: ["Theory Revision", "Concept Clarification", "Previous Assignments"],
    duration: "30-45 minutes",
    tips: ["Be gentle with yourself", "Focus on review rather than new material", "Consider studying with a friend"],
    reasoning: "Low energy state - focus on review and consolidation rather than new learning."
  },
  stressed: {
    primary: "Basic Mathematics Practice",
    secondary: ["Simple Programming Exercises", "Familiar Topic Revision", "Easy Problem Sets"],
    duration: "20-30 minutes",
    tips: ["Start with easy topics to build confidence", "Use relaxation techniques before studying", "Avoid time pressure"],
    reasoning: "High stress - stick to familiar, low-pressure topics to build confidence."
  },
  neutral: {
    primary: "Regular Coursework",
    secondary: ["Assignment Completion", "Balanced Study Session", "Project Development"],
    duration: "45-60 minutes",
    tips: ["Maintain steady, consistent pace", "Use proven study techniques", "Balance different types of learning"],
    reasoning: "Balanced mood - ideal for regular study routine and steady progress."
  }
}

export default function SubjectSuggestions({ currentEmotion, userSettings }: { currentEmotion?: EmotionData | null, userSettings?: UserSettings }) {
  // Track recently suggested subjects to avoid repetition
  const [recentSubjects, setRecentSubjects] = useState<Set<string>>(new Set())

  // State for current recommendation to avoid re-renders - MOVED TO TOP
  const [currentRecommendation, setCurrentRecommendation] = useState<SubjectRecommendation | null>(null)
  const [currentEmotionKey, setCurrentEmotionKey] = useState<string>('')
  const [originalEmotionKey, setOriginalEmotionKey] = useState<string>('')

  // Emotion mapping - convert detected emotions to supported categories
  const mapEmotion = (emotion: string): string => {
    const emotionMap: Record<string, string> = {
      'excited': 'happy',
      'energetic': 'happy',
      'joyful': 'happy',
      'angry': 'stressed',
      'frustrated': 'stressed',
      'anxious': 'stressed',
      'fearful': 'stressed',
      'surprised': 'happy',
      'disgusted': 'stressed',
      'bored': 'neutral',
      'tired': 'sad',
      'sleepy': 'sad',
      'calm': 'neutral',
      'peaceful': 'neutral',
      'focused': 'neutral',
      'concentrated': 'neutral'
    }

    return emotionMap[emotion.toLowerCase()] || emotion.toLowerCase()
  }

  // Update recommendation when emotion changes - MOVED TO TOP
  useEffect(() => {
    if (!currentEmotion) {
      setCurrentRecommendation(null)
      setRecentSubjects(new Set())
      setCurrentEmotionKey('')
      setOriginalEmotionKey('')
      return
    }

    const originalEmotion = currentEmotion.emotion.toLowerCase()
    const emotion = mapEmotion(originalEmotion)

    // Get available subjects for this emotion, excluding recently suggested ones
    const getAvailableSubjects = (emotionKey: string, subjectType: 'primary' | 'secondary') => {
      const allSubjects = SUBJECT_RECOMMENDATIONS[emotionKey]
      if (!allSubjects) return []

      if (subjectType === 'primary') {
        return recentSubjects.has(allSubjects.primary) ? [] : [allSubjects.primary]
      } else {
        return allSubjects.secondary.filter(subject => !recentSubjects.has(subject))
      }
    }

    // Get a unique recommendation for this emotion
    const getUniqueRecommendation = (emotionKey: string) => {
      const baseRecommendation = SUBJECT_RECOMMENDATIONS[emotionKey]
      if (!baseRecommendation) return null

      // Get available primary subjects
      const availablePrimary = getAvailableSubjects(emotionKey, 'primary')
      const availableSecondary = getAvailableSubjects(emotionKey, 'secondary')

      // If no primary subjects available, reset and get all
      let finalPrimary = availablePrimary.length > 0 ? availablePrimary[0] : baseRecommendation.primary
      let finalSecondary = availableSecondary.length > 0 ? availableSecondary : baseRecommendation.secondary

      // If we had to reset primary, reset recent subjects for this emotion
      if (availablePrimary.length === 0) {
        console.log(`🔄 Resetting subject suggestions for ${emotionKey}`)
        setRecentSubjects(prev => {
          const newSet = new Set(prev)
          // Remove all subjects for this emotion
          baseRecommendation.secondary.forEach(subject => newSet.delete(subject))
          if (baseRecommendation.primary !== finalPrimary) {
            newSet.delete(baseRecommendation.primary)
          }
          return newSet
        })
      }

      // Select a subset of secondary subjects (max 3)
      if (finalSecondary.length > 3) {
        // Shuffle and take first 3
        const shuffled = [...finalSecondary].sort(() => Math.random() - 0.5)
        finalSecondary = shuffled.slice(0, 3)
      }

      // Add selected subjects to recent list
      setRecentSubjects(prev => new Set([...Array.from(prev), finalPrimary, ...finalSecondary]))

      return {
        ...baseRecommendation,
        primary: finalPrimary,
        secondary: finalSecondary
      }
    }

    const recommendation = getUniqueRecommendation(emotion)
    setCurrentRecommendation(recommendation)
    setCurrentEmotionKey(emotion)
    setOriginalEmotionKey(originalEmotion)
  }, [currentEmotion, recentSubjects])

  if (!currentEmotion) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <span>Study Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-slate-400">
            Waiting for emotion detection to suggest study topics...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!currentRecommendation) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <span>Study Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">🤔</div>
          <p className="text-slate-400">
            Analyzing your current state for personalized recommendations...
          </p>
        </CardContent>
      </Card>
    )
  }

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return <Zap className="h-5 w-5 text-yellow-400" />
      case 'sad':
        return <Coffee className="h-5 w-5 text-blue-400" />
      case 'stressed':
        return <Brain className="h-5 w-5 text-red-400" />
      case 'neutral':
        return <Target className="h-5 w-5 text-green-400" />
      default:
        return <BookOpen className="h-5 w-5 text-cyan-400" />
    }
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return 'from-yellow-500 to-orange-500'
      case 'sad':
        return 'from-blue-500 to-cyan-500'
      case 'stressed':
        return 'from-red-500 to-pink-500'
      case 'neutral':
        return 'from-green-500 to-emerald-500'
      default:
        return 'from-cyan-500 to-purple-500'
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getEmotionIcon(currentEmotionKey)}
            <span>Study Recommendations</span>
          </div>
          <span className="px-2 py-1 text-xs font-mono bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 rounded">
            {originalEmotionKey.toUpperCase()} → {currentEmotionKey.toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Recommendation */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 bg-gradient-to-r ${getEmotionColor(currentEmotionKey)} rounded-full`} />
            <h3 className="font-semibold text-white">Primary Focus</h3>
          </div>
          <div className={`p-4 bg-gradient-to-r ${getEmotionColor(currentEmotionKey)}/10 border border-current/20 rounded-lg`}>
            <h4 className="font-bold text-lg text-white mb-2">{currentRecommendation.primary}</h4>
            <p className="text-slate-300 text-sm">{currentRecommendation.reasoning}</p>
          </div>
        </div>

        {/* Secondary Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <h3 className="font-medium text-slate-300">Alternative Options</h3>
          </div>
          <div className="grid gap-2">
            {currentRecommendation.secondary.map((subject: string, index: number) => (
              <div key={index} className="p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                <p className="text-slate-200 text-sm">{subject}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Study Duration */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h3 className="font-medium text-slate-300">Recommended Duration</h3>
          </div>
          <div className="p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg">
            <p className="text-cyan-400 font-mono">{currentRecommendation.duration}</p>
          </div>
        </div>

        {/* Study Tips */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-slate-400" />
            <h3 className="font-medium text-slate-300">Study Tips</h3>
          </div>
          <div className="space-y-2">
            {currentRecommendation.tips.map((tip: string, index: number) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-slate-700/20 rounded">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-300 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <div className="pt-4 border-t border-slate-600/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Emotion Detection: {currentEmotion ? Math.round(currentEmotion.confidence * 100) : 0}% confidence</span>
            <span className="text-cyan-400">🔄 Fresh suggestions each session</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
