import random

class MusicRecommender:
    def __init__(self):
        """Initialize music recommender with enhanced emotion-music mapping"""

        # Enhanced emotion-to-music mapping with specific characteristics
        self.emotion_music_mapping = {
            'happy': {
                'primary_genres': ['Pop', 'Dance', 'Upbeat Rock'],
                'secondary_genres': ['Funk', 'Disco', 'Reggae'],
                'tempo_range': '120-180 BPM',
                'energy_level': 'high',
                'mood_characteristics': ['joyful', 'celebratory', 'uplifting', 'energetic'],
                'instruments': ['guitar', 'drums', 'bass', 'synth', 'brass'],
                'recommended_for': ['social activities', 'exercise', 'celebrations', 'motivation']
            },

            'excited': {
                'primary_genres': ['Electronic Dance', 'Pop Rock', 'Hip Hop'],
                'secondary_genres': ['Synthwave', 'R&B', 'Indie Rock'],
                'tempo_range': '130-200 BPM',
                'energy_level': 'very_high',
                'mood_characteristics': ['enthusiastic', 'adventurous', 'dynamic', 'intense'],
                'instruments': ['electronic synth', 'heavy drums', 'electric guitar', 'bass drops'],
                'recommended_for': ['high energy tasks', 'creative work', 'social events', 'motivation']
            },

            'sad': {
                'primary_genres': ['Acoustic', 'Soft Rock', 'Indie'],
                'secondary_genres': ['Blues', 'Folk', 'Alternative'],
                'tempo_range': '60-100 BPM',
                'energy_level': 'low',
                'mood_characteristics': ['melancholic', 'introspective', 'emotional', 'reflective'],
                'instruments': ['acoustic guitar', 'piano', 'strings', 'soft percussion'],
                'recommended_for': ['emotional processing', 'reflection', 'comfort', 'healing']
            },

            'stressed': {
                'primary_genres': ['Ambient', 'Classical', 'Lo-fi'],
                'secondary_genres': ['Jazz', 'New Age', 'Bossa Nova'],
                'tempo_range': '50-90 BPM',
                'energy_level': 'very_low',
                'mood_characteristics': ['calming', 'soothing', 'meditative', 'peaceful'],
                'instruments': ['piano', 'strings', 'nature sounds', 'soft synth', 'wind instruments'],
                'recommended_for': ['stress relief', 'concentration', 'relaxation', 'meditation']
            },

            'neutral': {
                'primary_genres': ['Instrumental', 'Jazz', 'Classical'],
                'secondary_genres': ['Electronic', 'Ambient', 'World Music'],
                'tempo_range': '70-120 BPM',
                'energy_level': 'medium',
                'mood_characteristics': ['balanced', 'focused', 'versatile', 'professional'],
                'instruments': ['piano', 'jazz instruments', 'orchestral', 'electronic', 'acoustic'],
                'recommended_for': ['work', 'study', 'background music', 'concentration']
            },

            'calm': {
                'primary_genres': ['New Age', 'Meditation', 'Nature Sounds'],
                'secondary_genres': ['World Music', 'Classical Piano', 'Ambient'],
                'tempo_range': '40-70 BPM',
                'energy_level': 'very_low',
                'mood_characteristics': ['peaceful', 'serene', 'tranquil', 'healing'],
                'instruments': ['piano', 'nature sounds', 'soft strings', 'flute', 'harp'],
                'recommended_for': ['meditation', 'sleep', 'healing', 'deep relaxation']
            },

            'focused': {
                'primary_genres': ['Classical', 'Instrumental', 'Baroque'],
                'secondary_genres': ['Lo-fi', 'Concentration Music', 'Minimalist'],
                'tempo_range': '60-100 BPM',
                'energy_level': 'medium',
                'mood_characteristics': ['concentrated', 'structured', 'analytical', 'disciplined'],
                'instruments': ['classical instruments', 'piano', 'orchestral', 'minimal electronic'],
                'recommended_for': ['deep work', 'studying', 'analytical tasks', 'concentration']
            },

            'tired': {
                'primary_genres': ['Ambient', 'Sleep Music', 'Soft Jazz'],
                'secondary_genres': ['Binaural', 'Nature Sounds', 'Classical'],
                'tempo_range': '30-60 BPM',
                'energy_level': 'very_low',
                'mood_characteristics': ['sleepy', 'dreamy', 'gentle', 'lulling'],
                'instruments': ['soft piano', 'ambient textures', 'nature sounds', 'gentle strings'],
                'recommended_for': ['sleep', 'rest', 'recovery', 'gentle relaxation']
            }
        }

        # Music database organized by emotion/mood - ENHANCED WITH MORE VARIETY
        self.music_database = {
            'happy': {
                'genres': ['Pop', 'Dance', 'Electronic', 'Upbeat Rock', 'Reggae', 'Funk', 'Disco'],
                'tracks': [
                    # Original tracks
                    "Happy - Pharrell Williams",
                    "Can't Stop the Feeling - Justin Timberlake",
                    "Good as Hell - Lizzo",
                    "Uptown Funk - Bruno Mars",
                    "Walking on Sunshine - Katrina & The Waves",
                    "I Gotta Feeling - Black Eyed Peas",
                    "Dancing Queen - ABBA",
                    "Mr. Blue Sky - ELO",
                    "Good Vibrations - The Beach Boys",
                    "Celebration - Kool & The Gang",
                    # New diverse tracks
                    "Don't Stop Believin' - Journey",
                    "Livin' on a Prayer - Bon Jovi",
                    "Billie Jean - Michael Jackson",
                    "September - Earth, Wind & Fire",
                    "Superstition - Stevie Wonder",
                    "Shut Up and Dance - Walk the Moon",
                    "Sugar - Maroon 5",
                    "24K Magic - Bruno Mars",
                    "Shake It Off - Taylor Swift",
                    "Happy Together - The Turtles",
                    "I'm Gonna Be (500 Miles) - The Proclaimers",
                    "Hey Ya! - OutKast",
                    "Uprising - Muse",
                    "Don't Stop Me Now - Queen",
                    "We Will Rock You - Queen"
                ],
                'characteristics': 'Energetic, Fast beats, Major keys, Uplifting lyrics, Danceable rhythms'
            },

            'sad': {
                'genres': ['Acoustic', 'Soft Rock', 'Indie', 'Classical', 'Blues', 'Folk'],
                'tracks': [
                    # Original tracks
                    "Someone Like You - Adele",
                    "Mad World - Gary Jules",
                    "Hurt - Johnny Cash",
                    "Black - Pearl Jam",
                    "Tears in Heaven - Eric Clapton",
                    "The Sound of Silence - Simon & Garfunkel",
                    "Everybody Hurts - R.E.M.",
                    "Breathe Me - Sia",
                    "Skinny Love - Bon Iver",
                    "Hallelujah - Jeff Buckley",
                    # New diverse tracks
                    "Yesterday - The Beatles",
                    "House of the Rising Sun - The Animals",
                    "Nothing Compares 2 U - Sinead O'Connor",
                    "Tears Dry on Their Own - Amy Winehouse",
                    "Creep - Radiohead",
                    "The Night We Met - Lord Huron",
                    "Fix You - Coldplay",
                    "Someone You Loved - Lewis Capaldi",
                    "When I Was Your Man - Bruno Mars",
                    "Let It Be - The Beatles",
                    "Blackbird - The Beatles",
                    "The Times They Are A-Changin' - Bob Dylan",
                    "American Pie - Don McLean",
                    "Imagine - John Lennon",
                    "Strange Fruit - Billie Holiday"
                ],
                'characteristics': 'Slow tempo, Minor keys, Emotional vocals, Reflective lyrics, Melancholic melodies'
            },

            'stressed': {
                'genres': ['Lo-fi', 'Ambient', 'Chill', 'Classical', 'Nature Sounds', 'Jazz', 'Bossa Nova'],
                'tracks': [
                    # Original tracks
                    "Weightless - Marconi Union",
                    "Clair de Lune - Debussy",
                    "Aqueous Transmission - Incubus",
                    "Porcelain - Moby",
                    "Teardrop - Massive Attack",
                    "River - Joni Mitchell",
                    "Mad Rush - Philip Glass",
                    "Spiegel im Spiegel - Arvo Pärt",
                    "Gymnopédie No.1 - Erik Satie",
                    "Ambient 1 - Brian Eno",
                    # New diverse tracks
                    "The Köln Concert - Keith Jarrett",
                    "In a Silent Way - Miles Davis",
                    "Kind of Blue - Miles Davis",
                    "Moon Safari - Air",
                    "Music Has the Right to Children - Boards of Canada",
                    "Selected Ambient Works - Aphex Twin",
                    "Discreet Music - Brian Eno",
                    "The Disintegration Loops - William Basinski",
                    "Music for Airports - Brian Eno",
                    "Lofi Girl - Chillhop Radio",
                    "Jazzhop - Nujabes",
                    "Wave - Antonio Carlos Jobim",
                    "Corcovado - Stan Getz & João Gilberto",
                    "Saudade - João Gilberto",
                    "Meditative Mind - Chinmaya Dunster"
                ],
                'characteristics': 'Calming, Slow rhythm, Minimal lyrics, Stress-reducing, Meditative qualities'
            },

            'neutral': {
                'genres': ['Instrumental', 'Focus Music', 'Ambient', 'Classical', 'Jazz', 'Electronic'],
                'tracks': [
                    # Original tracks
                    "Ludovico Einaudi - Nuvole Bianche",
                    "Max Richter - On The Nature of Daylight",
                    "Ólafur Arnalds - Near Light",
                    "Nils Frahm - Says",
                    "GoGo Penguin - Hopopono",
                    "Kiasmos - Blurred EP",
                    "Emancipator - Soon It Will Be Cold Enough",
                    "Bonobo - Kong",
                    "Tycho - A Walk",
                    "Boards of Canada - Roygbiv",
                    # New diverse tracks
                    "The Piano Guys - Beethoven's 5 Secrets",
                    "River Flows in You - Yiruma",
                    "Comptine d'un autre été - Yann Tiersen",
                    "Now We Are Free - Hans Zimmer & Lisa Gerrard",
                    "Time - Hans Zimmer",
                    "The Breaking of the Fellowship - Howard Shore",
                    "My Name is Lincoln - Steve Jablonsky",
                    "Light of the Seven - Ramin Djawadi",
                    "Hurt - Johnny Cash (Instrumental)",
                    "Blackbird - Paul McCartney",
                    "Black Coffee - Peggy Lee",
                    "What a Wonderful World - Louis Armstrong",
                    "Feeling Good - Nina Simone",
                    "At Last - Etta James",
                    "Summertime - Ella Fitzgerald"
                ],
                'characteristics': 'Balanced tempo, Instrumental focus, Concentration-friendly, Versatile moods'
            },

            'excited': {
                'genres': ['Electronic Dance', 'Pop Rock', 'Hip Hop', 'R&B', 'Synthwave'],
                'tracks': [
                    "Levels - Avicii",
                    "Wake Me Up - Avicii",
                    "Animals - Martin Garrix",
                    "Tsunami - DVBBS & Borgeous",
                    "Boneless - Steve Aoki, Chris Lake & Tujamo",
                    "Turn Down for What - DJ Snake & Lil Jon",
                    "Lean On - Major Lazer & DJ Snake",
                    "This Girl - Kungs vs Cookin' on 3 Burners",
                    "Seve - Tez Cadey",
                    "Fast Car - Jonas Blue ft. Dakota",
                    "Riptide - Vance Joy",
                    "Ho Hey - The Lumineers",
                    "Home - Phillip Phillips",
                    "Pompeii - Bastille",
                    "Take Me to Church - Hozier",
                    "Royals - Lorde",
                    "Radioactive - Imagine Dragons",
                    "Demons - Imagine Dragons",
                    "Centuries - Fall Out Boy",
                    "The Phoenix - Fall Out Boy"
                ],
                'characteristics': 'High energy, Fast tempo, Motivational, Danceable, Uplifting'
            },

            'calm': {
                'genres': ['New Age', 'World Music', 'Acoustic', 'Nature Sounds', 'Meditation'],
                'tracks': [
                    "Weightless - Marconi Union",
                    "The Water Garden - Oliver Serano-Alve",
                    "Butterfly - Michael Olatuja",
                    "Weightless Part 1 - Marconi Union",
                    "Weightless Part 2 - Marconi Union",
                    "Weightless Part 3 - Marconi Union",
                    "Weightless Part 4 - Marconi Union",
                    "Música Callada - Federico Mompou",
                    "The Heart Asks Pleasure First - Michael Nyman",
                    "Adagio for Strings - Samuel Barber",
                    "Gabriel's Oboe - Ennio Morricone",
                    "The Eternal Vow - Yanni",
                    "Within You - William Joseph",
                    "River Flows in You - Yiruma",
                    "Kiss the Rain - Yiruma",
                    "May Be - Yiruma",
                    "Love Hurts - Yiruma",
                    "Wait There - Yiruma",
                    "Do You? - Yiruma",
                    "Sky - Yiruma"
                ],
                'characteristics': 'Peaceful, Slow tempo, Meditative, Relaxing, Nature-inspired'
            },

            'focused': {
                'genres': ['Classical', 'Instrumental', 'Lo-fi', 'Concentration Music', 'Baroque'],
                'tracks': [
                    "The Well-Tempered Clavier - J.S. Bach",
                    "Goldberg Variations - J.S. Bach",
                    "Piano Sonata No. 14 (Moonlight) - Beethoven",
                    "Für Elise - Beethoven",
                    "Nocturnes - Chopin",
                    "Études - Chopin",
                    "The Seasons - Tchaikovsky",
                    "Symphony No. 9 - Beethoven",
                    "Brandenburg Concertos - Bach",
                    "Concerto for Two Violins - Bach",
                    "Violin Concerto - Beethoven",
                    "Piano Concerto No. 21 - Mozart",
                    "Symphony No. 40 - Mozart",
                    "The Nutcracker Suite - Tchaikovsky",
                    "Swan Lake - Tchaikovsky",
                    "Carmen Suite - Bizet",
                    "Boléro - Ravel",
                    "Clair de Lune - Debussy",
                    "Gymnopédie - Satie",
                    "Gnossienne - Satie"
                ],
                'characteristics': 'Instrumental, Complex compositions, Concentration-enhancing, Classical structure'
            },

            'tired': {
                'genres': ['Ambient', 'Sleep Music', 'Nature Sounds', 'Soft Jazz', 'Binaural'],
                'tracks': [
                    "Sleep - Eric Whitacre",
                    "The Night - Ludovico Einaudi",
                    "I Giorni - Ludovico Einaudi",
                    "Divenire - Ludovico Einaudi",
                    "Strombre - Ludovico Einaudi",
                    "Waterways - Ludovico Einaudi",
                    "Elegy for the Arctic - Ludovico Einaudi",
                    "Night - Ludovico Einaudi",
                    "Brothers - Ludovico Einaudi",
                    "Experience - Ludovico Einaudi",
                    "Whispers - Ludovico Einaudi",
                    "Burning - Ludovico Einaudi",
                    "Circle Song - Ludovico Einaudi",
                    "Glimpse - Ludovico Einaudi",
                    "Monday - Ludovico Einaudi",
                    "Dancer - Ludovico Einaudi",
                    "Walk - Ludovico Einaudi",
                    "A Sense of Symmetry - Ludovico Einaudi",
                    "Underwood - Ludovico Einaudi",
                    "Reverie - Ludovico Einaudi"
                ],
                'characteristics': 'Soft, Gentle, Sleep-inducing, Ambient textures, Slow pacing'
            }
        }

        # Backup recommendations if specific emotion not found
        self.default_recommendations = [
            "Lofi Hip Hop Radio - 24/7 Study Beats",
            "Nature Sounds - Forest Rain",
            "Classical Focus - Bach & Mozart",
            "Ambient Chill - Peaceful Vibes"
        ]
    
    def get_recommendations(self, emotion, count=5):
        """
        Get precise music recommendations based on detected emotion using advanced mapping
        Enhanced with emotion-specific characteristics and context-aware selection

        Args:
            emotion (str): Detected emotion (happy, sad, stressed, neutral, excited, calm, focused, tired)
            count (int): Number of recommendations to return

        Returns:
            dict: Enhanced music recommendations with detailed metadata
        """

        emotion = emotion.lower().strip()

        # Get emotion-specific music characteristics
        emotion_mapping = self.emotion_music_mapping.get(emotion, {})

        if emotion in self.music_database and emotion_mapping:
            emotion_data = self.music_database[emotion]

            # Advanced track selection based on emotion characteristics
            selected_tracks = self._select_precise_tracks(emotion, emotion_mapping, count)

            return {
                'emotion': emotion,
                'tracks': selected_tracks,
                'genres': emotion_data['genres'],
                'characteristics': emotion_data['characteristics'],
                'music_profile': {
                    'tempo_range': emotion_mapping.get('tempo_range', 'Unknown'),
                    'energy_level': emotion_mapping.get('energy_level', 'medium'),
                    'primary_genres': emotion_mapping.get('primary_genres', []),
                    'secondary_genres': emotion_mapping.get('secondary_genres', []),
                    'mood_characteristics': emotion_mapping.get('mood_characteristics', []),
                    'instruments': emotion_mapping.get('instruments', []),
                    'recommended_for': emotion_mapping.get('recommended_for', [])
                },
                'recommendation_reason': self._get_enhanced_recommendation_reason(emotion, emotion_mapping)
            }

        else:
            # Fallback for unknown emotions
            return {
                'emotion': 'unknown',
                'tracks': random.sample(self.default_recommendations, min(count, len(self.default_recommendations))),
                'genres': ['General'],
                'characteristics': 'General mood music for various activities',
                'music_profile': {
                    'tempo_range': '70-120 BPM',
                    'energy_level': 'medium',
                    'primary_genres': ['General'],
                    'secondary_genres': [],
                    'mood_characteristics': ['versatile', 'balanced'],
                    'instruments': ['various'],
                    'recommended_for': ['general activities']
                },
                'recommendation_reason': 'General music selection for balanced mood support'
            }

    def _select_precise_tracks(self, emotion, emotion_mapping, count):
        """
        Select tracks that best match the emotion's specific characteristics
        Uses advanced filtering based on genre preferences, mood alignment, and context
        """

        emotion_data = self.music_database[emotion]
        all_tracks = emotion_data['tracks']

        # Get preferred genres for this emotion
        primary_genres = emotion_mapping.get('primary_genres', [])
        secondary_genres = emotion_mapping.get('secondary_genres', [])

        # Score tracks based on how well they match the emotion profile
        track_scores = []

        for track in all_tracks:
            score = self._calculate_track_score(track, emotion, emotion_mapping)
            track_scores.append((track, score))

        # Sort by score (highest first) and select top tracks
        track_scores.sort(key=lambda x: x[1], reverse=True)

        # Ensure we have enough tracks, if not, fill with random selection
        selected_tracks = [track for track, score in track_scores[:count]]

        # If we don't have enough high-scoring tracks, add more from the full list
        if len(selected_tracks) < count:
            remaining_tracks = [track for track in all_tracks if track not in selected_tracks]
            additional_tracks = random.sample(remaining_tracks, min(count - len(selected_tracks), len(remaining_tracks)))
            selected_tracks.extend(additional_tracks)

        return selected_tracks

    def _calculate_track_score(self, track, emotion, emotion_mapping):
        """
        Calculate how well a track matches the emotion's characteristics
        Higher scores = better match for the emotion
        """

        score = 0.0
        track_lower = track.lower()

        # Genre matching (40% weight)
        primary_genres = emotion_mapping.get('primary_genres', [])
        secondary_genres = emotion_mapping.get('secondary_genres', [])

        for genre in primary_genres:
            if genre.lower() in track_lower:
                score += 0.4

        for genre in secondary_genres:
            if genre.lower() in track_lower:
                score += 0.2

        # Artist/Track name analysis (30% weight)
        # Certain artists are strongly associated with specific emotions
        emotion_artist_keywords = {
            'happy': ['pharell', 'mars', 'abba', 'journey', 'jackson', 'timberlake'],
            'sad': ['adele', 'cash', 'clapton', 'radiohead', 'coldplay', 'beatles'],
            'stressed': ['einaudi', 'glass', 'satie', 'enigma', 'eno', 'union'],
            'excited': ['avicii', 'garrix', 'dragons', 'mars', 'jovi'],
            'calm': ['yiruma', 'einaudi', 'morricone', 'yanni', 'barber'],
            'focused': ['bach', 'beethoven', 'mozart', 'chopin', 'tchaikovsky'],
            'tired': ['whitacre', 'einaudi', 'whisper']
        }

        emotion_keywords = emotion_artist_keywords.get(emotion, [])
        for keyword in emotion_keywords:
            if keyword in track_lower:
                score += 0.3

        # Mood characteristic matching (20% weight)
        mood_keywords = emotion_mapping.get('mood_characteristics', [])
        for keyword in mood_keywords:
            if keyword in track_lower:
                score += 0.2

        # Instrument matching (10% weight)
        instrument_keywords = emotion_mapping.get('instruments', [])
        for instrument in instrument_keywords:
            if instrument in track_lower:
                score += 0.1

        return score

    def _get_enhanced_recommendation_reason(self, emotion, emotion_mapping):
        """Get detailed explanation for why these songs were recommended"""

        tempo = emotion_mapping.get('tempo_range', 'Unknown')
        energy = emotion_mapping.get('energy_level', 'medium')
        primary_genres = emotion_mapping.get('primary_genres', [])
        mood_chars = emotion_mapping.get('mood_characteristics', [])
        recommended_for = emotion_mapping.get('recommended_for', [])

        reasons = {
            'happy': f"Selected upbeat tracks with {tempo} tempo and {energy} energy to match your joyful mood. Perfect for {', '.join(recommended_for[:2])}.",
            'excited': f"High-energy selections with {tempo} rhythm featuring {', '.join(primary_genres[:2])} styles to fuel your enthusiastic state.",
            'sad': f"Gentle, emotional tracks with {tempo} pacing using {', '.join(primary_genres[:2])} elements for reflective comfort.",
            'stressed': f"Calming selections with {tempo} tempo and {energy} energy using {', '.join(primary_genres[:2])} for stress reduction.",
            'neutral': f"Balanced instrumental tracks with {tempo} rhythm providing {', '.join(mood_chars[:2])} atmosphere for focused work.",
            'calm': f"Peaceful compositions with {tempo} pacing featuring {', '.join(primary_genres[:2])} for deep relaxation and meditation.",
            'focused': f"Structured instrumental pieces with {tempo} rhythm using {', '.join(primary_genres[:2])} to enhance concentration.",
            'tired': f"Gentle ambient tracks with {tempo} pacing using {', '.join(primary_genres[:2])} for restful recovery."
        }

        return reasons.get(emotion, f"Carefully selected tracks matching your {emotion} emotional state with appropriate musical characteristics.")
    
    def get_mood_playlist(self, emotion, duration_minutes=30):
        """
        Create a full playlist for a specific mood/study session
        
        Args:
            emotion (str): Target emotion
            duration_minutes (int): Desired playlist length
            
        Returns:
            dict: Complete playlist with timing
        """
        
        # Estimate songs needed (average 3.5 minutes per song)
        songs_needed = max(8, int(duration_minutes / 3.5))
        
        recommendations = self.get_recommendations(emotion, songs_needed)
        
        return {
            'playlist_name': f"{emotion.title()} Study Session",
            'duration_minutes': duration_minutes,
            'total_tracks': len(recommendations['tracks']),
            'tracks': recommendations['tracks'],
            'mood_description': recommendations['characteristics'],
            'study_benefits': self._get_study_benefits(emotion)
        }
    
    def _get_study_benefits(self, emotion):
        """Get study-specific benefits for each emotion type"""
        
        benefits = {
            'happy': [
                "Increased creativity and problem-solving",
                "Better memory retention",
                "Enhanced motivation for challenging tasks"
            ],
            'sad': [
                "Improved focus through emotional processing",
                "Better analytical thinking",
                "Increased attention to detail"
            ],
            'stressed': [
                "Reduced cortisol levels",
                "Improved concentration",
                "Better information processing"
            ],
            'neutral': [
                "Optimal focus state",
                "Balanced cognitive performance",
                "Sustained attention span"
            ]
        }
        
        return benefits.get(emotion, ["General mood improvement", "Enhanced focus"])
    
    def get_emotion_transition_playlist(self, current_emotion, target_emotion):
        """
        Create a playlist to transition from current emotion to target emotion
        Useful for mood regulation
        """
        
        transition_map = {
            ('stressed', 'neutral'): ['stressed', 'neutral'],
            ('sad', 'neutral'): ['sad', 'neutral'], 
            ('sad', 'happy'): ['sad', 'neutral', 'happy'],
            ('stressed', 'happy'): ['stressed', 'neutral', 'happy']
        }
        
        transition_key = (current_emotion, target_emotion)
        
        if transition_key in transition_map:
            emotions_sequence = transition_map[transition_key]
            playlist = []
            
            for emotion in emotions_sequence:
                tracks = self.get_recommendations(emotion, 3)['tracks']
                playlist.extend(tracks)
            
            return {
                'transition': f"{current_emotion} → {target_emotion}",
                'playlist': playlist,
                'description': f"Gradual transition from {current_emotion} to {target_emotion} mood"
            }
        
        else:
            # Direct transition
            return self.get_recommendations(target_emotion, 8)
