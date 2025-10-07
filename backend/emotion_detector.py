import cv2
import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
# Try to import DeepFace library, but make it optional
try:
    from deepface import DeepFace
    import cv2
    DEEPFACE_AVAILABLE = True
    print("✅ DeepFace library loaded successfully")
except ImportError:
    DeepFace = None
    DEEPFACE_AVAILABLE = False
    print("⚠️  DeepFace library not available. Using enhanced OpenCV detection only.")

# Try to import dlib library, but make it optional
try:
    import dlib
    DLIB_AVAILABLE = True
    print("✅ dlib library loaded successfully")
except ImportError:
    dlib = None
    DLIB_AVAILABLE = False
    print("⚠️  dlib not available - using OpenCV fallback for face detection")

import os
from typing import List, Tuple, Optional

# Constants
WHITE_COLOR = (255, 255, 255)
GREEN_COLOR = (0, 255, 0)
BLUE_COLOR = (255, 255, 104)
FONT = cv2.FONT_HERSHEY_SIMPLEX
FRAME_WIDTH = 640
FRAME_HEIGHT = 490
NO_FACE_LABEL = "no face detected"

class BoundingBox:
    """Enhanced bounding box class for face detection"""
    def __init__(self, x: int, y: int, w: int, h: int):
        self.x = x
        self.y = y
        self.w = w
        self.h = h

    @property
    def origin(self) -> Tuple[int, int]:
        return (self.x, self.y)

    @property
    def top_right(self) -> Tuple[int, int]:
        return (self.x + self.w, self.y)

    @property
    def bottom_left(self) -> Tuple[int, int]:
        return (self.x, self.y + self.h)

    @property
    def center(self) -> Tuple[int, int]:
        return (self.x + self.w // 2, self.y + self.h // 2)

class LandMarker:
    """Facial landmark detector using dlib (optional)"""
    def __init__(self, landmark_predictor_path: str):
        if not DLIB_AVAILABLE:
            self.detector = None
            self.predictor = None
            print("⚠️  LandMarker disabled - dlib not available")
            return

        try:
            self.detector = dlib.get_frontal_face_detector()
            self.predictor = dlib.shape_predictor(landmark_predictor_path)
            print("✅ LandMarker initialized with dlib")
        except Exception as e:
            print(f"⚠️  Failed to initialize LandMarker: {e}")
            self.detector = None
            self.predictor = None

    def detect_landmarks(self, image: np.ndarray, face_rect) -> Optional[np.ndarray]:
        """Detect 68 facial landmarks"""
        if not DLIB_AVAILABLE or self.detector is None or self.predictor is None:
            return None

        try:
            shape = self.predictor(image, face_rect)
            landmarks = np.array([[p.x, p.y] for p in shape.parts()])
            return landmarks
        except Exception as e:
            print(f"Error detecting landmarks: {e}")
            return None

    def get_face_rectangles(self, image: np.ndarray) -> List:
        """Get face rectangles from image"""
        if not DLIB_AVAILABLE or self.detector is None:
            # Fallback to OpenCV face detection
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(50, 50))
            # Convert to dlib-like rectangles
            return [(x, y, w, h) for (x, y, w, h) in faces]

        return self.detector(image, 1)

