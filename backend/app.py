from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
from datetime import datetime
import json
import os
import base64

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

from simple_emotion_detector import EmotionDetector
from music_recommender import MusicRecommender
from subject_suggester import SubjectSuggester
from data_logger import DataLogger
from youtube_integration import youtube_client

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize components
emotion_detector = EmotionDetector()
music_recommender = MusicRecommender()
subject_suggester = SubjectSuggester()
data_logger = DataLogger()

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "message": "Backend is running!"})

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    """
    Main endpoint for emotion detection and recommendations
    Accepts either:
    1. Base64 encoded image from camera
    2. Pre-detected emotion label
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        emotion = None
        confidence = 0.0
        
        # Method 1: Process camera frame
        if 'image' in data:
            # Decode base64 image
            image_data = data['image'].split(',')[1]  # Remove data:image/jpeg;base64,
            image_bytes = base64.b64decode(image_data)
            
            # Convert to OpenCV format
            nparr = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Detect emotion from frame
            emotion, confidence = emotion_detector.detect_emotion(frame)
        
        # Method 2: Use pre-detected emotion
        elif 'emotion' in data:
            emotion = data['emotion'].lower()
            confidence = data.get('confidence', 1.0)
        
            return jsonify({"error": "Either 'image' or 'emotion' must be provided"}), 400
        
        if not emotion:
            return jsonify({"error": "Could not detect emotion"}), 400
        
        # Get music recommendations (YouTube)
        music_recommendations = youtube_client.get_recommendations(emotion)

        # Combine music recommendations
        combined_music = {
            'emotion': emotion,
            'confidence': round(confidence, 2),
            'youtube_recommendations': music_recommendations,
            'source': 'youtube'
        }

        # Get subject suggestions
        subject_suggestion = subject_suggester.get_suggestion(emotion)

        # Log the emotion data for timeline
        data_logger.log_emotion(emotion, confidence)
        
        # Prepare response
        response = {
            "emotion": emotion,
            "confidence": round(confidence, 2),
            "music": combined_music,
            "subject": subject_suggestion,
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error in detect_emotion: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/emotion-timeline', methods=['GET'])
def get_emotion_timeline():
    """Get emotion timeline data for graphs"""
    try:
        timeline_data = data_logger.get_timeline()
        return jsonify(timeline_data)
    
    except Exception as e:
        print(f"Error in get_emotion_timeline: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/clear-timeline', methods=['POST'])
def clear_timeline():
    """Clear emotion timeline data"""
    try:
        data_logger.clear_timeline()
    
    except Exception as e:
        print(f"Error in clear_timeline: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/youtube/status', methods=['GET'])
def youtube_status():
    """Check YouTube integration status"""
    try:
        status = {
            "youtube_available": bool(os.getenv('YOUTUBE_API_KEY')),
            "api_key_configured": bool(os.getenv('YOUTUBE_API_KEY'))
        }
        return jsonify(status)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/youtube/search', methods=['GET'])
def search_youtube():
    """Search YouTube for playlists"""
    try:
        query = request.args.get('q', '')
        limit = int(request.args.get('limit', 10))

        if not query:
            return jsonify({"error": "Query parameter 'q' is required"}), 400

        playlists = youtube_client.search_playlists(query, limit)
        return jsonify({"playlists": playlists})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/youtube/playlist/<playlist_id>', methods=['GET'])
def get_youtube_playlist(playlist_id):
    """Get videos from a YouTube playlist"""
    try:
        videos = youtube_client.get_playlist_videos(playlist_id)
        return jsonify({"videos": videos})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/youtube/recommendations/<emotion>', methods=['GET'])
def get_youtube_recommendations(emotion):
    """Get YouTube recommendations for a specific emotion"""
    try:
        recommendations = youtube_client.get_recommendations(emotion.lower())
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# SocketIO Event Handlers for Real-Time Communication

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('connected', {'status': 'connected'})

@socketio.on('disconnect') 
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

@socketio.on('start_emotion_detection')
def handle_start_emotion_detection():
    emit('emotion_detection_started', {'status': 'started'})

@socketio.on('stop_emotion_detection')
def handle_stop_emotion_detection():
    emit('emotion_detection_stopped', {'status': 'stopped'})

@socketio.on('analyze_frame')
def handle_analyze_frame(data):
    try:
        # Decode base64 image
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        
        # Convert to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            emit('emotion_result', {'error': 'Invalid image'})
            return
        
        # Detect emotion
        emotion, confidence = emotion_detector.detect_emotion(frame)
        
        # Get music recommendations
        music_recommendations = youtube_client.get_recommendations(emotion)
        
        # Get subject suggestions  
        subject_suggestion = subject_suggester.get_suggestion(emotion)
        
        # Log the emotion data
        data_logger.log_emotion(emotion, confidence)
        
        # Prepare response
        result = {
            'emotion': emotion,
            'confidence': round(confidence, 2),
            'music': music_recommendations,
            'subject': subject_suggestion,
            'timestamp': datetime.now().isoformat()
        }
        
        # Send result to client
        emit('emotion_result', result)
        
    except Exception as e:
        print(f'Error in real-time analysis: {e}')
        emit('emotion_result', {'error': str(e)})

@socketio.on('get_emotion_timeline')
def handle_get_emotion_timeline():
    try:
        timeline_data = data_logger.get_timeline()
        emit('emotion_timeline', timeline_data)
    except Exception as e:
        emit('emotion_timeline_error', {'error': str(e)})

if __name__ == '__main__':
    print('Starting Flask-SocketIO server...')
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
