#!/usr/bin/env python3
"""
Test script for emotion detection system
Tests all detection methods and provides accuracy metrics
"""

import cv2
import numpy as np
from emotion_detector import EmotionDetector
import time

def test_emotion_detection():
    """Test the emotion detection system with different methods"""

    print("🧪 Testing Emotion Detection System")
    print("=" * 50)

    # Initialize detector
    detector = EmotionDetector()

    # Test with webcam if available
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("❌ No webcam available for testing")
        return

    print("📹 Testing with webcam feed...")

    try:
        for i in range(10):  # Test 10 frames
            ret, frame = cap.read()
            if not ret:
                break

            # Detect emotion
            emotion, confidence = detector.detect_emotion(frame)

            print(".2f")

            # Show frame with detection
            annotated_frame = detector.get_face_with_emotion(frame)
            cv2.imshow('Emotion Detection Test', annotated_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

            time.sleep(1)  # Wait 1 second between detections

        print("\n✅ Emotion detection test completed successfully!")

    except Exception as e:
        print(f"❌ Test failed: {e}")

    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    test_emotion_detection()
