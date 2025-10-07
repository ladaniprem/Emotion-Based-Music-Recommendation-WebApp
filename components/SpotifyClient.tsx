import { useState, useEffect } from 'react';

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

interface SpotifyPlaylist {
  name: string;
  description: string;
  spotify_playlist_id: string;
  tracks: SpotifyTrack[];
  source: string;
  total_tracks: number;
}

interface SpotifyIntegration {
  isAuthenticated: boolean;
  accessToken: string | null;
  authenticate: () => Promise<boolean>;
  getRecommendations: (emotion: string, limit?: number) => Promise<SpotifyPlaylist | null>;
  searchTracks: (query: string, limit?: number) => Promise<SpotifyTrack[]>;
  playTrack: (trackId: string) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
}

class SpotifyClient implements SpotifyIntegration {
  private clientId: string;
  private clientSecret: string;
  public accessToken: string | null = null;
  public isAuthenticated: boolean = false;
  private tokenExpiresAt: number = 0;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async authenticate(): Promise<boolean> {
    try {
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials',
        method: 'POST'
      };

      const response = await fetch(authOptions.url, {
        method: authOptions.method,
        headers: authOptions.headers,
        body: authOptions.body
      });

      if (response.ok) {
        const body = await response.json();
        this.accessToken = body.access_token;
        this.tokenExpiresAt = Date.now() + (body.expires_in * 1000);
        this.isAuthenticated = true;
        console.log('✅ Spotify authentication successful');
        return true;
      } else {
        console.error('❌ Spotify authentication failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Spotify authentication error:', error);
      return false;
    }
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || Date.now() >= this.tokenExpiresAt) {
      await this.authenticate();
    }
  }

  async getRecommendations(emotion: string, limit: number = 10): Promise<SpotifyPlaylist | null> {
    await this.ensureValidToken();

    if (!this.accessToken) {
      console.error('❌ No valid access token');
      return null;
    }

    try {
      // Get emotion-specific playlist data from backend
      const backendResponse = await fetch(`/spotify/recommendations/${emotion}`);
      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return data as SpotifyPlaylist;
      } else {
        console.error('❌ Backend Spotify request failed:', backendResponse.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Spotify recommendations error:', error);
      return null;
    }
  }

  async searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
    await this.ensureValidToken();

    if (!this.accessToken) {
      console.error('❌ No valid access token');
      return [];
    }

    try {
      const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`;
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.tracks?.items || [];
      } else {
        console.error('❌ Spotify search failed:', response.status);
        return [];
      }
    } catch (error) {
      console.error('❌ Spotify search error:', error);
      return [];
    }
  }

  playTrack(trackId: string): void {
    // This would integrate with Spotify Web Playback SDK
    console.log('🎵 Playing track:', trackId);
    // Implementation would use Spotify Web Playback SDK
  }

  pauseTrack(): void {
    console.log('⏸️ Pausing track');
  }

  resumeTrack(): void {
    console.log('▶️ Resuming track');
  }
}

// Create Spotify client instance
const spotifyClient = new SpotifyClient(
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'CLIENT_ID',
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || 'CLIENT_SECRET'
);

// React Hook for Spotify integration
export const useSpotify = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initSpotify = async () => {
      setIsLoading(true);
      const success = await spotifyClient.authenticate();
      setIsAuthenticated(success);
      setIsLoading(false);
    };

    initSpotify();
  }, []);

  const getRecommendations = async (emotion: string, limit?: number) => {
    return await spotifyClient.getRecommendations(emotion, limit);
  };

  const searchTracks = async (query: string, limit?: number) => {
    return await spotifyClient.searchTracks(query, limit);
  };

  const playTrack = (trackId: string) => {
    spotifyClient.playTrack(trackId);
  };

  const pauseTrack = () => {
    spotifyClient.pauseTrack();
  };

  const resumeTrack = () => {
    spotifyClient.resumeTrack();
  };

  return {
    isAuthenticated,
    isLoading,
    getRecommendations,
    searchTracks,
    playTrack,
    pauseTrack,
    resumeTrack
  };
};

export default spotifyClient;
