'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Phone,
  CheckCircle,
  Camera,
  Upload,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  useMyAssignedRescuesQuery,
  useUpdateRescueProgressMutation,
  useCompleteRescueMutation,
} from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

/**
 * Active Rescue Management Page
 * Allows rescuer to:
 * - Update rescue status (En Route, Arrived, In Progress)
 * - Complete rescue with report
 * - Upload photos
 * - Contact citizen
 */

// Mock data
const mockActiveRescue = {
  id: 'rescue-active-1',
  referenceNumber: 'BR-2024-102',
  status: 'ACCEPTED', // ACCEPTED, IN_PROGRESS, COMPLETED
  priority: 'HIGH',
  municipality: 'Butwal',
  ward: 12,
  address: 'Traffic Chowk, Main Road',
  landmark: 'Near City Mall',
  lat: 27.7,
  lng: 83.46,
  snakeDescription: 'Large brown snake, approximately 4 feet long',
  snakeSize: 'LARGE',
  snakeColor: 'Brown',
  citizenName: 'Rita Sharma',
  citizenPhone: '9841234567',
  acceptedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  arrivedAt: null,
  startedAt: null,
}

const OUTCOME_OPTIONS = [
  { value: 'RESCUED_RELOCATED', label: 'Snake Rescued & Relocated', description: 'Successfully captured and relocated to safe habitat' },
  { value: 'ALREADY_GONE', label: 'Snake Already Gone', description: 'Snake had left before arrival' },
  { value: 'FALSE_ALARM', label: 'False Alarm', description: 'Not a dangerous situation' },
  { value: 'NO_SNAKE_FOUND', label: 'Snake Not Found', description: 'Could not locate the snake' },
  { value: 'DECEASED', label: 'Snake Deceased', description: 'Snake was found dead' },
]

