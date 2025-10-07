'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Camera, AlertCircle, RefreshCw } from 'lucide-react'

interface WebcamFeedProps {
  onSnapshot: (imageData: string) => void
  isCapturing: boolean
  detectionSessionActive?: boolean
  nextDetectionTime?: number | null
}

export default function WebcamFeed({ onSnapshot, isCapturing, detectionSessionActive = false, nextDetectionTime }: WebcamFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  const startWebcam = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })
      
      setStream(mediaStream)
      
      if (videoRef.current && !isPlaying) {
        videoRef.current.srcObject = mediaStream
        
        // Handle play promise properly to avoid AbortError
        try {
          setIsPlaying(true)
          const playPromise = videoRef.current.play()
          
          if (playPromise !== undefined) {
            await playPromise
          }
        } catch (playError) {
          console.warn('Video play was interrupted:', playError)
          setIsPlaying(false)
        }
      }
      
      setIsLoading(false)
    } catch (err) {
      console.error('Error accessing webcam:', err)
      setError(getErrorMessage(err))
      setIsLoading(false)
    }
  }

  const getErrorMessage = (err: any): string => {
    if (err.name === 'NotAllowedError') {
      return 'Camera access denied. Please allow camera permissions and refresh the page.'
    } else if (err.name === 'NotFoundError') {
      return 'No camera found. Please connect a camera and try again.'
    } else if (err.name === 'NotReadableError') {
      return 'Camera is already in use by another application.'
    } else {
      return 'Failed to access camera. Please check your camera settings and try again.'
    }
  }

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    onSnapshot(imageData)
  }

  useEffect(() => {
    startWebcam()

    return () => {
      // Clean up video element
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.srcObject = null
      }
      
      // Clean up media stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      
      setIsPlaying(false)
    }
  }, [])

  // Add video event listeners to track play state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [stream])

  useEffect(() => {
    if (isCapturing && !error) {
      captureSnapshot()
    }
  }, [isCapturing, error])

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Error</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 space-y-2">
            <Button onClick={startWebcam} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <div className="text-sm text-slate-400 space-y-1">
              <p><strong>Troubleshooting tips:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Make sure your camera is connected and working</li>
                <li>Check if another app is using your camera</li>
                <li>Try refreshing the page</li>
                <li>Check your browser's camera permissions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-10">
              <div className="text-center space-y-2">
                <Camera className="h-8 w-8 text-purple-400 mx-auto animate-pulse" />
                <p className="text-slate-300">Starting camera...</p>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            className="w-full h-auto max-h-96 object-cover rounded-lg"
            autoPlay
            playsInline
            muted
          />
          
          {isCapturing && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Analyzing...
            </div>
          )}

          {detectionSessionActive && (
            <div className="absolute top-4 left-4 bg-cyan-500/90 text-white px-3 py-2 rounded-lg text-sm font-mono backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>SESSION ACTIVE</span>
              </div>
              {nextDetectionTime && (
                <div className="text-xs text-cyan-100 mt-1">
                  Next detection: {Math.ceil((nextDetectionTime - Date.now()) / 1000 / 60)}m
                </div>
              )}
            </div>
          )}

          {!detectionSessionActive && !isCapturing && (
            <div className="absolute top-4 left-4 bg-yellow-500/90 text-white px-3 py-2 rounded-lg text-sm font-mono backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span>WAITING</span>
              </div>
              <div className="text-xs text-yellow-100 mt-1">
                Ready for emotion detection
              </div>
            </div>
          )}
        </div>
        
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
