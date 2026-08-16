'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Shield, Bell, Loader2 } from 'lucide-react'
import { useMyProfileQuery, useUpdateUserProfileMutation } from '@/lib/graphql/hooks/user.hooks'
import { toast } from 'sonner'

/**
 * Citizen Profile Page
 * User profile settings and preferences - NOW WITH GRAPHQL INTEGRATION ✅
 */

export default function CitizenProfilePage() {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })

  // Fetch user profile
  const { data, loading: loadingProfile, error, refetch } = useMyProfileQuery({
    fetchPolicy: 'cache-and-network',
  })

  const user = data?.me

  // Update profile mutation
  const [updateProfile, { loading: updating }] = useUpdateUserProfileMutation({
    onCompleted: () => {
      toast.success('Profile updated successfully!')
      setEditing(false)
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`)
    },
  })

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    await updateProfile({
      variables: {
        input: {
          name: formData.name,
          phone: formData.phone || undefined,
        },
      },
    })
  }

  if (error) {
    toast.error(`Failed to load profile: ${error.message}`)
  }

  const isLoading = loadingProfile || updating

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {loadingProfile && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      )}

      {!loadingProfile && user && (
        <>
          {/* Profile Information */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Update your personal details
                </p>
              </div>
              <Button 
                variant={editing ? 'default' : 'outline'}
                onClick={() => {
                  if (editing) {
                    handleSave()
                  } else {
                    setEditing(true)
                  }
                }}
                disabled={isLoading}
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  disabled={!editing}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    disabled={!editing}
                    className="pl-10"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="pl-10 bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>

            {editing && (
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      name: user.name || '',
                      phone: user.phone || '',
                    })
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Card>

          {/* User Info Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              Account Information
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">User Role:</span>
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account Status:</span>
                <span className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email Verified:</span>
                <span className={`font-medium ${user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.isEmailVerified ? 'Yes' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Member Since:</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Notification Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive rescue updates via email
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive rescue updates via SMS
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rescue Status Updates</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified when rescue status changes
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5" />
          Security
        </h2>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  )
}
