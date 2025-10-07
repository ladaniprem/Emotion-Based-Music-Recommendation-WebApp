'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react'
import { MusicRecommendation } from '@/hooks/useEmotionDetection'

// YouTube API TypeScript declarations
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
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

interface MusicPlayerProps {
  music: MusicRecommendation | null
  isLoading?: boolean
  currentEmotion?: EmotionData | null
  userSettings?: UserSettings
}

interface EmotionData {
  emotion: string
  confidence: number
}

interface SongData {
  title: string
  artist: string
  album?: string
  duration: number
  url?: string
  albumArt?: string
  youtubeId?: string
  emotion?: string
  music_profile?: {
    tempo_range: string
    energy_level: string
    primary_genres: string[]
    secondary_genres: string[]
    mood_characteristics: string[]
    instruments: string[]
    recommended_for: string[]
  }
  genres?: string[]
  characteristics?: string
  recommendation_reason?: string
}

// Music database with YouTube video IDs
const MUSIC_DATABASE = {
  happy: [
    { title: "Happy - Pharrell Williams", artist: "Pharrell Williams", youtubeId: "ZbZSe6N_BXs", duration: 600, albumArt: "🎵" },
    { title: "Can't Stop the Feeling! - Justin Timberlake", artist: "Justin Timberlake", youtubeId: "ru0K8uYEZWw", duration: 600, albumArt: "🎵" },
    { title: "Uptown Funk - Mark Ronson ft. Bruno Mars", artist: "Mark Ronson", youtubeId: "OPf0YbXqDm0", duration: 600, albumArt: "🎵" },
    { title: "Good as Hell - Lizzo", artist: "Lizzo", youtubeId: "SmbmeSqp1hA", duration: 600, albumArt: "🎵" },
    { title: "Walking on Sunshine - Katrina & The Waves", artist: "Katrina & The Waves", youtubeId: "iPUmE-tne5U", duration: 600, albumArt: "🎵" },
    { title: "I Wanna Dance with Somebody - Whitney Houston", artist: "Whitney Houston", youtubeId: "eH3giaIzONA", duration: 600, albumArt: "🎵" },
    { title: "Dancing Queen - ABBA", artist: "ABBA", youtubeId: "xFrGuyw1V8s", duration: 600, albumArt: "🎵" },
    { title: "Mr. Blue Sky - Electric Light Orchestra", artist: "ELO", youtubeId: "m1h1gRqa9Q", duration: 600, albumArt: "🎵" }
  ],
  sad: [
    { title: "Someone Like You - Adele", artist: "Adele", youtubeId: "hLQl3WQQoQ0", duration: 600, albumArt: "🎵" },
    { title: "Hurt - Johnny Cash", artist: "Johnny Cash", youtubeId: "8AHCfZTRGiI", duration: 600, albumArt: "🎵" },
    { title: "Everybody Hurts - R.E.M.", artist: "R.E.M.", youtubeId: "5rOiW_xY-kc", duration: 600, albumArt: "🎵" },
    { title: "Mad World - Gary Jules", artist: "Gary Jules", youtubeId: "4N3N1MlvVc4", duration: 600, albumArt: "🎵" },
    { title: "The Sound of Silence - Simon & Garfunkel", artist: "Simon & Garfunkel", youtubeId: "4zLfCnGVeL4", duration: 600, albumArt: "🎵" },
    { title: "Yesterday - The Beatles", artist: "The Beatles", youtubeId: "NrgmdOz227I", duration: 600, albumArt: "🎵" },
    { title: "Nothing Compares 2 U - Sinead O'Connor", artist: "Sinéad O'Connor", youtubeId: "0-EF60neguk", duration: 600, albumArt: "🎵" },
    { title: "Blackbird - The Beatles", artist: "The Beatles", youtubeId: "Man4Xw8Xypo", duration: 600, albumArt: "🎵" }
  ],
  stressed: [
    { title: "Weightless - Marconi Union", artist: "Marconi Union", youtubeId: "UfcAVejs1Ac", duration: 600, albumArt: "🎵" },
    { title: "Porcelain - Moby", artist: "Moby", youtubeId: "XgFJUv9Hbm", duration: 600, albumArt: "🎵" },
    { title: "Teardrop - Massive Attack", artist: "Massive Attack", youtubeId: "u7K72X4eo_s", duration: 600, albumArt: "🎵" },
    { title: "Ambient 1 - Brian Eno", artist: "Brian Eno", youtubeId: "YjtFXPSzJ4c", duration: 600, albumArt: "🎵" },
    { title: "Clair de Lune - Claude Debussy", artist: "Claude Debussy", youtubeId: "WNcsUNKlAKw", duration: 600, albumArt: "🎵" },
    { title: "Music for Airports - Brian Eno", artist: "Brian Eno", youtubeId: "tYkkFuKg5yk", duration: 600, albumArt: "🎵" },
    { title: "The Köln Concert - Keith Jarrett", artist: "Keith Jarrett", youtubeId: "6v0az2KDgiw", duration: 600, albumArt: "🎵" },
    { title: "Moon Safari - Air", artist: "Air", youtubeId: "nFJ0FgKf8OE", duration: 600, albumArt: "🎵" }
  ],
  neutral: [
    { title: "Ludovico Einaudi - Nuvole Bianche", artist: "Ludovico Einaudi", youtubeId: "yH1pLt2H-4U", duration: 600, albumArt: "🎵" },
    { title: "Ólafur Arnalds - Near Light", artist: "Ólafur Arnalds", youtubeId: "jdtJf3qKXno", duration: 600, albumArt: "🎵" },
    { title: "Nils Frahm - Says", artist: "Nils Frahm", youtubeId: "u-iU7uB3mLc", duration: 600, albumArt: "🎵" },
    { title: "Max Richter - On The Nature of Daylight", artist: "Max Richter", youtubeId: "rAg9HnXNfok", duration: 600, albumArt: "🎵" },
    { title: "Bonobo - Kong", artist: "Bonobo", youtubeId: "DwRyB0z0E9I", duration: 600, albumArt: "🎵" },
    { title: "Ryuichi Sakamoto - Merry Christmas Mr. Lawrence", artist: "Ryuichi Sakamoto", youtubeId: "9NJXfS2z3L4", duration: 600, albumArt: "🎵" },
    { title: "Philip Glass - Metamorphosis", artist: "Philip Glass", youtubeId: "o7iL2K9PNeR8", duration: 600, albumArt: "🎵" },
    { title: "Arvo Pärt - Spiegel im Spiegel", artist: "Arvo Pärt", youtubeId: "pF2rT9PNeR8", duration: 600, albumArt: "🎵" }
  ]
}

