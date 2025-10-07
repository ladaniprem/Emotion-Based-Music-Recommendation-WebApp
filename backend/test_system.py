#!/usr/bin/env python3
"""
Complete system test script
Tests emotion detection, music recommendations, and Spotify integration
"""

import requests
import json
import time
from datetime import datetime

def test_backend_health():
    """Test if backend is running"""
    try:
        response = requests.get("http://localhost:5000/health")
        if response.status_code == 200:
            print("✅ Backend is running")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def test_emotion_detection():
    """Test emotion detection with mock data"""
    print("\n🧪 Testing Emotion Detection...")

    # Test with pre-detected emotion (no image processing)
    test_data = {
        "emotion": "happy",
        "confidence": 0.85
    }

    try:
        response = requests.post(
            "http://localhost:5000/detect-emotion",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            result = response.json()
            print(f"✅ Emotion detection successful: {result['emotion']} ({result['confidence']})")

            # Check music recommendations
            music = result.get('music', {})
            if music.get('youtube_recommendations'):
                print(f"✅ YouTube recommendations available: {len(music['youtube_recommendations'].get('tracks', []))} tracks")

            if music.get('spotify_recommendations'):
                print(f"✅ Spotify recommendations available: {len(music['spotify_recommendations'].get('tracks', []))} tracks")
            else:
                print("⚠️  Spotify recommendations not available (credentials not set)")

            return True
        else:
            print(f"❌ Emotion detection failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Emotion detection error: {e}")
        return False

def test_spotify_integration():
    """Test Spotify integration status"""
    print("\n🎵 Testing Spotify Integration...")

    try:
        response = requests.get("http://localhost:5000/spotify/status")

        if response.status_code == 200:
            status = response.json()
            print(f"Spotify configured: {status.get('client_id_configured', False)}")
            print(f"Spotify authenticated: {status.get('spotify_available', False)}")

            if status.get('spotify_available'):
                # Test emotion-specific recommendations
                emotion_response = requests.get("http://localhost:5000/spotify/recommendations/happy")
                if emotion_response.status_code == 200:
                    data = emotion_response.json()
                    tracks = data.get('tracks', [])
                    print(f"✅ Spotify emotion recommendations: {len(tracks)} tracks")
                else:
                    print("❌ Spotify emotion recommendations failed")
            else:
                print("⚠️  Spotify not authenticated (set credentials in .env file)")

            return status.get('spotify_available', False)
        else:
            print(f"❌ Spotify status check failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Spotify integration error: {e}")
        return False

def test_emotion_timeline():
    """Test emotion timeline functionality"""
    print("\n📊 Testing Emotion Timeline...")

    try:
        response = requests.get("http://localhost:5000/emotion-timeline")

        if response.status_code == 200:
            timeline = response.json()
            print(f"✅ Emotion timeline retrieved: {len(timeline.get('emotions', []))} records")
            return True
        else:
            print(f"❌ Emotion timeline failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Emotion timeline error: {e}")
        return False

def run_complete_test():
    """Run complete system test"""
    print("🚀 Complete System Test")
    print("=" * 50)
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    results = []

    # Test backend health
    results.append(("Backend Health", test_backend_health()))

    # Test emotion detection
    results.append(("Emotion Detection", test_emotion_detection()))

    # Test Spotify integration
    results.append(("Spotify Integration", test_spotify_integration()))

    # Test emotion timeline
    results.append(("Emotion Timeline", test_emotion_timeline()))

    # Summary
    print("\n" + "=" * 50)
    print("📋 TEST SUMMARY")

    passed = 0
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1

    print(f"\nOverall: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All systems operational!")
    elif passed >= total - 1:
        print("⚠️  Minor issues detected")
    else:
        print("🔧 System needs attention")

    return passed == total

if __name__ == "__main__":
    success = run_complete_test()
    exit(0 if success else 1)
