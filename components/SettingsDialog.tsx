'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, User, Volume2, Clock, Palette, Shield, Music } from 'lucide-react'

interface UserSettings {
  // Audio Settings
  defaultVolume: number
  autoPlayEnabled: boolean
  sessionDuration: number

  // UI Settings
  theme: 'dark' | 'light' | 'auto'
  showNotifications: boolean
  compactMode: boolean

  // Privacy Settings
  analyticsEnabled: boolean
  emotionLoggingEnabled: boolean
  dataRetentionDays: number

  // Profile Settings
  displayName: string
  preferredGenres: string[]
  emotionSensitivity: 'low' | 'medium' | 'high'
}

interface SettingsDialogProps {
  settings: UserSettings
  onSettingsChange: (settings: UserSettings) => void
}

export default function SettingsDialog({ settings, onSettingsChange }: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings)
  const [isOpen, setIsOpen] = useState(false)

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
  }

  const saveSettings = () => {
    onSettingsChange(localSettings)
    setIsOpen(false)
  }

  const resetToDefaults = () => {
    const defaultSettings: UserSettings = {
      defaultVolume: 70,
      autoPlayEnabled: false,
      sessionDuration: 600, // 10 minutes

      theme: 'dark',
      showNotifications: true,
      compactMode: false,

      analyticsEnabled: true,
      emotionLoggingEnabled: true,
      dataRetentionDays: 30,

      displayName: 'Music User',
      preferredGenres: ['pop', 'electronic', 'ambient'],
      emotionSensitivity: 'medium'
    }
    setLocalSettings(defaultSettings)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-cyan-400 hover:text-cyan-300">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-white">
            <Settings className="h-5 w-5 text-cyan-400" />
            <span>Settings & Profile</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Audio Settings */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-cyan-400">
                <Volume2 className="h-4 w-4" />
                <span>Audio Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Default Volume</label>
                <div className="flex items-center space-x-3">
                  <Slider
                    value={[localSettings.defaultVolume]}
                    max={100}
                    step={5}
                    onValueChange={(value) => updateSetting('defaultVolume', value[0])}
                    className="flex-1"
                  />
                  <span className="text-sm text-slate-400 w-8">{localSettings.defaultVolume}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Auto-play Music</label>
                  <p className="text-xs text-slate-500">Automatically start music when session begins</p>
                </div>
                <Switch
                  checked={localSettings.autoPlayEnabled}
                  onCheckedChange={(checked) => updateSetting('autoPlayEnabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Session Duration (minutes)</label>
                <Select
                  value={String(localSettings.sessionDuration / 60)}
                  onValueChange={(value) => updateSetting('sessionDuration', parseInt(value) * 60)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* UI Settings */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-400">
                <Palette className="h-4 w-4" />
                <span>Interface Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Theme</label>
                <Select
                  value={localSettings.theme}
                  onValueChange={(value: 'dark' | 'light' | 'auto') => updateSetting('theme', value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Show Notifications</label>
                  <p className="text-xs text-slate-500">Display emotion detection notifications</p>
                </div>
                <Switch
                  checked={localSettings.showNotifications}
                  onCheckedChange={(checked) => updateSetting('showNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Compact Mode</label>
                  <p className="text-xs text-slate-500">Use smaller interface elements</p>
                </div>
                <Switch
                  checked={localSettings.compactMode}
                  onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-400">
                <Shield className="h-4 w-4" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Analytics</label>
                  <p className="text-xs text-slate-500">Help improve the app with usage data</p>
                </div>
                <Switch
                  checked={localSettings.analyticsEnabled}
                  onCheckedChange={(checked) => updateSetting('analyticsEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-300">Emotion Logging</label>
                  <p className="text-xs text-slate-500">Save emotion data for mood tracking</p>
                </div>
                <Switch
                  checked={localSettings.emotionLoggingEnabled}
                  onCheckedChange={(checked) => updateSetting('emotionLoggingEnabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Data Retention (days)</label>
                <Select
                  value={String(localSettings.dataRetentionDays)}
                  onValueChange={(value) => updateSetting('dataRetentionDays', parseInt(value))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-400">
                <User className="h-4 w-4" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Display Name</label>
                <input
                  type="text"
                  value={localSettings.displayName}
                  onChange={(e) => updateSetting('displayName', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-cyan-400 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Preferred Genres</label>
                <div className="flex flex-wrap gap-2">
                  {['pop', 'rock', 'electronic', 'jazz', 'classical', 'ambient', 'hip-hop', 'country'].map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        const currentGenres = localSettings.preferredGenres
                        const newGenres = currentGenres.includes(genre)
                          ? currentGenres.filter(g => g !== genre)
                          : [...currentGenres, genre]
                        updateSetting('preferredGenres', newGenres)
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        localSettings.preferredGenres.includes(genre)
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Emotion Sensitivity</label>
                <Select
                  value={localSettings.emotionSensitivity}
                  onValueChange={(value: 'low' | 'medium' | 'high') => updateSetting('emotionSensitivity', value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Less sensitive)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Very sensitive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Reset to Defaults
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
