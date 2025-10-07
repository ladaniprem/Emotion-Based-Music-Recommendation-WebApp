import os
import requests
from typing import List, Dict, Optional, Tuple
import time

class YouTubeIntegration:
    """YouTube API integration for emotion-based music recommendations"""

    def __init__(self):
        """Initialize YouTube API client"""
        self.api_key = os.getenv('YOUTUBE_API_KEY')
        self.base_url = 'https://www.googleapis.com/youtube/v3'

        if not self.api_key:
            print("⚠️  YouTube API key not found. Set YOUTUBE_API_KEY")
            return

        print("✅ YouTube API initialized successfully")

    def search_playlists(self, query: str, max_results: int = 10) -> List[Dict]:
        """Search for YouTube playlists by query"""
        if not self.api_key:
            return []

        try:
            search_url = f'{self.base_url}/search'
            params = {
                'part': 'snippet',
                'q': query,
                'type': 'playlist',
                'maxResults': max_results,
                'key': self.api_key
            }

            response = requests.get(search_url, params=params)
            response.raise_for_status()

            data = response.json()
            playlists = []

            for item in data.get('items', []):
                playlist = {
                    'id': item['id']['playlistId'],
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'channel_title': item['snippet']['channelTitle'],
                    'thumbnail': item['snippet']['thumbnails'].get('medium', {}).get('url', ''),
                    'url': f"https://www.youtube.com/playlist?list={item['id']['playlistId']}"
                }
                playlists.append(playlist)

            return playlists

        except Exception as e:
            print(f"❌ YouTube playlist search failed: {e}")
            return []

    def get_playlist_videos(self, playlist_id: str, max_results: int = 20) -> List[Dict]:
        """Get videos from a YouTube playlist"""
        if not self.api_key:
            return []

        try:
            playlist_url = f'{self.base_url}/playlistItems'
            params = {
                'part': 'snippet,contentDetails',
                'playlistId': playlist_id,
                'maxResults': max_results,
                'key': self.api_key
            }

            response = requests.get(playlist_url, params=params)
            response.raise_for_status()

            data = response.json()
            videos = []

            for item in data.get('items', []):
                video = {
                    'id': item['contentDetails']['videoId'],
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'channel_title': item['snippet']['channelTitle'],
                    'thumbnail': item['snippet']['thumbnails'].get('medium', {}).get('url', ''),
                    'url': f"https://www.youtube.com/watch?v={item['contentDetails']['videoId']}",
                    'duration': '0:00'  # YouTube API doesn't provide duration in playlistItems
                }
                videos.append(video)

            return videos

        except Exception as e:
            print(f"❌ Failed to get playlist videos: {e}")
            return []

    def get_emotion_playlist(self, emotion: str) -> Dict:
        """Get a curated playlist for the given emotion using YouTube"""
        emotion_playlists = {
            'happy': {
                'name': 'Happy & Uplifting Music',
                'description': 'Energetic and joyful tracks to boost your mood',
                'search_query': 'happy uplifting music playlist',
                'fallback_tracks': [
                    {'title': 'Happy - Pharrell Williams', 'url': 'https://www.youtube.com/watch?v=ZbZSe6N_BXs'},
                    {'title': 'Can\'t Stop the Feeling! - Justin Timberlake', 'url': 'https://www.youtube.com/watch?v=ru0K8uYEZWw'},
                    {'title': 'Uptown Funk - Mark Ronson ft. Bruno Mars', 'url': 'https://www.youtube.com/watch?v=OPf0YbXqDm0'},
                    {'title': 'Walking on Sunshine - Katrina and the Waves', 'url': 'https://www.youtube.com/watch?v=iPUmE-tne5U'},
                    {'title': 'Don\'t Worry, Be Happy - Bobby McFerrin', 'url': 'https://www.youtube.com/watch?v=d-diB65scQU'}
                ]
            },
            'sad': {
                'name': 'Emotional & Reflective Music',
                'description': 'Melancholic and introspective songs for processing emotions',
                'search_query': 'sad emotional music playlist',
                'fallback_tracks': [
                    {'title': 'Someone Like You - Adele', 'url': 'https://www.youtube.com/watch?v=hLQl3WQQoQ0'},
                    {'title': 'Mad World - Gary Jules', 'url': 'https://www.youtube.com/watch?v=4N3N1MlvVc4'},
                    {'title': 'Hurt - Johnny Cash', 'url': 'https://www.youtube.com/watch?v=vt1Pwfnh5pc'},
                    {'title': 'The Sound of Silence - Simon & Garfunkel', 'url': 'https://www.youtube.com/watch?v=4zLfCnGVeL4'},
                    {'title': 'Yesterday - The Beatles', 'url': 'https://www.youtube.com/watch?v=NrgmdOz227I'}
                ]
            },
            'stressed': {
                'name': 'Calming & Stress Relief Music',
                'description': 'Relaxing music to reduce stress and anxiety',
                'search_query': 'stress relief calming music playlist',
                'fallback_tracks': [
                    {'title': 'Weightless - Marconi Union', 'url': 'https://www.youtube.com/watch?v=UfcAVejs1Ac'},
                    {'title': 'River Flows in You - Yiruma', 'url': 'https://www.youtube.com/watch?v=7maJOI3QMu0'},
                    {'title': 'Comptine d\'un autre été - Yann Tiersen', 'url': 'https://www.youtube.com/watch?v=2TE2Lx9XIKU'},
                    {'title': 'The Night - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=8L63lTOLKJA'},
                    {'title': 'Experience - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=5jzgTFw2T6w'}
                ]
            },
            'excited': {
                'name': 'Energetic & Motivational Music',
                'description': 'High-energy tracks to keep you motivated and pumped up',
                'search_query': 'energetic motivational music playlist',
                'fallback_tracks': [
                    {'title': 'Eye of the Tiger - Survivor', 'url': 'https://www.youtube.com/watch?v=btPJPFnesV4'},
                    {'title': 'We Will Rock You - Queen', 'url': 'https://www.youtube.com/watch?v=-tJYN-eG1zk'},
                    {'title': 'Thunderstruck - AC/DC', 'url': 'https://www.youtube.com/watch?v=v2AC41dglnM'},
                    {'title': 'Livin\' on a Prayer - Bon Jovi', 'url': 'https://www.youtube.com/watch?v=lDK9QqIzhwk'},
                    {'title': 'Don\'t Stop Believin\' - Journey', 'url': 'https://www.youtube.com/watch?v=1k8craCGpgs'}
                ]
            },
            'calm': {
                'name': 'Peaceful & Ambient Music',
                'description': 'Soft and tranquil music for relaxation and peace',
                'search_query': 'peaceful ambient music playlist',
                'fallback_tracks': [
                    {'title': 'The Journey - 911 Band', 'url': 'https://www.youtube.com/watch?v=8N_ZjC9Q9Z8'},
                    {'title': 'I Giorni - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=4TR1y5Q0JJ4'},
                    {'title': 'Divenire - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=lWh4Ll1ogK4'},
                    {'title': 'Nuvole Bianche - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=0pVx8zM7zRY'},
                    {'title': 'Elegy for the Arctic - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=7MAVkJ9WJws'}
                ]
            },
            'tired': {
                'name': 'Sleep & Relaxation Music',
                'description': 'Gentle music for rest and peaceful sleep',
                'search_query': 'sleep relaxation music playlist',
                'fallback_tracks': [
                    {'title': 'Sleep - Eric Whitacre', 'url': 'https://www.youtube.com/watch?v=7EYAUazLI9k'},
                    {'title': 'The Night - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=8L63lTOLKJA'},
                    {'title': 'I Giorni - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=4TR1y5Q0JJ4'},
                    {'title': 'Divenire - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=lWh4Ll1ogK4'},
                    {'title': 'Nuvole Bianche - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=0pVx8zM7zRY'}
                ]
            },
            'focused': {
                'name': 'Concentration & Study Music',
                'description': 'Instrumental music to help you focus and concentrate',
                'search_query': 'concentration study music playlist',
                'fallback_tracks': [
                    {'title': 'River Flows in You - Yiruma', 'url': 'https://www.youtube.com/watch?v=7maJOI3QMu0'},
                    {'title': 'Comptine d\'un autre été - Yann Tiersen', 'url': 'https://www.youtube.com/watch?v=2TE2Lx9XIKU'},
                    {'title': 'Experience - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=5jzgTFw2T6w'},
                    {'title': 'I Giorni - Ludovico Einaudi', 'url': 'https://www.youtube.com/watch?v=4TR1y5Q0JJ4'},
                    {'title': 'The Journey - 911 Band', 'url': 'https://www.youtube.com/watch?v=8N_ZjC9Q9Z8'}
                ]
            },
            'neutral': {
                'name': 'Chill & Background Music',
                'description': 'Easy listening music for everyday moments',
                'search_query': 'chill background music playlist',
                'fallback_tracks': [
                    {'title': 'Take Five - Dave Brubeck', 'url': 'https://www.youtube.com/watch?v=vmDDOFXSgAs'},
                    {'title': 'What a Wonderful World - Louis Armstrong', 'url': 'https://www.youtube.com/watch?v=A3yCcXgbKrE'},
                    {'title': 'Fly Me to the Moon - Frank Sinatra', 'url': 'https://www.youtube.com/watch?v=ZEcqHA7dbwM'},
                    {'title': 'Feeling Good - Nina Simone', 'url': 'https://www.youtube.com/watch?v=oHRNrgDIJfw'},
                    {'title': 'At Last - Etta James', 'url': 'https://www.youtube.com/watch?v=oz4RDZrTpHU'}
                ]
            }
        }

        return emotion_playlists.get(emotion, emotion_playlists['neutral'])

    def get_recommendations(self, emotion: str, limit: int = 5) -> Dict:
        """Get YouTube recommendations for emotion-based music"""
        emotion_playlist = self.get_emotion_playlist(emotion)

        # Try to search for real YouTube playlists
        playlists = self.search_playlists(emotion_playlist['search_query'], 3)

        tracks = []
        if playlists:
            # Use the first playlist found and get its videos
            playlist_id = playlists[0]['id']
            videos = self.get_playlist_videos(playlist_id, limit)

            if videos:
                tracks = [{
                    'name': video['title'],
                    'artist': video['channel_title'],
                    'youtube_id': video['id'],
                    'youtube_url': video['url'],
                    'thumbnail': video['thumbnail'],
                    'duration': video['duration']
                } for video in videos]
            else:
                # Fallback to curated tracks if no videos found
                tracks = [{
                    'name': track['title'],
                    'artist': 'Various Artists',
                    'youtube_id': None,
                    'youtube_url': track['url'],
                    'thumbnail': '',
                    'duration': '0:00'
                } for track in emotion_playlist['fallback_tracks'][:limit]]
        else:
            # Use fallback tracks if no playlists found
            tracks = [{
                'name': track['title'],
                'artist': 'Various Artists',
                'youtube_id': None,
                'youtube_url': track['url'],
                'thumbnail': '',
                'duration': '0:00'
            } for track in emotion_playlist['fallback_tracks'][:limit]]

        return {
            'emotion': emotion,
            'playlist_name': emotion_playlist['name'],
            'description': emotion_playlist['description'],
            'tracks': tracks,
            'source': 'youtube',
            'total_tracks': len(tracks)
        }

# Global YouTube instance
youtube_client = YouTubeIntegration()
