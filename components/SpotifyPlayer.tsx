import React, { useState, useEffect, useRef } from 'react';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string; height: number; width: number }>;
  };
  external_urls: {
    spotify: string;
  };
  preview_url?: string;
  duration_ms: number;
}

interface SpotifyPlayerProps {
  tracks: SpotifyTrack[];
  playlistId?: string;
  emotion?: string;
  onTrackChange?: (track: SpotifyTrack) => void;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
  tracks,
  playlistId,
  emotion,
  onTrackChange
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current && currentTrack?.preview_url) {
      audioRef.current.src = currentTrack.preview_url;
      audioRef.current.load();
      setDuration(currentTrack.duration_ms / 1000);
    }
  }, [currentTrack]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    onTrackChange?.(tracks[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    onTrackChange?.(tracks[prevIndex]);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const openInSpotify = (track: SpotifyTrack) => {
    window.open(track.external_urls.spotify, '_blank');
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-400">No tracks available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">
          🎵 {emotion ? `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Music` : 'Spotify Player'}
        </h3>
        {playlistId && (
          <p className="text-gray-400 text-sm">
            Playlist ID: {playlistId}
          </p>
        )}
      </div>

      {/* Current Track Info */}
      <div className="flex items-center mb-4">
        <img
          src={currentTrack?.album?.images?.[0]?.url || '/placeholder-album.png'}
          alt={currentTrack?.name}
          className="w-16 h-16 rounded-md mr-4"
        />
        <div className="flex-1">
          <h4 className="text-white font-semibold truncate">{currentTrack?.name}</h4>
          <p className="text-gray-400 text-sm truncate">
            {currentTrack?.artists?.map(artist => artist.name).join(', ')}
          </p>
        </div>
        <button
          onClick={() => openInSpotify(currentTrack)}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          Open in Spotify
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={handlePrevious}
          className="text-white hover:text-green-400 transition-colors"
          disabled={tracks.length <= 1}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 004.11 1.664L8 9.798v4.034z"/>
          </svg>
        </button>

        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
          disabled={!currentTrack?.preview_url}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 4a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H6zM12 4a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v6l7 5V2z" clipRule="evenodd"/>
            </svg>
          )}
        </button>

        <button
          onClick={handleNext}
          className="text-white hover:text-green-400 transition-colors"
          disabled={tracks.length <= 1}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
          </svg>
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.234 0zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-xs text-gray-400 w-8">{volume}%</span>
      </div>

      {/* Track List */}
      <div className="mt-4 max-h-40 overflow-y-auto">
        <h4 className="text-white font-semibold mb-2">Playlist ({tracks.length} tracks)</h4>
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                onTrackChange?.(track);
              }}
              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                index === currentTrackIndex
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <span className="text-sm mr-3 w-6">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
              {track.preview_url && (
                <svg className="w-4 h-4 ml-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v6l7 5V2z" clipRule="evenodd"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={() => setDuration(currentTrack?.duration_ms / 1000 || 0)}
      />
    </div>
  );
};

export default SpotifyPlayer;
