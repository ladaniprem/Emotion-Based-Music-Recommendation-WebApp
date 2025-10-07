import os
import requests
from typing import List, Dict, Optional, Tuple
import time

class SpotifyIntegration:
    """Spotify API integration for emotion-based music recommendations"""

    def __init__(self):
        """Initialize Spotify API client"""
        self.client_id = os.getenv('SPOTIPY_CLIENT_ID')
        self.client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')
        self.access_token = None
        self.token_expires_at = 0

        if not self.client_id or not self.client_secret:
            print("⚠️  Spotify credentials not found. Set SPOTIPY_CLIENT_ID and SPOTIPY_CLIENT_SECRET")
            return

        self._authenticate()

    def _authenticate(self) -> bool:
        """Authenticate with Spotify API"""
        try:
            auth_url = 'https://accounts.spotify.com/api/token'
            auth_data = {
                'grant_type': 'client_credentials'
            }
            auth_headers = {
                'Authorization': f'Basic {self._get_auth_header()}'
            }

            response = requests.post(auth_url, data=auth_data, headers=auth_headers)
            response.raise_for_status()

            token_data = response.json()
            self.access_token = token_data['access_token']
            self.token_expires_at = time.time() + token_data['expires_in']

            print("✅ Spotify authentication successful")
            return True

        except Exception as e:
            print(f"❌ Spotify authentication failed: {e}")
            return False

    def _get_auth_header(self) -> str:
        """Get base64 encoded authorization header"""
        import base64
        auth_string = f"{self.client_id}:{self.client_secret}"
        return base64.b64encode(auth_string.encode()).decode()

    def _ensure_valid_token(self):
        """Ensure access token is still valid, refresh if needed"""
        if time.time() >= self.token_expires_at:
            self._authenticate()

    def search_tracks(self, query: str, limit: int = 10) -> List[Dict]:
        """Search for tracks on Spotify"""
        if not self.access_token:
            return []

        self._ensure_valid_token()

        try:
            search_url = 'https://api.spotify.com/v1/search'
            headers = {
                'Authorization': f'Bearer {self.access_token}'
            }
            params = {
                'q': query,
                'type': 'track',
                'limit': limit
            }

            response = requests.get(search_url, headers=headers, params=params)
            response.raise_for_status()

            data = response.json()
            return data.get('tracks', {}).get('items', [])

        except Exception as e:
            print(f"❌ Spotify search failed: {e}")
            return []

    def get_playlist_tracks(self, playlist_id: str, limit: int = 20) -> List[Dict]:
        """Get tracks from a Spotify playlist"""
        if not self.access_token:
            return []

        self._ensure_valid_token()

        try:
            playlist_url = f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'
            headers = {
                'Authorization': f'Bearer {self.access_token}'
            }
            params = {
                'limit': limit
            }

            response = requests.get(playlist_url, headers=headers, params=params)
            response.raise_for_status()

            data = response.json()
            return data.get('items', [])

        except Exception as e:
            print(f"❌ Failed to get playlist tracks: {e}")
            return []

    def get_emotion_playlist(self, emotion: str) -> Dict:
        """Get a curated playlist for the given emotion"""
        emotion_playlists = {
            'happy': {
                'name': 'Happy Vibes',
                'description': 'Uplifting and energetic tracks to boost your mood',
                'spotify_id': '37i9dQZF1DXbpR3uCBnjpF',  # Happy Hits playlist
                'tracks': [
                    {'name': 'Happy', 'artist': 'Pharrell Williams'},
                    {'name': 'Can\'t Stop the Feeling!', 'artist': 'Justin Timberlake'},
                    {'name': 'Uptown Funk', 'artist': 'Mark Ronson ft. Bruno Mars'},
                    {'name': 'Walking on Sunshine', 'artist': 'Katrina & The Waves'},
                    {'name': 'Good as Hell', 'artist': 'Lizzo'}
                ]
            },
            'sad': {
                'name': 'Melancholy Moments',
                'description': 'Reflective and emotional songs for processing feelings',
                'spotify_id': '37i9dQZF1DWSqBruwoIXkA',  # Sad Songs playlist
                'tracks': [
                    {'name': 'Someone Like You', 'artist': 'Adele'},
                    {'name': 'Mad World', 'artist': 'Gary Jules'},
                    {'name': 'Hurt', 'artist': 'Johnny Cash'},
                    {'name': 'Tears in Heaven', 'artist': 'Eric Clapton'},
                    {'name': 'The Sound of Silence', 'artist': 'Simon & Garfunkel'}
                ]
            },
            'stressed': {
                'name': 'Calm & Relaxed',
                'description': 'Peaceful tracks to reduce stress and anxiety',
                'spotify_id': '37i9dQZF1DX4PP3DA4J0N8',  # Chill Hits playlist
                'tracks': [
                    {'name': 'Weightless', 'artist': 'Marconi Union'},
                    {'name': 'Clair de Lune', 'artist': 'Debussy'},
                    {'name': 'Porcelain', 'artist': 'Moby'},
                    {'name': 'River', 'artist': 'Joni Mitchell'},
                    {'name': 'Ambient 1', 'artist': 'Brian Eno'}
                ]
            },
            'neutral': {
                'name': 'Focus & Concentration',
                'description': 'Balanced instrumental music for work and study',
                'spotify_id': '37i9dQZF1DX4PP3DA4J0N8',  # Deep Focus playlist
                'tracks': [
                    {'name': 'Ludovico Einaudi - Nuvole Bianche', 'artist': 'Ludovico Einaudi'},
                    {'name': 'Max Richter - On The Nature of Daylight', 'artist': 'Max Richter'},
                    {'name': 'Ólafur Arnalds - Near Light', 'artist': 'Ólafur Arnalds'},
                    {'name': 'Nils Frahm - Says', 'artist': 'Nils Frahm'},
                    {'name': 'Bonobo - Kong', 'artist': 'Bonobo'}
                ]
            },
            'excited': {
                'name': 'High Energy',
                'description': 'Energetic and dynamic tracks for motivation',
                'spotify_id': '37i9dQZF1DXbpR3uCBnjpF',  # Dance Hits playlist
                'tracks': [
                    {'name': 'Levels', 'artist': 'Avicii'},
                    {'name': 'Animals', 'artist': 'Martin Garrix'},
                    {'name': 'Tsunami', 'artist': 'DVBBS & Borgeous'},
                    {'name': 'Wake Me Up', 'artist': 'Avicii'},
                    {'name': 'Boneless', 'artist': 'Steve Aoki'}
                ]
            },
            'calm': {
                'name': 'Deep Relaxation',
                'description': 'Peaceful music for meditation and rest',
                'spotify_id': '37i9dQZF1DX4PP3DA4J0N8',  # Peaceful Piano playlist
                'tracks': [
                    {'name': 'Weightless', 'artist': 'Marconi Union'},
                    {'name': 'River Flows in You', 'artist': 'Yiruma'},
                    {'name': 'Gabriel\'s Oboe', 'artist': 'Ennio Morricone'},
                    {'name': 'The Eternal Vow', 'artist': 'Yanni'},
                    {'name': 'Música Callada', 'artist': 'Federico Mompou'}
                ]
            },
            'focused': {
                'name': 'Concentration Boost',
                'description': 'Instrumental music to enhance focus and productivity',
                'spotify_id': '37i9dQZF1DX4PP3DA4J0N8',  # Classical Focus playlist
                'tracks': [
                    {'name': 'The Well-Tempered Clavier', 'artist': 'J.S. Bach'},
                    {'name': 'Piano Sonata No. 14 (Moonlight)', 'artist': 'Beethoven'},
                    {'name': 'Nocturnes', 'artist': 'Chopin'},
                    {'name': 'The Seasons', 'artist': 'Tchaikovsky'},
                    {'name': 'Brandenburg Concertos', 'artist': 'Bach'}
                ]
            },
            'tired': {
                'name': 'Gentle Sleep',
                'description': 'Soft, calming music for rest and recovery',
                'spotify_id': '37i9dQZF1DX4PP3DA4J0N8',  # Sleep playlist
                'tracks': [
                    {'name': 'Sleep', 'artist': 'Eric Whitacre'},
                    {'name': 'The Night', 'artist': 'Ludovico Einaudi'},
                    {'name': 'I Giorni', 'artist': 'Ludovico Einaudi'},
                    {'name': 'Divenire', 'artist': 'Ludovico Einaudi'},
                    {'name': 'Elegy for the Arctic', 'artist': 'Ludovico Einaudi'}
                ]
            }
        }

        return emotion_playlists.get(emotion.lower(), emotion_playlists['neutral'])

    def get_recommendations(self, emotion: str, limit: int = 5) -> Dict:
        """Get Spotify recommendations for emotion-based music"""
        emotion_playlist = self.get_emotion_playlist(emotion)

        # Try to get actual tracks from Spotify playlist
        tracks = []
        if self.access_token:
            playlist_tracks = self.get_playlist_tracks(emotion_playlist['spotify_id'], limit)
            tracks = [{
                'name': item['track']['name'],
                'artist': ', '.join([artist['name'] for artist in item['track']['artists']]),
                'spotify_id': item['track']['id'],
                'spotify_url': item['track']['external_urls']['spotify'],
                'album_art': item['track']['album']['images'][0]['url'] if item['track']['album']['images'] else None,
                'duration_ms': item['track']['duration_ms'],
                'preview_url': item['track']['preview_url']
            } for item in playlist_tracks if item.get('track')]
        else:
            # Fallback to curated tracks
            tracks = [{
                'name': track['name'],
                'artist': track['artist'],
                'spotify_id': None,
                'spotify_url': None,
                'album_art': None,
                'duration_ms': 240000,  # 4 minutes default
                'preview_url': None
            } for track in emotion_playlist['tracks'][:limit]]

        return {
            'emotion': emotion,
            'playlist_name': emotion_playlist['name'],
            'description': emotion_playlist['description'],
            'spotify_playlist_id': emotion_playlist['spotify_id'],
            'tracks': tracks,
            'source': 'spotify',
            'total_tracks': len(tracks)
        }

    def get_track_details(self, track_id: str) -> Optional[Dict]:
        """Get detailed information about a specific track"""
        if not self.access_token:
            return None

        self._ensure_valid_token()

        try:
            track_url = f'https://api.spotify.com/v1/tracks/{track_id}'
            headers = {
                'Authorization': f'Bearer {self.access_token}'
            }

            response = requests.get(track_url, headers=headers)
            response.raise_for_status()

            return response.json()

        except Exception as e:
            print(f"❌ Failed to get track details: {e}")
            return None

# Global Spotify instance
spotify_client = SpotifyIntegration()
