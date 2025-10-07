'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmotionData } from '@/hooks/useEmotionDetection'

interface EmotionGraphProps {
  emotionHistory: EmotionData[]
}

export default function EmotionGraph({ emotionHistory }: EmotionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const emotionColors: Record<string, string> = {
    happy: '#facc15',
    sad: '#60a5fa',
    excited: '#fb923c',
    calm: '#4ade80',
    focused: '#a855f7',
    energetic: '#ef4444',
    relaxed: '#2dd4bf',
    angry: '#dc2626',
    surprised: '#ec4899',
    neutral: '#9ca3af'
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || emotionHistory.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height
    const padding = 40

    // Clear canvas
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    if (emotionHistory.length < 2) return

    // Calculate dimensions
    const graphWidth = width - padding * 2
    const graphHeight = height - padding * 2

    // Draw grid lines
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 1

    // Horizontal grid lines (confidence levels)
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * graphHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Y-axis labels
      ctx.fillStyle = '#64748b'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${100 - i * 20}%`, padding - 10, y + 4)
    }

    // Vertical grid lines (time)
    const timePoints = Math.min(emotionHistory.length, 10)
    for (let i = 0; i <= timePoints; i++) {
      const x = padding + (i / timePoints) * graphWidth
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
    }

    // Draw emotion confidence line
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const recentHistory = emotionHistory.slice(-20) // Show last 20 points

    for (let i = 0; i < recentHistory.length - 1; i++) {
      const current = recentHistory[i]
      const next = recentHistory[i + 1]

      const x1 = padding + (i / (recentHistory.length - 1)) * graphWidth
      const y1 = padding + (1 - current.confidence) * graphHeight
      const x2 = padding + ((i + 1) / (recentHistory.length - 1)) * graphWidth
      const y2 = padding + (1 - next.confidence) * graphHeight

      // Use emotion color
      ctx.strokeStyle = emotionColors[current.emotion] || '#9ca3af'
      
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Draw emotion points
    recentHistory.forEach((emotion, index) => {
      const x = padding + (index / (recentHistory.length - 1)) * graphWidth
      const y = padding + (1 - emotion.confidence) * graphHeight

      // Outer circle
      ctx.fillStyle = emotionColors[emotion.emotion] || '#9ca3af'
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()

      // Inner circle
      ctx.fillStyle = '#1e293b'
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw axes labels
    ctx.fillStyle = '#e2e8f0'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    
    // X-axis label
    ctx.fillText('Time', width / 2, height - 10)
    
    // Y-axis label
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Confidence', 0, 0)
    ctx.restore()

  }, [emotionHistory])

  if (emotionHistory.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Emotion Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="text-4xl mb-2">📊</div>
            <p>Start detecting emotions to see your mood trends</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Emotion Trends
          <div className="flex items-center space-x-4 text-sm">
            {/* Legend */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-slate-400">Happy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-slate-400">Sad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-slate-400">Calm</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg"
            style={{ width: '100%', height: '256px' }}
          />
        </div>
        
        {emotionHistory.length > 0 && (
          <div className="mt-4 text-sm text-slate-400 text-center">
            Showing {emotionHistory.length} emotion detection{emotionHistory.length !== 1 ? 's' : ''} over time
          </div>
        )}
      </CardContent>
    </Card>
  )
}
