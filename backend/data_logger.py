import json
import os
from datetime import datetime, timedelta
from collections import defaultdict, Counter

class DataLogger:
    def __init__(self, data_file='emotion_data.json'):
        """Initialize data logger for emotion timeline tracking"""
        
        self.data_file = data_file
        self.ensure_data_file_exists()
    
    def ensure_data_file_exists(self):
        """Create data file if it doesn't exist"""
        
        if not os.path.exists(self.data_file):
            initial_data = {
                'emotions': [],
                'sessions': [],
                'statistics': {}
            }
            
            with open(self.data_file, 'w') as f:
                json.dump(initial_data, f, indent=2)
    
    def log_emotion(self, emotion, confidence, additional_data=None):
        """
        Log detected emotion with timestamp
        
        Args:
            emotion (str): Detected emotion
            confidence (float): Detection confidence
            additional_data (dict): Any additional metadata
        """
        
        try:
            # Read existing data
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            
            # Create emotion entry
            emotion_entry = {
                'emotion': emotion,
                'confidence': confidence,
                'timestamp': datetime.now().isoformat(),
                'date': datetime.now().strftime('%Y-%m-%d'),
                'time': datetime.now().strftime('%H:%M:%S'),
                'hour': datetime.now().hour,
                'day_of_week': datetime.now().strftime('%A')
            }
            
            # Add additional data if provided
            if additional_data:
                emotion_entry.update(additional_data)
            
            # Append to emotions list
            data['emotions'].append(emotion_entry)
            
            # Update statistics
            self._update_statistics(data)
            
            # Save back to file
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
            
            print(f"✅ Logged emotion: {emotion} (confidence: {confidence:.2f})")
        
        except Exception as e:
            print(f"❌ Error logging emotion: {str(e)}")
    
    def get_timeline(self, days=7):
        """
        Get emotion timeline data for the last N days
        
        Args:
            days (int): Number of days to retrieve
            
        Returns:
            dict: Timeline data formatted for frontend graphs
        """
        
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            
            # Filter emotions for the last N days
            cutoff_date = datetime.now() - timedelta(days=days)
            recent_emotions = [
                emotion for emotion in data['emotions']
                if datetime.fromisoformat(emotion['timestamp']) >= cutoff_date
            ]
            
            # Prepare timeline data
            timeline_data = {
                'daily_emotions': self._get_daily_emotions(recent_emotions),
                'hourly_distribution': self._get_hourly_distribution(recent_emotions),
                'emotion_frequency': self._get_emotion_frequency(recent_emotions),
                'mood_trends': self._get_mood_trends(recent_emotions),
                'statistics': data.get('statistics', {}),
                'total_entries': len(recent_emotions),
                'date_range': {
                    'start': cutoff_date.strftime('%Y-%m-%d'),
                    'end': datetime.now().strftime('%Y-%m-%d')
                }
            }
            
            return timeline_data
        
        except Exception as e:
            print(f"❌ Error getting timeline: {str(e)}")
            return {'error': str(e)}
    
    def _get_daily_emotions(self, emotions):
        """Group emotions by day for daily trend analysis"""
        
        daily_data = defaultdict(list)
        
        for emotion in emotions:
            date = emotion['date']
            daily_data[date].append(emotion['emotion'])
        
        # Calculate dominant emotion per day
        daily_emotions = {}
        for date, day_emotions in daily_data.items():
            emotion_counts = Counter(day_emotions)
            dominant_emotion = emotion_counts.most_common(1)[0][0]
            
            daily_emotions[date] = {
                'dominant_emotion': dominant_emotion,
                'emotion_counts': dict(emotion_counts),
                'total_detections': len(day_emotions)
            }
        
        return daily_emotions
    
    def _get_hourly_distribution(self, emotions):
        """Get emotion distribution by hour of day"""
        
        hourly_data = defaultdict(list)
        
        for emotion in emotions:
            hour = emotion['hour']
            hourly_data[hour].append(emotion['emotion'])
        
        # Calculate emotion distribution for each hour
        hourly_distribution = {}
        for hour in range(24):
            if hour in hourly_data:
                emotion_counts = Counter(hourly_data[hour])
                hourly_distribution[hour] = {
                    'emotions': dict(emotion_counts),
                    'total': len(hourly_data[hour])
                }
            else:
                hourly_distribution[hour] = {'emotions': {}, 'total': 0}
        
        return hourly_distribution
    
    def _get_emotion_frequency(self, emotions):
        """Get overall emotion frequency statistics"""
        
        emotion_counts = Counter([emotion['emotion'] for emotion in emotions])
        total_emotions = len(emotions)
        
        emotion_frequency = {}
        for emotion, count in emotion_counts.items():
            emotion_frequency[emotion] = {
                'count': count,
                'percentage': round((count / total_emotions) * 100, 2) if total_emotions > 0 else 0
            }
        
        return emotion_frequency
    
    def _get_mood_trends(self, emotions):
        """Analyze mood trends and patterns"""
        
        if len(emotions) < 2:
            return {'trend': 'insufficient_data'}
        
        # Sort emotions by timestamp
        sorted_emotions = sorted(emotions, key=lambda x: x['timestamp'])
        
        # Simple trend analysis - compare first half vs second half
        mid_point = len(sorted_emotions) // 2
        first_half = sorted_emotions[:mid_point]
        second_half = sorted_emotions[mid_point:]
        
        # Calculate mood scores (happy=4, neutral=3, sad=2, stressed=1)
        mood_scores = {'happy': 4, 'neutral': 3, 'sad': 2, 'stressed': 1}
        
        first_half_score = sum(mood_scores.get(e['emotion'], 2.5) for e in first_half) / len(first_half)
        second_half_score = sum(mood_scores.get(e['emotion'], 2.5) for e in second_half) / len(second_half)
        
        trend_direction = 'improving' if second_half_score > first_half_score else 'declining' if second_half_score < first_half_score else 'stable'
        
        return {
            'trend': trend_direction,
            'first_half_score': round(first_half_score, 2),
            'second_half_score': round(second_half_score, 2),
            'change': round(second_half_score - first_half_score, 2)
        }
    
    def _update_statistics(self, data):
        """Update overall statistics"""
        
        emotions = data['emotions']
        
        if not emotions:
            return
        
        # Calculate various statistics
        total_detections = len(emotions)
        emotion_counts = Counter([e['emotion'] for e in emotions])
        
        # Most common emotion
        most_common_emotion = emotion_counts.most_common(1)[0] if emotion_counts else ('neutral', 0)
        
        # Average confidence
        avg_confidence = sum(e['confidence'] for e in emotions) / total_detections
        
        # Daily average
        unique_dates = set(e['date'] for e in emotions)
        daily_average = total_detections / len(unique_dates) if unique_dates else 0
        
        # Update statistics
        data['statistics'] = {
            'total_detections': total_detections,
            'most_common_emotion': {
                'emotion': most_common_emotion[0],
                'count': most_common_emotion[1]
            },
            'average_confidence': round(avg_confidence, 2),
            'daily_average': round(daily_average, 2),
            'unique_days': len(unique_dates),
            'last_updated': datetime.now().isoformat()
        }
    
    def clear_timeline(self):
        """Clear all emotion timeline data"""
        
        try:
            initial_data = {
                'emotions': [],
                'sessions': [],
                'statistics': {}
            }
            
            with open(self.data_file, 'w') as f:
                json.dump(initial_data, f, indent=2)
            
            print("✅ Timeline data cleared successfully")
            return True
        
        except Exception as e:
            print(f"❌ Error clearing timeline: {str(e)}")
            return False
    
    def get_session_summary(self, session_duration_minutes=60):
        """
        Get summary of current study session
        
        Args:
            session_duration_minutes (int): Duration to consider as current session
            
        Returns:
            dict: Session summary with recommendations
        """
        
        try:
            # Get emotions from the last session duration
            cutoff_time = datetime.now() - timedelta(minutes=session_duration_minutes)
            
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            
            session_emotions = [
                emotion for emotion in data['emotions']
                if datetime.fromisoformat(emotion['timestamp']) >= cutoff_time
            ]
            
            if not session_emotions:
                return {'message': 'No emotions detected in current session'}
            
            # Analyze session
            emotion_counts = Counter([e['emotion'] for e in session_emotions])
            dominant_emotion = emotion_counts.most_common(1)[0][0]
            avg_confidence = sum(e['confidence'] for e in session_emotions) / len(session_emotions)
            
            # Generate session insights
            session_summary = {
                'session_duration': session_duration_minutes,
                'total_detections': len(session_emotions),
                'dominant_emotion': dominant_emotion,
                'emotion_distribution': dict(emotion_counts),
                'average_confidence': round(avg_confidence, 2),
                'session_mood_score': self._calculate_mood_score(session_emotions),
                'recommendations': self._get_session_recommendations(dominant_emotion, len(session_emotions))
            }
            
            return session_summary
        
        except Exception as e:
            print(f"❌ Error getting session summary: {str(e)}")
            return {'error': str(e)}
    
    def _calculate_mood_score(self, emotions):
        """Calculate overall mood score for a session"""
        
        mood_scores = {'happy': 4, 'neutral': 3, 'sad': 2, 'stressed': 1}
        
        if not emotions:
            return 0
        
        total_score = sum(mood_scores.get(e['emotion'], 2.5) for e in emotions)
        return round(total_score / len(emotions), 2)
    
    def _get_session_recommendations(self, dominant_emotion, detection_count):
        """Get recommendations based on session analysis"""
        
        recommendations = {
            'happy': [
                "Great energy! Consider tackling challenging problems.",
                "Your positive mood is perfect for creative work.",
                "Take advantage of this motivation for new learning."
            ],
            'neutral': [
                "Balanced state - good for steady progress.",
                "Continue with regular study routine.",
                "Maintain this focused approach."
            ],
            'sad': [
                "Consider taking a short break or doing light review.",
                "Focus on familiar topics to build confidence.",
                "Remember that progress takes time."
            ],
            'stressed': [
                "Take a break and try some relaxation techniques.",
                "Switch to easier topics to reduce pressure.",
                "Consider shorter study sessions."
            ]
        }
        
        base_recommendations = recommendations.get(dominant_emotion, ["Continue studying at your own pace."])
        
        # Add detection frequency insights
        if detection_count > 10:
            base_recommendations.append("High detection frequency - your emotions are being tracked well!")
        elif detection_count < 3:
            base_recommendations.append("Consider staying closer to the camera for better emotion detection.")
        
        return base_recommendations
