'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Settings,
  Save,
  Mail,
  Bell,
  MapPin,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Globe,
  Key,
  Smartphone
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * Admin Settings Page - NOW WITH LOCALSTORAGE INTEGRATION ✅
 * System configuration stored in browser localStorage
 */

const defaultSettings = {
  // General
  systemName: 'SnakeSOS',
  contactEmail: 'admin@snakesos.org',
  contactPhone: '9841234567',
  supportEmail: 'support@snakesos.org',
  
  // Notifications
  smsEnabled: true,
  emailEnabled: true,
  pushEnabled: true,
  smsProvider: 'Twilio',
  emailProvider: 'SendGrid',
  
  // Coverage
  defaultRadius: 5, // km
  maxAssignmentDistance: 15, // km
  autoAssignEnabled: true,
  priorityThreshold: 30, // minutes
  
  // Response Times
  targetResponseTime: 15, // minutes
  maxResponseTime: 30, // minutes
  
  // Integration
  smsApiKey: '••••••••••••',
  emailApiKey: '••••••••••••',
  mapboxToken: '••••••••••••',
  
  // Security
  sessionTimeout: 60, // minutes
  passwordMinLength: 8,
  requireTwoFactor: false,
  maxLoginAttempts: 5,
}

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'coverage' | 'integrations' | 'security'>('general')

  // Load settings from localStorage
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminSettings')
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) }
        } catch {
          return defaultSettings
        }
      }
    }
    return defaultSettings
  })

  // Save to localStorage whenever settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSettings', JSON.stringify(settings))
    }
  }, [settings])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaving(false)
    toast.success('Settings saved successfully!')
  }

  const tabs: Array<{ id: 'general' | 'notifications' | 'coverage' | 'integrations' | 'security'; label: string; icon: any }> = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'coverage', label: 'Coverage', icon: MapPin },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Settings className="h-8 w-8" />
            System Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure system-wide settings and preferences
          </p>
        </div>
        
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b dark:border-gray-700">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">System Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={settings.systemName}
                  onChange={(e) => setSettings({...settings, systemName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Time Targets
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="targetResponse">Target Response Time (minutes)</Label>
                <Input
                  id="targetResponse"
                  type="number"
                  value={settings.targetResponseTime}
                  onChange={(e) => setSettings({...settings, targetResponseTime: parseInt(e.target.value) || 0})}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Ideal time for rescuer to accept assignment
                </p>
              </div>
              <div>
                <Label htmlFor="maxResponse">Maximum Response Time (minutes)</Label>
                <Input
                  id="maxResponse"
                  type="number"
                  value={settings.maxResponseTime}
                  onChange={(e) => setSettings({...settings, maxResponseTime: parseInt(e.target.value) || 0})}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Triggers alerts if exceeded
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Channels
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send SMS alerts to rescuers and citizens
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsEnabled}
                    onChange={(e) => setSettings({...settings, smsEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send email updates and reports
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailEnabled}
                    onChange={(e) => setSettings({...settings, emailEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send in-app push notifications
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushEnabled}
                    onChange={(e) => setSettings({...settings, pushEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Notification Providers</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="smsProvider">SMS Provider</Label>
                <select
                  id="smsProvider"
                  value={settings.smsProvider}
                  onChange={(e) => setSettings({...settings, smsProvider: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Twilio">Twilio</option>
                  <option value="Sparrow">Sparrow SMS</option>
                  <option value="Custom">Custom Provider</option>
                </select>
              </div>
              <div>
                <Label htmlFor="emailProvider">Email Provider</Label>
                <select
                  id="emailProvider"
                  value={settings.emailProvider}
                  onChange={(e) => setSettings({...settings, emailProvider: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="SendGrid">SendGrid</option>
                  <option value="Mailgun">Mailgun</option>
                  <option value="AWS SES">AWS SES</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Coverage Settings */}
      {activeTab === 'coverage' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Coverage Configuration
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="defaultRadius">Default Search Radius (km)</Label>
                <Input
                  id="defaultRadius"
                  type="number"
                  value={settings.defaultRadius}
                  onChange={(e) => setSettings({...settings, defaultRadius: parseInt(e.target.value) || 0})}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Initial radius to search for available rescuers
                </p>
              </div>
              <div>
                <Label htmlFor="maxDistance">Maximum Assignment Distance (km)</Label>
                <Input
                  id="maxDistance"
                  type="number"
                  value={settings.maxAssignmentDistance}
                  onChange={(e) => setSettings({...settings, maxAssignmentDistance: parseInt(e.target.value) || 0})}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Maximum distance for assigning rescuers
                </p>
              </div>
              <div>
                <Label htmlFor="priorityThreshold">Priority Escalation (minutes)</Label>
                <Input
                  id="priorityThreshold"
                  type="number"
                  value={settings.priorityThreshold}
                  onChange={(e) => setSettings({...settings, priorityThreshold: parseInt(e.target.value) || 0})}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Time before request becomes high priority
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoAssignEnabled}
                    onChange={(e) => setSettings({...settings, autoAssignEnabled: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Enable Auto-Assignment</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically assign nearest available rescuer
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Coverage Zones</h2>
            <div className="space-y-3">
              {['Butwal', 'Bhairahawa', 'Pokhara', 'Kathmandu', 'Chitwan'].map((zone) => (
                <div key={zone} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{zone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Active</Badge>
                    <Button variant="ghost" size="sm">Configure</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Integration Settings */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys & Integrations
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="smsApi">SMS API Key</Label>
                <Input
                  id="smsApi"
                  type="password"
                  value={settings.smsApiKey}
                  onChange={(e) => setSettings({...settings, smsApiKey: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="emailApi">Email API Key</Label>
                <Input
                  id="emailApi"
                  type="password"
                  value={settings.emailApiKey}
                  onChange={(e) => setSettings({...settings, emailApiKey: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="mapboxToken">Mapbox Access Token</Label>
                <Input
                  id="mapboxToken"
                  type="password"
                  value={settings.mapboxToken}
                  onChange={(e) => setSettings({...settings, mapboxToken: e.target.value})}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>SMS Gateway</span>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Email Service</span>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span>Map Service</span>
                </div>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  Limited
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Access Control
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="passwordLength">Minimum Password Length</Label>
                <Input
                  id="passwordLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireTwoFactor}
                    onChange={(e) => setSettings({...settings, requireTwoFactor: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Require Two-Factor Auth</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For admin accounts
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Danger Zone
            </h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Reset All Settings to Default
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Clear All Cache and Logs
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Export Database Backup
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