export default function MusicPlayer({ music, isLoading, currentEmotion, userSettings }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(userSettings?.defaultVolume || 70)
  const [isMuted, setIsMuted] = useState(false)
  const [currentSong, setCurrentSong] = useState<SongData | null>(null)
  const [songStartTime, setSongStartTime] = useState<number | null>(null)
  const [emotionStartTime, setEmotionStartTime] = useState<number | null>(null)
  const [currentEmotionState, setCurrentEmotionState] = useState<string | null>(null)
  const [recentSongs, setRecentSongs] = useState<Set<string>>(new Set()) // Track recently played songs

  // 10-minute emotion session timer (600 seconds)
  const EMOTION_SESSION_DURATION = 600 // 10 minutes in seconds
  const SONG_DURATION = 600 // 10 minutes per song

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

  // Get song for current emotion - ensure different songs each time
  const getSongForEmotion = (emotion: string): SongData | null => {
    // Map emotion to supported categories
    const mappedEmotion = mapEmotion(emotion)
    const emotionSongs = MUSIC_DATABASE[mappedEmotion as keyof typeof MUSIC_DATABASE]
    if (!emotionSongs) return null

    // Filter out recently played songs
    const availableSongs = emotionSongs.filter(song => !recentSongs.has(song.youtubeId))

    // If all songs have been played recently, reset the recent songs list
    let finalSongList = availableSongs
    if (availableSongs.length === 0) {
      console.log('All songs played recently, resetting playlist')
      setRecentSongs(new Set())
      finalSongList = emotionSongs
    }

    // Use timestamp and random elements for truly unique selection each time
    const now = Date.now()
    const timestampSeed = now % 1000000
    const randomSeed = Math.random() * 1000000
    const combinedSeed = (timestampSeed + randomSeed) % 1000000

    const songIndex = Math.floor(combinedSeed / (1000000 / finalSongList.length))
    const selectedSong = finalSongList[songIndex % finalSongList.length]

    // Add to recent songs
    setRecentSongs(prev => new Set([...Array.from(prev), selectedSong.youtubeId]))

    return selectedSong
  }

  // Handle emotion changes - DON'T reset timer, just change song
  useEffect(() => {
    const emotionString = currentEmotion?.emotion
    if (emotionString && emotionString !== currentEmotionState) {
      console.log(`🎵 Emotion changed from ${currentEmotionState} to ${emotionString}`)

      // Don't reset emotionStartTime - keep the 10-minute session running
      // Only reset it when the session naturally ends
      if (!emotionStartTime) {
        // First emotion detection - start the session
        setEmotionStartTime(Date.now())
      }

      setCurrentEmotionState(emotionString)

      const newSong = getSongForEmotion(emotionString)
      if (newSong) {
        setCurrentSong(newSong)
        setSongStartTime(Date.now())
        setCurrentTime(0)

        setTimeout(() => {
          setIsPlaying(true)
        }, 500)
      }
    }
  }, [currentEmotion?.emotion, currentEmotionState, emotionStartTime])

  // 10-minute timer for emotion sessions
  useEffect(() => {
    if (emotionStartTime && currentEmotionState) {
      console.log(`🎯 Starting 10-minute session for emotion: ${currentEmotionState}`)
      console.log(`⏰ Session will run for exactly ${EMOTION_SESSION_DURATION} seconds (${EMOTION_SESSION_DURATION/60} minutes)`)
      console.log(`📅 Session started at: ${new Date(emotionStartTime).toLocaleTimeString()}`)
      const interval = setInterval(() => {
        const elapsed = (Date.now() - emotionStartTime) / 1000
        const remaining = EMOTION_SESSION_DURATION - elapsed

        if (remaining <= 0) {
          console.log(`⏰ 10-minute ${currentEmotionState} session COMPLETED after ${Math.floor(elapsed)} seconds`)
          setIsPlaying(false)
          setEmotionStartTime(null)
          setCurrentEmotionState(null)
          setCurrentSong(null)
        } else if (Math.floor(remaining) % 60 === 0 && remaining > 0) { // Log every minute
          console.log(`⏰ Session: ${Math.floor(remaining/60)} minutes remaining`)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [emotionStartTime, currentEmotionState])

  // Progress tracking for current song
  useEffect(() => {
    if (songStartTime && isPlaying) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - songStartTime) / 1000
        setCurrentTime(Math.min(elapsed, SONG_DURATION))

        if (elapsed >= SONG_DURATION) {
          console.log(`⏹️ Song completed: ${currentSong?.title}`)
          setIsPlaying(false)

          if (emotionStartTime && currentEmotionState) {
            const elapsedSession = (Date.now() - emotionStartTime) / 1000
            if (elapsedSession < EMOTION_SESSION_DURATION) {
              const nextSong = getSongForEmotion(currentEmotionState)
              if (nextSong && nextSong.youtubeId !== currentSong?.youtubeId) {
                setCurrentSong(nextSong)
                setSongStartTime(Date.now())
                setCurrentTime(0)

                setTimeout(() => {
                  setIsPlaying(true)
                }, 500)
              }
            }
          }
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [songStartTime, isPlaying, currentSong, emotionStartTime, currentEmotion])

  // YouTube player control - Simplified iframe approach
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null)
  const [playerReady, setPlayerReady] = useState(false)

  const togglePlay = () => {
    if (!currentSong) return

    setIsPlaying(!isPlaying)

    if (!isPlaying) {
      console.log('🎵 Session active - click YouTube player to start audio')
    } else {
      console.log('⏸️ Session paused - music will resume when you click play again')
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getRemainingSessionTime = () => {
    if (!emotionStartTime) return EMOTION_SESSION_DURATION
    const elapsed = (Date.now() - emotionStartTime) / 1000
    const remaining = Math.max(0, EMOTION_SESSION_DURATION - elapsed)
    // Only log every 30 seconds to reduce console spam
    if (Math.floor(elapsed) % 30 === 0 && elapsed > 0) {
      console.log(`⏰ Session: ${Math.floor(remaining/60)} minutes remaining`)
    }
    return remaining
  }

  const skipToNextSong = () => {
    if (!currentEmotionState) return

    const nextSong = getSongForEmotion(currentEmotionState)
    if (nextSong) {
      setCurrentSong(nextSong)
      setSongStartTime(Date.now())
      setCurrentTime(0)
      setIsPlaying(true)
      setPlayerReady(false) // Reset for new song
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Finding Perfect Music...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-700 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded animate-pulse" />
              <div className="h-3 bg-slate-700 rounded w-2/3 animate-pulse" />
            </div>
          </div>
          <div className="h-2 bg-slate-700 rounded animate-pulse" />
          <div className="flex justify-center space-x-2">
            <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
            <div className="w-12 h-12 bg-slate-700 rounded-full animate-pulse" />
            <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentSong) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Emotion-Based Music Player</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-slate-400 mb-4">
            Waiting for emotion detection to start your 10-minute music session...
          </p>
          {currentEmotion && (
            <div className="text-sm text-cyan-400 font-mono">
              Detected: {currentEmotion.emotion.toUpperCase()}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Now Playing - {Math.floor((userSettings?.sessionDuration || 600) / 60)} Minute Session</span>
          {currentSong && (
            <div className="text-right">
              <div className="text-xs text-cyan-400 font-mono">
                {currentSong.emotion?.toUpperCase()} Music
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {currentSong.music_profile?.energy_level?.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Song Info */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl">
            {currentSong.albumArt || '🎵'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{currentSong.title}</h3>
            <p className="text-slate-400 truncate">{currentSong.artist}</p>
            {currentSong.music_profile && (
              <div className="text-xs text-cyan-400 font-mono space-y-1 mt-1">
                <div>🎵 {currentSong.music_profile.primary_genres.join(', ')}</div>
                <div>⚡ {currentSong.music_profile.energy_level.replace('_', ' ').toUpperCase()} | {currentSong.music_profile.tempo_range}</div>
              </div>
            )}
          </div>
        </div>

        {/* Music Profile Details */}
        {currentSong.music_profile && (
          <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-cyan-400 text-sm">Music Analysis</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Tempo:</span>
                <span className="text-white ml-1">{currentSong.music_profile.tempo_range}</span>
              </div>
              <div>
                <span className="text-slate-400">Energy:</span>
                <span className="text-white ml-1">{currentSong.music_profile.energy_level.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400">Genres:</span>
                <span className="text-white ml-1">{currentSong.music_profile.primary_genres.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-400">For:</span>
                <span className="text-white ml-1">{currentSong.music_profile.recommended_for.slice(0, 2).join(', ')}</span>
              </div>
            </div>
            {currentSong.recommendation_reason && (
              <div className="text-xs text-slate-300 border-t border-slate-600/50 pt-2 mt-2">
                💡 {currentSong.recommendation_reason}
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={SONG_DURATION}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(SONG_DURATION)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white opacity-50 cursor-not-allowed"
            disabled
            title="Previous song not available"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            onClick={togglePlay}
            size="icon"
            className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            title={isPlaying ? "Pause session" : "Start session"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          <Button
            onClick={skipToNextSong}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
            title="Skip to next song"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Control Instructions */}
        <div className="text-center text-xs text-slate-400 font-mono">
          <p>🎵 Use play/pause for session control • Click YouTube player for audio</p>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-slate-400 hover:text-white"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />

          <span className="text-xs text-slate-400 w-8 text-right">
            {isMuted ? 0 : volume}%
          </span>
        </div>

        {/* YouTube Embed - Enhanced with better UX */}
        {currentSong && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {isPlaying ? '▶️ Player Ready' : '⏸️ Paused'} | Use YouTube controls for audio
              </span>
              <span className="text-xs text-cyan-400 font-mono">
                YouTube Player
              </span>
            </div>
            <div className="relative">
              <iframe
                key={currentSong.youtubeId} // Force re-render when song changes
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0`}
                title={currentSong.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">▶️</div>
                    <p className="text-white text-sm font-mono">Click play to start music</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2 text-center">
              <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/50 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-mono">
                  Click the YouTube play button above to start your music session
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Session Status */}
        <div className="text-center text-xs text-slate-500 font-mono space-y-1">
          <p>🎯 {Math.floor((userSettings?.sessionDuration || 600) / 60)}-minute emotion-based music session active</p>
          <p>💫 Songs change with your emotions • Session ends automatically</p>
        </div>
      </CardContent>
    </Card>
  )
}
