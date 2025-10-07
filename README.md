# 🎵 Emotion-Based Music Recommendation System

A complete AI-powered system that detects emotions from webcam feed, provides personalized music recommendations, and suggests study subjects for engineering students.

## 🚀 Quick Start

### 1. Backend Setup
```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt

# Start the backend server
python app.py
# OR use the startup script
cd ..
python start_backend.py
```

### 2. Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Configure backend URL (optional)
cp .env.example .env.local
# Edit .env.local if your backend is on a different URL

# Start the frontend
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🔗 Frontend-Backend Connection

### Environment Configuration
Create a `.env.local` file in the project root:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### API Integration
The frontend automatically connects to the backend for:
- ✅ **Real emotion detection** using OpenCV
- ✅ **Personalized music recommendations** based on mood
- ✅ **Study subject suggestions** for engineering students
- ✅ **Emotion timeline logging** for analytics

### Fallback System
If the backend is unavailable, the frontend automatically falls back to mock data with full functionality.

## 📊 System Architecture

```
┌─────────────────┐    HTTP API    ┌─────────────────┐
│   Next.js       │───────────────▶│   Flask         │
│   Frontend      │                │   Backend       │
│                 │◀───────────────│                 │
│ - Webcam Feed   │    JSON        │ - OpenCV        │
│ - Music Player  │                │ - Emotion Det.  │
│ - Study Guide   │                │ - Music Rec.    │
│ - Analytics     │                │ - Subject Sug.  │
└─────────────────┘                └─────────────────┘
```

## 🎯 How It Works

### 1. Face Detection Session
- Webcam captures face **once** every 10-minute cycle
- 10-minute detection session prevents continuous analysis
- Visual feedback shows session status and countdown

### 2. Emotion Processing
- OpenCV analyzes facial features
- Maps to 4 emotion categories: Happy, Sad, Stressed, Neutral
- Confidence scoring for accuracy

### 3. Music Recommendations
- 32 different songs across emotion categories
- YouTube embeds for real music playback
- 10-minute sessions with auto-song changes

### 4. Study Subject Suggestions
- Engineering-focused subject recommendations
- Emotion-based learning strategies
- Study duration and tips provided

## 🛠️ API Endpoints

### `POST /detect-emotion`
Main emotion detection endpoint.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response:**
```json
{
  "emotion": "happy",
  "confidence": 0.85,
  "music": {
    "title": "Happy - Pharrell Williams",
    "artist": "Pharrell Williams",
    "duration": 285,
    "albumArt": "🎵"
  },
  "subject": {
    "primary_recommendation": "Advanced Programming Projects",
    "reasoning": "High energy perfect for challenging concepts",
    "study_duration": "60-90 minutes"
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### `GET /emotion-timeline`
Get emotion history for analytics.

### `POST /clear-timeline`
Clear stored emotion data.

### `GET /health`
Backend health check.

## 🎨 Features

### Frontend (AI-Themed UI)
- **Neural Network Design**: Matrix backgrounds, terminal-style fonts
- **Real-time Webcam**: Face detection with status indicators
- **Music Player**: YouTube integration with 10-minute sessions
- **Study Guide**: Emotion-based subject recommendations
- **Analytics**: Emotion timeline and mood trends

### Backend (AI Processing)
- **OpenCV Integration**: Real facial emotion detection
- **Music Database**: 32 songs across 4 emotion categories
- **Subject Engine**: Engineering-focused study recommendations
- **Session Management**: 10-minute detection cycles
- **Data Logging**: Emotion timeline persistence

## 🔧 Development

### Project Structure
```
├── frontend/          # Next.js React app
│   ├── components/    # UI components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Next.js pages
│   └── styles/        # CSS styles
├── backend/           # Flask Python API
│   ├── app.py         # Main Flask application
│   ├── emotion_detector.py
│   ├── music_recommender.py
│   ├── subject_suggester.py
│   └── data_logger.py
└── README.md
```

### Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Flask, OpenCV, TensorFlow, NumPy
- **AI/ML**: Facial emotion recognition, pattern analysis
- **Media**: YouTube API integration for music playback

## 🚨 Troubleshooting

### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check backend logs for errors
# Backend automatically falls back to mock data if unavailable
```

### Camera Permission Issues
- Allow camera access in browser
- Check if camera is used by another application
- Try refreshing the page

### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 3000
- Change ports in respective configuration files if needed

## 📝 License

This project is for educational purposes. Music recommendations use YouTube embeds for demonstration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test frontend-backend integration
5. Submit a pull request

---

**🎵 Ready to experience AI-powered emotion-based learning! 🚀**
