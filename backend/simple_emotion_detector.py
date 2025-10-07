import cv2
import numpy as np

class EmotionDetector:
    """Simple emotion detector using OpenCV without warnings"""

    def __init__(self):
        """Initialize the emotion detector"""
        print("✅ Simple emotion detector initialized")

        # Emotion mapping for music recommendations
        self.emotion_mapping = {
            'angry': 'stressed',
            'disgust': 'stressed',
            'fear': 'stressed',
            'happy': 'happy',
            'sad': 'sad',
            'surprise': 'excited',
            'neutral': 'neutral',
            'excited': 'excited',
            'calm': 'calm',
            'focused': 'focused',
            'tired': 'tired',
            'stressed': 'stressed'
        }

    def detect_emotion(self, frame):
        """
        Simple emotion detection based on image features
        Returns: (emotion, confidence)
        """
        try:
            # Check for black screen/camera issues
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            avg_brightness = np.mean(gray)
            brightness_threshold = 20

            if avg_brightness < brightness_threshold:
                return 'neutral', 0.1

            # Simple emotion detection based on brightness and contrast
            contrast = np.std(gray) / (avg_brightness + 1e-7)

            # Face detection using OpenCV
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(50, 50))

            if len(faces) > 0:
                # Use largest face
                x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
                face_roi = gray[y:y+h, x:x+w]

                # Analyze face region
                face_brightness = np.mean(face_roi)
                face_contrast = np.std(face_roi) / (face_brightness + 1e-7)

                # Simple emotion classification based on features
                if face_brightness > 160:
                    emotion = 'happy'
                    confidence = 0.8
                elif face_brightness < 90:
                    emotion = 'sad'
                    confidence = 0.7
                elif face_contrast > 0.4:
                    emotion = 'excited'
                    confidence = 0.75
                elif face_contrast < 0.2:
                    emotion = 'calm'
                    confidence = 0.7
                else:
                    emotion = 'neutral'
                    confidence = 0.6

                return emotion, confidence
            else:
                # No face detected
                return 'neutral', 0.5

        except Exception as e:
            print(f"Emotion detection error: {e}")
            return 'neutral', 0.5

    def get_face_with_emotion(self, frame):
        """
        Return frame with face detection boxes and emotion labels
        """
        try:
            emotion, confidence = self.detect_emotion(frame)

            # Draw emotion text
            cv2.putText(frame, f"{emotion.upper()} ({confidence:.1f})",
                       (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            return frame
        except Exception as e:
            print(f"Visualization error: {e}")
            return frame