export default function ActiveRescuePage() {
  const router = useRouter()
  const [showCompleteForm, setShowCompleteForm] = useState(false)
  
  // Completion form state
  const [outcome, setOutcome] = useState('')
  const [rescueReport, setRescueReport] = useState('')
  const [rescueImages, setRescueImages] = useState<string[]>([])

  // Fetch active rescue
  const { data, loading, refetch } = useMyAssignedRescuesQuery({
    variables: {
      filter: { statuses: ['ACCEPTED', 'IN_PROGRESS', 'ARRIVED'] }
    },
    pollInterval: 10000,
    fetchPolicy: 'cache-and-network',
  })

  // Update progress mutation
  const [updateProgress, { loading: updating }] = useUpdateRescueProgressMutation({
    onCompleted: () => {
      toast.success('Status updated!')
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`)
    }
  })

  // Complete rescue mutation
  const [completeRescue, { loading: submitting }] = useCompleteRescueMutation({
    onCompleted: () => {
      toast.success('Rescue completed successfully!')
      router.push('/dashboard/rescuer?completed=true')
    },
    onError: (error) => {
      toast.error(`Failed to complete: ${error.message}`)
    }
  })

  // Extract active rescue
  const activeRescue = data?.myAssignedRescues?.edges?.[0]?.node
  
  // Redirect if no active rescue
  useEffect(() => {
    if (!loading && !activeRescue) {
      toast.error('No active rescue found')
      router.push('/dashboard/rescuer')
    }
  }, [loading, activeRescue, router])

  const handleStatusUpdate = async (newStatus: string, notes?: string) => {
    if (!activeRescue) return

    try {
      await updateProgress({
        variables: {
          input: {
            rescueId: activeRescue.id,
            status: newStatus,
            notes,
          }
        }
      })
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleCompleteRescue = async () => {
    if (!outcome || !rescueReport) {
      toast.error('Please select outcome and provide rescue report')
      return
    }

    if (!activeRescue) return

    try {
      await completeRescue({
        variables: {
          input: {
            rescueId: activeRescue.id,
            outcome,
            rescueReport,
            rescueImages: rescueImages.length > 0 ? rescueImages : undefined,
          }
        }
      })
    } catch (error) {
      console.error('Failed to complete rescue:', error)
    }
  }

  const openNavigation = () => {
    if (!activeRescue?.lat || !activeRescue?.lng) return
    const url = `https://www.google.com/maps/dir/?api=1&destination=${activeRescue.lat},${activeRescue.lng}`
    window.open(url, '_blank')
  }

  // Loading state
  if (loading || !activeRescue) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading active rescue...</p>
        </div>
      </div>
    )
  }

  const canMarkEnRoute = activeRescue.status === 'ACCEPTED'
  const canMarkArrived = activeRescue.status === 'ACCEPTED' || (activeRescue.status === 'IN_PROGRESS' && !activeRescue.arrivedAt)
  const canMarkStarted = activeRescue.arrivedAt && activeRescue.status === 'IN_PROGRESS' && !activeRescue.startedAt
  const canComplete = activeRescue.status === 'IN_PROGRESS'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Active Rescue
              </h1>
              <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
                {activeRescue.referenceNumber}
              </p>
            </div>
            <Badge className="bg-green-500 text-white">
              {activeRescue.status === 'ACCEPTED' ? 'Accepted' : activeRescue.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Update Actions */}
            {!showCompleteForm && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Update Status</h2>
                
                <div className="space-y-3">
                  {canMarkEnRoute && (
                    <Button
                      className="w-full h-auto flex-col items-start gap-1 p-4"
                      onClick={() => handleStatusUpdate('IN_PROGRESS', 'En route to location')}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <div className="flex items-center gap-2 w-full">
                            <Navigation className="h-5 w-5" />
                            <span className="font-semibold">Mark En Route</span>
                          </div>
                          <span className="text-xs opacity-80 text-left">
                            Let the citizen know you're on your way
                          </span>
                        </>
                      )}
                    </Button>
                  )}

                  {canMarkArrived && (
                    <Button
                      className="w-full h-auto flex-col items-start gap-1 p-4"
                      onClick={() => handleStatusUpdate('IN_PROGRESS', 'Arrived at location')}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <div className="flex items-center gap-2 w-full">
                            <MapPin className="h-5 w-5" />
                            <span className="font-semibold">Mark Arrived</span>
                          </div>
                          <span className="text-xs opacity-80 text-left">
                            Confirm you've reached the rescue location
                          </span>
                        </>
                      )}
                    </Button>
                  )}

                  {canMarkStarted && (
                    <Button
                      className="w-full h-auto flex-col items-start gap-1 p-4"
                      onClick={() => handleStatusUpdate('IN_PROGRESS', 'Starting rescue operation')}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <div className="flex items-center gap-2 w-full">
                            <Clock className="h-5 w-5" />
                            <span className="font-semibold">Start Rescue</span>
                          </div>
                          <span className="text-xs opacity-80 text-left">
                            Begin the rescue operation
                          </span>
                        </>
                      )}
                    </Button>
                  )}

                  {canComplete && (
                    <Button
                      className="w-full h-auto flex-col items-start gap-1 p-4 bg-green-600 hover:bg-green-700"
                      onClick={() => setShowCompleteForm(true)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Complete Rescue</span>
                      </div>
                      <span className="text-xs opacity-80 text-left">
                        Mark this rescue as completed
                      </span>
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* Complete Rescue Form */}
            {showCompleteForm && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Complete Rescue</h2>
                
                <div className="space-y-6">
                  {/* Outcome Selection */}
                  <div>
                    <Label className="text-base">Rescue Outcome *</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select what happened during the rescue
                    </p>
                    <div className="space-y-2">
                      {OUTCOME_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          className={cn(
                            'flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800',
                            outcome === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 dark:border-gray-700'
                          )}
                        >
                          <input
                            type="radio"
                            name="outcome"
                            value={option.value}
                            checked={outcome === option.value}
                            onChange={(e) => setOutcome(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <span className="font-semibold">{option.label}</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {option.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rescue Report */}
                  <div>
                    <Label htmlFor="report" className="text-base">Rescue Report *</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Describe what happened and any important details
                    </p>
                    <Textarea
                      id="report"
                      value={rescueReport}
                      onChange={(e) => setRescueReport(e.target.value)}
                      placeholder="Describe the rescue operation, snake behavior, safety measures taken, and any other relevant details..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <Label className="text-base">Rescue Photos (Optional)</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Upload photos of the snake or rescue operation
                    </p>
                    <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 dark:border-gray-700">
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowCompleteForm(false)}
                      disabled={submitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCompleteRescue}
                      disabled={!outcome || !rescueReport || submitting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Submit & Complete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Rescue Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Rescue Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1">{activeRescue.address}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ward {activeRescue.ward}, {activeRescue.municipality}
                  </p>
                  {activeRescue.landmark && (
                    <p className="text-sm text-gray-500 mt-1">Near: {activeRescue.landmark}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Snake Description</p>
                  <p className="mt-1">{activeRescue.snakeDescription || 'No description available'}</p>
                  {(activeRescue.snakeSize || activeRescue.snakeColor) && (
                    <div className="mt-2 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {activeRescue.snakeSize && <span>Size: {activeRescue.snakeSize}</span>}
                      {activeRescue.snakeColor && <span>Color: {activeRescue.snakeColor}</span>}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Timeline</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      Accepted: {new Date(activeRescue.acceptedAt || activeRescue.assignedAt || activeRescue.createdAt).toLocaleTimeString()}
                    </p>
                    {activeRescue.arrivedAt && (
                      <p className="text-gray-600 dark:text-gray-400">
                        Arrived: {new Date(activeRescue.arrivedAt).toLocaleTimeString()}
                      </p>
                    )}
                    {activeRescue.startedAt && (
                      <p className="text-gray-600 dark:text-gray-400">
                        Started: {new Date(activeRescue.startedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Navigation */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <Button
                className="w-full"
                onClick={openNavigation}
                disabled={!activeRescue.lat || !activeRescue.lng}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Open in Maps
              </Button>
            </Card>

            {/* Citizen Contact */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Citizen Contact</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{activeRescue.user?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{activeRescue.user?.phone || 'N/A'}</p>
                </div>
                {activeRescue.user?.phone && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = `tel:${activeRescue.user?.phone}`}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Citizen
                  </Button>
                )}
              </div>
            </Card>

            {/* Safety Tips */}
            <Card className="p-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Safety Reminder
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Always wear protective gear</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Never approach venomous snakes without equipment</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Keep citizen at safe distance</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Call emergency support if needed</span>
                </li>
              </ul>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100">
                Emergency Support
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                Need immediate help?
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Phone className="mr-2 h-4 w-4" />
                Call Emergency: 102
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
