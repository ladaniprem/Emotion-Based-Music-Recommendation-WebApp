#!/bin/bash

# Emotion-Based Music Recommendation System - Development Launcher
# This script starts both frontend and backend simultaneously

echo "🎵 Emotion-Based Music Recommendation System"
echo "============================================"
echo ""

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.7+ first."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Function to start backend
start_backend() {
    echo "🚀 Starting Backend Server..."
    cd backend
    python app.py &
    BACKEND_PID=$!
    cd ..
    echo "📊 Backend started with PID: $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    echo "🌐 Starting Frontend Server..."
    npm run dev &
    FRONTEND_PID=$!
    echo "⚛️  Frontend started with PID: $FRONTEND_PID"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "📊 Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "⚛️  Frontend stopped"
    fi
    echo "👋 All servers stopped"
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "🔧 Setting up development environment..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/venv" ] && [ ! -d "backend/__pycache__" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    pip install -r requirements.txt
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "🎯 Starting Development Servers..."
echo "==================================="
echo ""

# Start backend
start_backend

# Wait a moment for backend to start
sleep 3

# Start frontend
start_frontend

echo ""
echo "✅ Development servers started successfully!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "📊 Backend:  http://localhost:5000"
echo "💚 Health:   http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user to stop
wait
