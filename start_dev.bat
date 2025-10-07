@echo off
REM Emotion-Based Music Recommendation System - Development Launcher (Windows)
REM This script starts both frontend and backend simultaneously

echo 🎵 Emotion-Based Music Recommendation System
echo ============================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.7+ first.
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo 🔧 Setting up development environment...
echo.

REM Check if backend dependencies are installed
if not exist "backend\__pycache__" (
    echo 📦 Installing backend dependencies...
    cd backend
    pip install -r requirements.txt
    cd ..
)

REM Check if frontend dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

echo.
echo 🎯 Starting Development Servers...
echo ===================================
echo.

REM Start backend in background
echo 🚀 Starting Backend Server...
start /B cmd /C "cd backend && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in background
echo 🌐 Starting Frontend Server...
start /B cmd /C "npm run dev"

echo.
echo ✅ Development servers started successfully!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 📊 Backend:  http://localhost:5000
echo 💚 Health:   http://localhost:5000/health
echo.
echo Press any key to stop all servers
pause >nul

REM Cleanup - stop all node and python processes
echo.
echo 🛑 Shutting down servers...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
echo 👋 All servers stopped
pause
