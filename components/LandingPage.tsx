'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Music, Heart, Sparkles } from 'lucide-react'

interface LandingPageProps {
  onStart: () => void
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex justify-center items-center space-x-2 mb-8">
            <Music className="h-12 w-12 text-purple-400" />
            <Heart className="h-8 w-8 text-pink-400" />
            <Sparkles className="h-10 w-10 text-blue-400" />
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Emotion Music
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience personalized music recommendations powered by AI emotion detection. 
            Let your webcam read your mood and discover the perfect soundtrack for every moment.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Camera className="h-8 w-8 text-purple-400 mx-auto" />
              <CardTitle className="text-lg">Real-time Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced AI analyzes your facial expressions through your webcam to detect emotions in real-time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Music className="h-8 w-8 text-pink-400 mx-auto" />
              <CardTitle className="text-lg">Smart Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get music suggestions perfectly matched to your current emotional state and preferences.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Sparkles className="h-8 w-8 text-blue-400 mx-auto" />
              <CardTitle className="text-lg">Mood Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Visualize your emotional journey with beautiful charts and session summaries.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start?</CardTitle>
              <CardDescription className="text-slate-300">
                We'll need access to your webcam to detect emotions and provide personalized music recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={onStart}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Camera className="mr-2 h-5 w-5" />
                Allow Webcam & Start
              </Button>
            </CardContent>
          </Card>

          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Your privacy is important to us. All emotion detection happens locally in your browser. 
            No video data is stored or transmitted to our servers.
          </p>
        </div>
      </div>
    </div>
  )
}