class ImageClassifier:
    """Advanced image classifier using machine learning"""
    def __init__(self, csv_path: str, algorithm: str = 'RandomForest', land_marker: Optional[LandMarker] = None):
        self.land_marker = land_marker
        self.algorithm = algorithm
        self.model = None
        self.scaler = StandardScaler()

        # Emotion labels
        self.emotion_labels = {
            0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy',
            4: 'sad', 5: 'surprise', 6: 'neutral', 7: 'excited',
            8: 'calm', 9: 'focused', 10: 'tired', 11: 'stressed'
        }

        self.load_and_train(csv_path)

    def load_and_train(self, csv_path: str):
        """Load dataset and train the classifier"""
        try:
            print(f"[INFO] Loading dataset from {csv_path}")
            data = pd.read_csv(csv_path)

            # Assume the last column is the label, rest are features
            X = data.iloc[:, :-1].values
            y = data.iloc[:, -1].values

            # Split the data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

            # Scale the features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)

            # Train the model
            if self.algorithm == 'RandomForest':
                self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            elif self.algorithm == 'SVM':
                self.model = SVC(kernel='rbf', C=1.0, gamma='scale', random_state=42)
            else:
                raise ValueError(f"Unsupported algorithm: {self.algorithm}")

            self.model.fit(X_train_scaled, y_train)

            # Evaluate
            y_pred = self.model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            print(".2f")

        except Exception as e:
            print(f"[ERROR] Failed to train model: {e}")
            self.model = None

    def classify(self, img: np.ndarray) -> List[str]:
        """Classify emotions in the image"""
        if self.model is None:
            return [NO_FACE_LABEL]

        try:
            # Extract features from the image
            features = self._extract_features(img)

            if features is None:
                return [NO_FACE_LABEL]

            # Scale features
            features_scaled = self.scaler.transform([features])

            # Predict
            prediction = self.model.predict(features_scaled)[0]
            emotion = self.emotion_labels.get(prediction, 'neutral')

            return [emotion]

        except Exception as e:
            print(f"[ERROR] Classification failed: {e}")
            return [NO_FACE_LABEL]

    def _extract_features(self, img: np.ndarray) -> Optional[np.ndarray]:
        """Extract facial features for classification"""
        try:
            if self.land_marker is None or not DLIB_AVAILABLE:
                # Fallback to basic features when dlib is not available
                return self._extract_basic_features(img)

            # Get face rectangles
            faces = self.land_marker.get_face_rectangles(img)

            if len(faces) == 0:
                return None

            # Use the largest face
            if DLIB_AVAILABLE and hasattr(faces[0], 'width'):
                # dlib rectangle objects
                face_rect = max(faces, key=lambda rect: rect.width() * rect.height())
            else:
                # OpenCV rectangles (x, y, w, h)
                face_rect = max(faces, key=lambda rect: rect[2] * rect[3])
                # Convert to dlib-like rectangle for compatibility
                if not DLIB_AVAILABLE:
                    face_rect = type('MockRect', (), {
                        'left': lambda: face_rect[0],
                        'top': lambda: face_rect[1],
                        'width': lambda: face_rect[2],
                        'height': lambda: face_rect[3]
                    })()

            # Get landmarks
            landmarks = self.land_marker.detect_landmarks(img, face_rect)

            if landmarks is None or len(landmarks) < 68:
                return self._extract_basic_features(img)

            # Extract geometric features from landmarks
            features = []

            # Distance features between key points
            key_points = [17, 21, 22, 26, 36, 39, 42, 45, 48, 54, 57]  # Jaw, eyes, nose, mouth

            for i in range(len(key_points)):
                for j in range(i + 1, len(key_points)):
                    p1 = landmarks[key_points[i]]
                    p2 = landmarks[key_points[j]]
                    dist = np.linalg.norm(p1 - p2)
                    features.append(dist)

            # Angle features
            # Eye aspect ratios, mouth aspect ratio, etc.
            left_eye = landmarks[36:42]
            right_eye = landmarks[42:48]
            mouth = landmarks[48:68]

            features.extend(self._calculate_eye_features(left_eye))
            features.extend(self._calculate_eye_features(right_eye))
            features.extend(self._calculate_mouth_features(mouth))

            return np.array(features)

        except Exception as e:
            print(f"[ERROR] Feature extraction failed: {e}")
            return None

    def _extract_basic_features(self, img: np.ndarray) -> Optional[np.ndarray]:
        """Extract basic features when landmarks are not available"""
        try:
            # Resize image
            resized = cv2.resize(img, (48, 48))

            # Flatten and normalize
            features = resized.flatten().astype(float) / 255.0

            return features

        except Exception as e:
            print(f"[ERROR] Basic feature extraction failed: {e}")
            return None

    def _calculate_eye_features(self, eye_points: np.ndarray) -> List[float]:
        """Calculate eye aspect ratio and other eye features"""
        features = []

        if len(eye_points) >= 6:
            # Eye aspect ratio (EAR)
            ear = self._eye_aspect_ratio(eye_points)
            features.append(ear)

            # Eye width/height ratio
            width = np.linalg.norm(eye_points[0] - eye_points[3])
            height = np.linalg.norm(eye_points[1] - eye_points[5])
            if height > 0:
                features.append(width / height)
            else:
                features.append(0)

        return features

    def _calculate_mouth_features(self, mouth_points: np.ndarray) -> List[float]:
        """Calculate mouth aspect ratio and smile features"""
        features = []

        if len(mouth_points) >= 12:
            # Mouth aspect ratio (MAR)
            mar = self._mouth_aspect_ratio(mouth_points)
            features.append(mar)

            # Smile detection (corner distances)
            left_corner = mouth_points[0]
            right_corner = mouth_points[6]
            top_lip = mouth_points[3]
            bottom_lip = mouth_points[9]

            smile_ratio = np.linalg.norm(left_corner - right_corner) / (np.linalg.norm(top_lip - bottom_lip) + 0.001)
            features.append(smile_ratio)

        return features

    def _eye_aspect_ratio(self, eye: np.ndarray) -> float:
        """Calculate eye aspect ratio"""
        if len(eye) < 6:
            return 0.0

        # Vertical distances
        v1 = np.linalg.norm(eye[1] - eye[5])
        v2 = np.linalg.norm(eye[2] - eye[4])

        # Horizontal distance
        h = np.linalg.norm(eye[0] - eye[3])

        return (v1 + v2) / (2.0 * h) if h > 0 else 0.0

    def _mouth_aspect_ratio(self, mouth: np.ndarray) -> float:
        """Calculate mouth aspect ratio"""
        if len(mouth) < 12:
            return 0.0

        # Vertical distances
        v1 = np.linalg.norm(mouth[2] - mouth[10])
        v2 = np.linalg.norm(mouth[4] - mouth[8])

        # Horizontal distance
        h = np.linalg.norm(mouth[0] - mouth[6])

        return (v1 + v2) / (2.0 * h) if h > 0 else 0.0

    def extract_face_rectangle(self, img: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """Extract face rectangles for visualization"""
        if self.land_marker is None:
            return [(0, 0, 0, 0)]

        faces = self.land_marker.get_face_rectangles(img)
        return [(face.left(), face.top(), face.width(), face.height()) for face in faces]

    def extract_landmark_points(self, img: np.ndarray) -> List[Optional[np.ndarray]]:
        """Extract landmark points for visualization"""
        if self.land_marker is None:
            return [None]

        faces = self.land_marker.get_face_rectangles(img)
        landmarks = []

        for face in faces:
            points = self.land_marker.detect_landmarks(img, face)
            landmarks.append(points)

        return landmarks

class EmotionDetector:
    """Modern emotion detector using DeepFace library"""

    def __init__(self):
        """Initialize the emotion detector with DeepFace"""
        self.deepface_available = DEEPFACE_AVAILABLE

        if DEEPFACE_AVAILABLE:
            print("✅ DeepFace emotion detector ready")
        else:
            print("⚠️  DeepFace not available - using basic OpenCV detection")

        # Enhanced emotion mapping for music recommendations
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
            'stressed': 'stressed',
            NO_FACE_LABEL: 'neutral'
        }

    def detect_emotion(self, frame):
        """
        Advanced emotion detection using FER library (primary) with fallbacks
        Based on Streamlit approach for improved accuracy
        Returns: (emotion, confidence)
        """
        try:
            # Check for black screen/camera issues (from Streamlit code)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            avg_brightness = np.mean(gray)
            brightness_threshold = 20  # A value close to 0 indicates a very dark image

            if avg_brightness < brightness_threshold:
                print("⚠️  Camera feed appears black or obstructed")
                return 'neutral', 0.1

            # Priority 1: Use FER library (most accurate)
            if self.fer_detector is not None:
                try:
                    # Detect faces using OpenCV first
                    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
                    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

                    if len(faces) == 0:
                        return 'neutral', 0.0

                    # Use the largest face detected
                    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])

                    # Get the region of interest (ROI) for emotion detection
                    roi = frame[y:y + h, x:x + w]

                    # Ensure the ROI is valid before performing emotion detection
                    if roi is not None and roi.size > 0:
                        # Detect emotions on the face using FER
                        emotions = self.fer_detector.top_emotion(roi)

                        # Check if emotions are detected and score is not None
                        if emotions and emotions[1] is not None:
                            emotion, score = emotions
                            # Map to our emotion categories and boost confidence
                            mapped_emotion = self.emotion_mapping.get(emotion, 'neutral')
                            return mapped_emotion, min(score + 0.2, 0.95)
                        else:
                            # Handle case when no valid emotion is detected
                            return 'neutral', 0.0
                    else:
                        return 'neutral', 0.0

                except Exception as e:
                    print(f"FER detection error: {e}")
                    # Fall back to enhanced detection
                    return self._fallback_detection(gray)

            # Priority 2: Use ML classifier
            elif self.classifier is not None:
                try:
                    # Apply CLAHE for better image quality
                    processed_frame = self.CLAHE.apply(gray)
                    emotions = self.classifier.classify(processed_frame)

                    if emotions and emotions[0] != NO_FACE_LABEL:
                        emotion = emotions[0]
                        mapped_emotion = self.emotion_mapping.get(emotion, 'neutral')
                        return mapped_emotion, 0.85
                    else:
                        return self._fallback_detection(gray)
                except Exception as e:
                    print(f"ML classifier error: {e}")
                    return self._fallback_detection(gray)

            # Priority 3: Enhanced rule-based detection
            else:
                return self._fallback_detection(gray)

        except Exception as e:
            print(f"Error in emotion detection: {str(e)}")
            return 'neutral', 0.0

    def _fallback_detection(self, gray_frame):
        """Enhanced rule-based emotion detection as fallback"""
        try:
            # Detect faces using OpenCV
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(gray_frame, 1.1, 5, minSize=(50, 50))

            if len(faces) == 0:
                return 'neutral', 0.0

            # Use largest face
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            face_roi = gray_frame[y:y+h, x:x+w]

            # Enhanced feature analysis
            features = self._extract_enhanced_features(face_roi, gray_frame, (x, y, w, h))

            # Multi-factor emotion classification
            scores = self._calculate_emotion_scores_enhanced(features)
            best_emotion = max(scores.items(), key=lambda x: x[1])

            confidence = min(best_emotion[1] + 0.2, 0.9)

            return best_emotion[0], confidence

        except Exception as e:
            print(f"Fallback detection error: {e}")
            return 'neutral', 0.0

    def _extract_enhanced_features(self, face_img, gray_frame=None, face_coords=None):
        """Extract comprehensive facial features for emotion analysis"""
        features = {}

        # Basic brightness analysis
        features['brightness'] = np.mean(face_img)

        # Contrast analysis
        features['contrast'] = np.std(face_img) / (np.mean(face_img) + 1e-7)

        # Face symmetry analysis
        left_half = face_img[:, :face_img.shape[1]//2]
        right_half = cv2.flip(face_img[:, face_img.shape[1]//2:], 1)
        features['symmetry'] = 1.0 - (np.mean(np.abs(left_half - right_half)) / 255.0)

        # Regional analysis
        h, w = face_img.shape
        features['eye_region'] = np.mean(face_img[int(0.2*h):int(0.5*h), :])
        features['mouth_region'] = np.mean(face_img[int(0.7*h):, :])
        features['forehead_region'] = np.mean(face_img[:int(0.3*h), :])

        # Edge detection for texture analysis
        edges = cv2.Canny(face_img, 100, 200)
        features['texture'] = np.mean(edges)

        return features

    def _calculate_emotion_scores_enhanced(self, features):
        """Enhanced emotion scoring based on multiple features"""
        scores = {
            'happy': 0.0, 'sad': 0.0, 'stressed': 0.0,
            'neutral': 0.0, 'excited': 0.0, 'calm': 0.0,
            'focused': 0.0, 'tired': 0.0
        }

        brightness = features['brightness']
        contrast = features['contrast']
        symmetry = features['symmetry']

        # Brightness-based scoring
        if brightness > 150:
            scores['happy'] += 0.4
            scores['excited'] += 0.3
        elif brightness < 100:
            scores['sad'] += 0.4
            scores['tired'] += 0.2
        elif brightness < 120:
            scores['stressed'] += 0.3
            scores['focused'] += 0.2

        # Contrast-based scoring
        if contrast > 0.7:
            scores['excited'] += 0.3
            scores['focused'] += 0.2
        elif contrast < 0.4:
            scores['calm'] += 0.3
            scores['tired'] += 0.2

        # Symmetry-based scoring
        if symmetry > 0.8:
            scores['calm'] += 0.3
            scores['neutral'] += 0.2
        elif symmetry < 0.6:
            scores['stressed'] += 0.3
            scores['excited'] += 0.2

        # Regional analysis
        eye_brightness = features.get('eye_region', brightness)
        mouth_brightness = features.get('mouth_region', brightness)

        if eye_brightness > brightness + 15:
            scores['excited'] += 0.2
            scores['focused'] += 0.3
        elif eye_brightness < brightness - 10:
            scores['tired'] += 0.3

        if mouth_brightness > brightness + 20:
            scores['happy'] += 0.5
            scores['excited'] += 0.3
        elif mouth_brightness < brightness - 15:
            scores['sad'] += 0.4

        # Normalize scores
        total = sum(scores.values())
        if total > 0:
            for emotion in scores:
                scores[emotion] = scores[emotion] / total

        return scores

    def get_face_with_emotion(self, frame):
        """
        Return frame with face detection boxes and emotion labels
        Enhanced visualization using FER library approach
        """
        try:
            # Check for black screen first
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            avg_brightness = np.mean(gray)
            brightness_threshold = 20

            if avg_brightness < brightness_threshold:
                cv2.putText(frame, "CAMERA BLACK/OBSTRUCTED", (50, 50),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                return frame

            # Priority 1: Use FER library for visualization
            if self.fer_detector is not None:
                try:
                    # Detect faces using OpenCV
                    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
                    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

                    # For each face detected, perform emotion detection
                    for (x, y, w, h) in faces:
                        # Get the region of interest (ROI) for emotion detection
                        roi = frame[y:y + h, x:x + w]

                        # Ensure the ROI is valid before performing emotion detection
                        if roi is not None and roi.size > 0:
                            # Detect emotions on the face
                            emotions = self.fer_detector.top_emotion(roi)

                            # Draw a rectangle around the face
                            cv2.rectangle(frame, (x, y), (x + w, y + h), GREEN_COLOR, 2)

                            # Check if emotions are detected and score is not None
                            if emotions and emotions[1] is not None:
                                emotion, score = emotions
                                cv2.putText(frame, f"{emotion.upper()} ({score:.2f})", (x, y - 10),
                                           cv2.FONT_HERSHEY_SIMPLEX, 0.9, BLUE_COLOR, 2)
                            else:
                                # Handle case when no valid emotion is detected
                                cv2.putText(frame, "Emotion not detected", (x, y - 10),
                                           cv2.FONT_HERSHEY_SIMPLEX, 0.9, BLUE_COLOR, 2)
                        else:
                            cv2.putText(frame, "Invalid ROI", (x, y - 10),
                                       cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

                    if len(faces) == 0:
                        cv2.putText(frame, "No faces detected", (50, frame.shape[0] - 50),
                                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

                except Exception as e:
                    print(f"FER visualization error: {e}")
                    # Fall back to basic visualization
                    emotion, confidence = self._fallback_detection(gray)
                    faces = face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(50, 50))

                    for (x, y, w, h) in faces:
                        cv2.rectangle(frame, (x, y), (x+w, y+h), BLUE_COLOR, 2)
                        cv2.putText(frame, f"{emotion.upper()} ({confidence:.1f})",
                                  (x + 10, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, GREEN_COLOR, 2)

            else:
                # Fallback to basic visualization
                emotion, confidence = self._fallback_detection(gray)
                face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
                faces = face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(50, 50))

                for (x, y, w, h) in faces:
                    cv2.rectangle(frame, (x, y), (x+w, y+h), BLUE_COLOR, 2)
                    cv2.putText(frame, f"{emotion.upper()} ({confidence:.1f})",
                              (x + 10, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, GREEN_COLOR, 2)

            return frame

        except Exception as e:
            print(f"Error in face visualization: {str(e)}")
            return frame

# Utility functions for drawing
def draw_face_rectangle(bb: BoundingBox, img, color=BLUE_COLOR):
    cv2.rectangle(img, bb.origin, bb.bottom_left, color, 2)

def draw_landmark_points(points: np.ndarray, img, color=WHITE_COLOR):
    if points is None:
        return None
    for (x, y) in points:
        cv2.circle(img, (x, y), 1, color, -1)

def write_label(x: int, y: int, label: str, img, color=BLUE_COLOR):
    if label == NO_FACE_LABEL:
        cv2.putText(img, label.upper(), (int(FRAME_WIDTH / 2), int(FRAME_HEIGHT / 2)),
                   FONT, 1, color, 2, cv2.LINE_AA)
    cv2.putText(img, label, (x + 10, y - 10), FONT, 1, color, 2, cv2.LINE_AA)
