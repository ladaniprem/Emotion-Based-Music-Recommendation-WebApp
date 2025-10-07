#!/usr/bin/env python3
"""
Test script for Spotify integration
Tests Spotify API connectivity and emotion-based recommendations
"""

import os
from spotify_integration import spotify_client

def test_spotify_integration():
    """Test Spotify integration functionality"""

    print("🎵 Testing Spotify Integration")
    print("=" * 50)

    # Check Spotify client status
    print(f"Spotify Client ID configured: {bool(os.getenv('SPOTIPY_CLIENT_ID'))}")
    print(f"Spotify Client Secret configured: {bool(os.getenv('SPOTIPY_CLIENT_SECRET'))}")
    print(f"Spotify access token available: {spotify_client.access_token is not None}")

    if not spotify_client.access_token:
        print("❌ Spotify not configured. Set SPOTIPY_CLIENT_ID and SPOTIPY_CLIENT_SECRET")
        return

    # Test emotion-based recommendations
    emotions = ['happy', 'sad', 'stressed', 'neutral', 'excited']

    for emotion in emotions:
        print(f"\n🎯 Testing {emotion} emotion recommendations...")
        try:
            recommendations = spotify_client.get_recommendations(emotion, limit=3)

            if recommendations and recommendations.get('tracks'):
                print(f"✅ Found {len(recommendations['tracks'])} tracks")
                for i, track in enumerate(recommendations['tracks'][:3], 1):
                    print(f"  {i}. {track['name']} by {track['artist']}")
            else:
                print("❌ No tracks found")

        except Exception as e:
            print(f"❌ Error getting {emotion} recommendations: {e}")

    # Test playlist retrieval
    print("
🎶 Testing playlist retrieval..."    test_playlist_id = "37i9dQZF1DXbpR3uCBnjpF"  # Happy Hits playlist
    try:
        tracks = spotify_client.get_playlist_tracks(test_playlist_id, limit=5)
        if tracks:
            print(f"✅ Retrieved {len(tracks)} tracks from playlist")
            for i, item in enumerate(tracks[:3], 1):
                track = item.get('track', {})
                if track:
                    print(f"  {i}. {track.get('name', 'Unknown')} by {', '.join([artist['name'] for artist in track.get('artists', [])])}")
        else:
            print("❌ No tracks in playlist")
    except Exception as e:
        print(f"❌ Error retrieving playlist: {e}")

    # Test search functionality
    print("
🔍 Testing search functionality..."    try:
        results = spotify_client.search_tracks("happy pharrell", limit=3)
        if results:
            print(f"✅ Found {len(results)} search results")
            for i, track in enumerate(results[:3], 1):
                print(f"  {i}. {track['name']} by {', '.join([artist['name'] for artist in track['artists']])}")
        else:
            print("❌ No search results")
    except Exception as e:
        print(f"❌ Error searching tracks: {e}")

    print("\n✅ Spotify integration test completed!")

if __name__ == "__main__":
    test_spotify_integration()
