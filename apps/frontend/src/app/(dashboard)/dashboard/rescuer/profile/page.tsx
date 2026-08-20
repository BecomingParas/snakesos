'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, MapPin, Shield, Award, Star, Clock, Loader2, Save, Edit } from 'lucide-react'
import { useMyVolunteerProfileQuery, useUpdateVolunteerProfileMutation } from '@/lib/graphql/hooks/volunteer.hooks'
import { useMyProfileQuery } from '@/lib/graphql/hooks/user.hooks'
import { toast } from 'sonner'

/**
 * Rescuer Profile Page - NOW WITH GRAPHQL INTEGRATION ✅
 */

export default function RescuerProfilePage() {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    experience: '',
    experienceYears: 0,
    municipality: '',
    ward: 0,
    specialization: '',
    isAvailableNow: true,
  })

  // Fetch user profile
  const { data: userData, loading: loadingUser } = useMyProfileQuery({
    fetchPolicy: 'cache-and-network',
  })

  // Fetch volunteer profile
  const { data: volunteerData, loading: loadingVolunteer, error, refetch } = useMyVolunteerProfileQuery({
    fetchPolicy: 'cache-and-network',
  })

  const user = userData?.me
  const profile = volunteerData?.myVolunteerProfile

  // Update profile mutation
  const [updateProfile, { loading: updating }] = useUpdateVolunteerProfileMutation({
    onCompleted: () => {
      toast.success('Profile updated successfully!')
      setEditing(false)
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`)
    },
  })

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        experience: profile.experience || '',
        experienceYears: profile.experienceYears || 0,
        municipality: profile.municipality || '',
        ward: profile.ward || 0,
        specialization: '',
        isAvailableNow: profile.isAvailableNow,
      })
    }
  }, [profile])

  const handleSave = async () => {
    if (!formData.experience || !formData.municipality) {
      toast.error('Experience level and municipality are required')
      return
    }

    await updateProfile({
      variables: {
        input: {
          experience: formData.experience,
          experienceYears: formData.experienceYears || undefined,
          municipality: formData.municipality,
          ward: formData.ward || undefined,
          isAvailableNow: formData.isAvailableNow,
        },
      },
    })
  }

  // Calculate stats
  const stats = useMemo(() => {
    if (!profile) return null
    return {
      totalRescues: profile.totalRescues || 0,
      successRate: profile.successRate || 0,
      rating: profile.rating || 0,
      completedRescues: profile.completedRescues || 0,
    }
  }, [profile])

  if (error) {
    toast.error(`Failed to load profile: ${error.message}`)
  }

  const isLoading = loadingUser || loadingVolunteer || updating

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Rescuer Profile
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your professional profile and statistics
        </p>
      </div>

      {(loadingUser || loadingVolunteer) && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      )}

      {!loadingUser && !loadingVolunteer && user && profile && (
        <>
          {/* Stats Overview */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalRescues}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Rescues</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.rating.toFixed(1)}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedRescues}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Profile Information */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your basic profile details
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={user.name}
                  disabled
                  className="bg-gray-50 dark:bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={user.phone || 'Not set'}
                    disabled
                    className="pl-10 bg-gray-50 dark:bg-gray-900"
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
                  Contact details are managed in user settings
                </p>
              </div>
            </div>
          </Card>

          {/* Professional Details */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Professional Details
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your rescue experience and skills
                </p>
              </div>
              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <select
                  id="experience"
                  value={formData.experience}
                  disabled={!editing}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <Label htmlFor="years">Years of Experience</Label>
                <Input
                  id="years"
                  type="number"
                  value={formData.experienceYears}
                  disabled={!editing}
                  onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  disabled={!editing}
                  placeholder="e.g., Venomous snake handling, rescue in urban areas"
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                />
              </div>
            </div>

            {editing && (
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false)
                    if (profile) {
                      setFormData({
                        experience: profile.experience || '',
                        experienceYears: profile.experienceYears || 0,
                        municipality: profile.municipality || '',
                        ward: profile.ward || 0,
                        specialization: '',
                        isAvailableNow: profile.isAvailableNow,
                      })
                    }
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Card>

          {/* Coverage Area */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              Coverage Area
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="municipality">Municipality</Label>
                <Input
                  id="municipality"
                  value={formData.municipality}
                  disabled={!editing}
                  onChange={(e) => setFormData({...formData, municipality: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="ward">Ward Number</Label>
                <Input
                  id="ward"
                  type="number"
                  value={formData.ward || ''}
                  disabled={!editing}
                  onChange={(e) => setFormData({...formData, ward: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </Card>

          {/* Availability Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              Availability Status
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Currently Available</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toggle to show you're available for rescue assignments
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.isAvailableNow}
                disabled={!editing}
                onChange={(e) => setFormData({...formData, isAvailableNow: e.target.checked})}
                className="h-5 w-5"
              />
            </div>
          </Card>

          {/* Verification Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              Verification & Status
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Verification Status:</span>
                <Badge className={
                  (profile as any).verificationStatus === 'VERIFIED' ? 'bg-green-500' :
                  (profile as any).verificationStatus === 'PENDING' ? 'bg-yellow-500' :
                  'bg-red-500'
                }>
                  {(profile as any).verificationStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Member Since:</span>
                <span className="font-medium">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          {stats && stats.totalRescues > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Award className="h-5 w-5" />
                Achievements & Badges
              </h2>

              <div className="flex flex-wrap gap-3">
                {stats.totalRescues >= 100 && (
                  <Badge className="bg-purple-500 text-white px-3 py-1.5">
                    🎯 100+ Rescues
                  </Badge>
                )}
                {stats.rating >= 4.5 && (
                  <Badge className="bg-yellow-500 text-white px-3 py-1.5">
                    ⭐ Top Rated
                  </Badge>
                )}
                {stats.successRate >= 95 && (
                  <Badge className="bg-green-500 text-white px-3 py-1.5">
                    ✓ High Success Rate
                  </Badge>
                )}
                {(profile as any).verificationStatus === 'VERIFIED' && (
                  <Badge className="bg-blue-500 text-white px-3 py-1.5">
                    ✓ Verified Rescuer
                  </Badge>
                )}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
