#!/usr/bin/env python3
"""
Backend Startup Script for Emotion-Based Music Recommendation System
"""

import os
import sys
import subprocess
from pathlib import Path

def check_dependencies():
    """Check if required Python packages are installed"""
    try:
        import flask
        import cv2
        import numpy
        import tensorflow
        import flask_cors
        print("✅ All Python dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Run: pip install -r requirements.txt")
        return False

def start_backend():
    """Start the Flask backend server"""
    print("🚀 Starting Emotion-Based Music Recommendation Backend...")

    # Change to backend directory
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)

    # Start Flask server
    try:
        from app import app
        print("📊 Backend Flow: Camera → Emotion Detection → Music + Subject Recommendations")
        print("🌐 Server will be available at: http://localhost:5000")
        print("📡 API Endpoints:")
        print("   POST /detect-emotion - Main emotion detection")
        print("   GET  /emotion-timeline - Get emotion history")
        print("   POST /clear-timeline - Clear emotion data")
        print("   GET  /health - Health check")
        print("")
        print("Press Ctrl+C to stop the server")
        print("=" * 50)

        app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)

    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return False

def main():
    """Main function to start the backend"""
    print("🎵 Emotion-Based Music Recommendation System")
    print("=" * 50)

    # Check if we're in the right directory
    if not Path("backend/app.py").exists():
        print("❌ Please run this script from the project root directory")
        sys.exit(1)

    # Check dependencies
    if not check_dependencies():
        sys.exit(1)

    # Start backend
    try:
        start_backend()
    except KeyboardInterrupt:
        print("\n👋 Backend server stopped")
    except Exception as e:
        print(f"❌ Backend startup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
