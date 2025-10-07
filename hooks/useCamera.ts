'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface UseCameraOptions {
  width?: number
  height?: number
  facingMode?: 'user' | 'environment'
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  isStreaming: boolean
  error: string | null
  startCamera: () => Promise<void>
  stopCamera: () => void
  captureFrame: () => string | null
}

export const useCamera = (options: UseCameraOptions = {}): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    width = 640,
    height = 480,
    facingMode = 'user'
  } = options

  const startCamera = useCallback(async () => {
    try {
      setError(null)

      const constraints = {
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: facingMode
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera'
      setError(errorMessage)
      console.error('Camera error:', err)
    }
  }, [width, height, facingMode])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsStreaming(false)
    setError(null)
  }, [])

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) {
      return null
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return null

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8)
  }, [isStreaming])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return {
    videoRef,
    canvasRef,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    captureFrame
  }
}
