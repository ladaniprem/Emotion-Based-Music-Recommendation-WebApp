import random
from datetime import datetime, time

class SubjectSuggester:
    def __init__(self):
        """Initialize subject suggester for engineering students"""
        
        # Engineering subjects organized by difficulty and cognitive load
        self.subjects_database = {
            'happy': {
                'primary_subjects': [
                    "Advanced Programming Projects",
                    "Machine Learning Implementation", 
                    "System Design Challenges",
                    "Algorithm Optimization",
                    "New Technology Exploration",
                    "Creative Problem Solving",
                    "Innovation Projects",
                    "Competitive Programming"
                ],
                'secondary_subjects': [
                    "Database Design",
                    "Web Development",
                    "Mobile App Development",
                    "Game Development"
                ],
                'reasoning': "High energy and positive mood - perfect for tackling challenging new concepts!"
            },
            
            'sad': {
                'primary_subjects': [
                    "Mathematics Review",
                    "Theory Revision", 
                    "Reading Technical Documentation",
                    "Concept Clarification",
                    "Previous Assignments Review",
                    "Formula Practice",
                    "Gentle Programming Practice",
                    "Study Notes Organization"
                ],
                'secondary_subjects': [
                    "Engineering Ethics",
                    "History of Technology",
                    "Technical Writing",
                    "Research Paper Reading"
                ],
                'reasoning': "Low energy state - focus on review and consolidation rather than new learning."
            },
            
            'stressed': {
                'primary_subjects': [
                    "Basic Mathematics Practice",
                    "Simple Programming Exercises", 
                    "Familiar Topic Revision",
                    "Easy Problem Sets",
                    "Flashcard Review",
                    "Light Reading",
                    "Concept Mapping",
                    "Organized Note-taking"
                ],
                'secondary_subjects': [
                    "Engineering Drawing",
                    "Basic Circuit Analysis",
                    "Simple Physics Problems",
                    "Vocabulary Building"
                ],
                'reasoning': "High stress - stick to familiar, low-pressure topics to build confidence."
            },
            
            'neutral': {
                'primary_subjects': [
                    "Regular Coursework",
                    "Assignment Completion",
                    "Steady Problem Solving",
                    "Balanced Study Session",
                    "Project Development",
                    "Lab Report Writing",
                    "Exam Preparation",
                    "Homework Tasks"
                ],
                'secondary_subjects': [
                    "Data Structures",
                    "Operating Systems",
                    "Computer Networks",
                    "Software Engineering"
                ],
                'reasoning': "Balanced mood - ideal for regular study routine and steady progress."
            }
        }
        
        # Time-based subject recommendations
        self.time_based_subjects = {
            'morning': ['Complex Problem Solving', 'New Concept Learning', 'Mathematics'],
            'afternoon': ['Programming Practice', 'Project Work', 'Lab Sessions'],
            'evening': ['Review Sessions', 'Light Reading', 'Assignment Completion'],
            'night': ['Revision', 'Note Organization', 'Theory Reading']
        }
        
        # Engineering branches specific subjects
        self.branch_subjects = {
            'computer_science': [
                'Data Structures & Algorithms', 'Database Management', 'Computer Networks',
                'Operating Systems', 'Software Engineering', 'Machine Learning',
                'Web Development', 'Mobile Computing', 'Cybersecurity'
            ],
            'electronics': [
                'Digital Electronics', 'Analog Circuits', 'Signal Processing',
                'Microprocessors', 'VLSI Design', 'Communication Systems',
                'Control Systems', 'Embedded Systems'
            ],
            'mechanical': [
                'Thermodynamics', 'Fluid Mechanics', 'Machine Design',
                'Manufacturing Processes', 'CAD/CAM', 'Robotics',
                'Automotive Engineering', 'Materials Science'
            ],
            'civil': [
                'Structural Analysis', 'Concrete Technology', 'Surveying',
                'Transportation Engineering', 'Environmental Engineering',
                'Geotechnical Engineering', 'Construction Management'
            ]
        }
    
    def get_suggestion(self, emotion, branch='computer_science', current_time=None):
        """
        Get subject suggestion based on emotion and other factors
        
        Args:
            emotion (str): Current detected emotion
            branch (str): Engineering branch
            current_time (datetime): Current time for time-based suggestions
            
        Returns:
            dict: Subject suggestion with reasoning
        """
        
        emotion = emotion.lower().strip()
        
        if current_time is None:
            current_time = datetime.now()
        
        # Get emotion-based suggestions
        if emotion in self.subjects_database:
            emotion_data = self.subjects_database[emotion]
            
            # Select primary subject
            primary_subject = random.choice(emotion_data['primary_subjects'])
            
            # Select secondary subjects
            secondary_subjects = random.sample(
                emotion_data['secondary_subjects'], 
                min(2, len(emotion_data['secondary_subjects']))
            )
            
            # Get time-based recommendation
            time_period = self._get_time_period(current_time)
            time_subjects = self.time_based_subjects.get(time_period, [])
            
            # Get branch-specific subjects
            branch_subjects = self.branch_subjects.get(branch, [])
            
            return {
                'primary_recommendation': primary_subject,
                'secondary_options': secondary_subjects,
                'emotion': emotion,
                'reasoning': emotion_data['reasoning'],
                'time_based_suggestion': random.choice(time_subjects) if time_subjects else None,
                'branch_specific': random.sample(branch_subjects, min(3, len(branch_subjects))),
                'study_duration': self._get_recommended_duration(emotion),
                'study_tips': self._get_study_tips(emotion),
                'break_frequency': self._get_break_frequency(emotion)
            }
        
        else:
            # Fallback for unknown emotions
            return {
                'primary_recommendation': "Regular Coursework",
                'secondary_options': ["Assignment Completion", "Review Session"],
                'emotion': 'unknown',
                'reasoning': "Balanced approach for unknown emotional state",
                'study_duration': "45-60 minutes",
                'study_tips': ["Take regular breaks", "Stay hydrated"],
                'break_frequency': "Every 45 minutes"
            }
    
    def _get_time_period(self, current_time):
        """Determine time period based on current time"""
        
        hour = current_time.hour
        
        if 6 <= hour < 12:
            return 'morning'
        elif 12 <= hour < 17:
            return 'afternoon'
        elif 17 <= hour < 21:
            return 'evening'
        else:
            return 'night'
    
    def _get_recommended_duration(self, emotion):
        """Get recommended study duration based on emotion"""
        
        durations = {
            'happy': "60-90 minutes (high focus capacity)",
            'sad': "30-45 minutes (shorter sessions work better)",
            'stressed': "20-30 minutes (avoid overwhelming)",
            'neutral': "45-60 minutes (standard session length)"
        }
        
        return durations.get(emotion, "45-60 minutes")
    
    def _get_study_tips(self, emotion):
        """Get emotion-specific study tips"""
        
        tips = {
            'happy': [
                "Take advantage of high energy - tackle difficult topics",
                "Use active learning methods like teaching others",
                "Try creative problem-solving approaches",
                "Set ambitious but achievable goals"
            ],
            'sad': [
                "Be gentle with yourself - progress is still progress",
                "Use familiar study methods that feel comfortable",
                "Focus on review rather than new material",
                "Consider studying with a friend for support"
            ],
            'stressed': [
                "Start with easy topics to build confidence",
                "Use relaxation techniques before studying",
                "Break tasks into very small, manageable chunks",
                "Avoid time pressure - focus on understanding"
            ],
            'neutral': [
                "Maintain steady, consistent pace",
                "Use proven study techniques",
                "Balance different types of learning activities",
                "Set clear, measurable goals"
            ]
        }
        
        return tips.get(emotion, ["Stay focused", "Take regular breaks"])
    
    def _get_break_frequency(self, emotion):
        """Get recommended break frequency based on emotional state"""
        
        frequencies = {
            'happy': "Every 60-90 minutes (can sustain longer focus)",
            'sad': "Every 30-45 minutes (frequent breaks help mood)",
            'stressed': "Every 20-25 minutes (prevent overwhelm)",
            'neutral': "Every 45-60 minutes (standard Pomodoro technique)"
        }
        
        return frequencies.get(emotion, "Every 45 minutes")
    
    def get_weekly_study_plan(self, dominant_emotion, branch='computer_science'):
        """
        Generate a weekly study plan based on the most common emotion
        """
        
        if dominant_emotion in self.subjects_database:
            emotion_data = self.subjects_database[dominant_emotion]
            branch_subjects = self.branch_subjects.get(branch, [])
            
            # Create 7-day plan
            weekly_plan = {}
            
            for day in range(1, 8):
                day_name = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day-1]
                
                # Alternate between primary and secondary subjects
                if day % 2 == 1:
                    subject = random.choice(emotion_data['primary_subjects'])
                else:
                    subject = random.choice(emotion_data['secondary_subjects'])
                
                # Add branch-specific subject
                branch_subject = random.choice(branch_subjects) if branch_subjects else "General Engineering"
                
                weekly_plan[day_name] = {
                    'main_subject': subject,
                    'branch_subject': branch_subject,
                    'duration': self._get_recommended_duration(dominant_emotion),
                    'focus_area': self._get_focus_area(dominant_emotion, day)
                }
            
            return {
                'week_plan': weekly_plan,
                'dominant_emotion': dominant_emotion,
                'general_advice': emotion_data['reasoning'],
                'success_tips': self._get_study_tips(dominant_emotion)
            }
    
    def _get_focus_area(self, emotion, day):
        """Get focus area for each day based on emotion and day of week"""
        
        focus_areas = {
            'happy': ['New Learning', 'Creative Projects', 'Problem Solving', 'Innovation'],
            'sad': ['Review', 'Consolidation', 'Theory', 'Reading'],
            'stressed': ['Basics', 'Familiar Topics', 'Easy Practice', 'Organization'],
            'neutral': ['Regular Study', 'Assignments', 'Balanced Learning', 'Progress']
        }
        
        areas = focus_areas.get(emotion, ['General Study'])
        return areas[day % len(areas)]
