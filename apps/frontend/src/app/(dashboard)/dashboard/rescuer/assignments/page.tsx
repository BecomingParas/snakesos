'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  AlertTriangle,
  Navigation,
  Phone,
  Camera,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useMyAssignedRescuesQuery, useAcceptRescueMutation } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

/**
 * Rescuer Assignments Page
 * Shows all assigned rescues with Accept/Reject options
 */

// Mock data
const mockAssignments = [
  {
    id: 'rescue-1',
    referenceNumber: 'BR-2024-103',
    status: 'ASSIGNED',
    priority: 'HIGH',
    isEmergency: true,
    municipality: 'Butwal',
    ward: 12,
    address: 'Hospital Road, Near City Mall',
    landmark: 'Opposite Metro Bank',
    lat: 27.7,
    lng: 83.46,
    snakeDescription: 'Large dark brown snake, approximately 5 feet long. Coiled near the entrance. Family is scared.',
    snakeSize: 'LARGE',
    snakeColor: 'Dark Brown',
    snakeImages: [],
    distance: 1.8,
    citizenName: 'Rita Sharma',
    citizenPhone: '9841234567',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    assignedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'rescue-2',
    referenceNumber: 'BR-2024-104',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    isEmergency: false,
    municipality: 'Butwal',
    ward: 8,
    address: 'Main Chowk, Traffic Area',
    landmark: 'Near Police Station',
    lat: 27.71,
    lng: 83.47,
    snakeDescription: 'Small green snake in garden area. Non-aggressive.',
    snakeSize: 'SMALL',
    snakeColor: 'Green',
    snakeImages: [],
    distance: 3.2,
    citizenName: 'John Doe',
    citizenPhone: '9851234568',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    assignedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
]

const PRIORITY_CONFIG = {
  LOW: { color: 'bg-gray-500', label: 'Low' },
  MEDIUM: { color: 'bg-yellow-500', label: 'Medium' },
  HIGH: { color: 'bg-orange-500', label: 'High' },
  CRITICAL: { color: 'bg-red-600', label: 'Critical' },
}

export default function RescuerAssignmentsPage() {
  const router = useRouter()
  const [accepting, setAccepting] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)

  // Fetch assigned rescues from GraphQL
  const { data, loading, error, refetch } = useMyAssignedRescuesQuery({
    variables: {
      filter: { statuses: ['ASSIGNED'] }
    },
    pollInterval: 10000, // Real-time updates every 10 seconds
    fetchPolicy: 'cache-and-network',
  })

  // Accept rescue mutation
  const [acceptRescue] = useAcceptRescueMutation({
    onCompleted: () => {
      toast.success('Rescue accepted! Redirecting to active rescue...')
      refetch()
      setTimeout(() => router.push('/dashboard/rescuer/active'), 1000)
    },
    onError: (error) => {
      toast.error(`Failed to accept: ${error.message}`)
    }
  })

  // Extract assignments from GraphQL response
  const assignments = data?.myAssignedRescues?.edges?.map(e => e.node) || []
  
  // Use real data if available, otherwise fallback to mock
  const displayAssignments = assignments.length > 0 ? assignments : mockAssignments

  // Show error toast
  if (error) {
    toast.error(`Failed to load assignments: ${error.message}`)
  }

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading assignments...</p>
        </div>
      </div>
    )
  }

  const handleAccept = async (rescueId: string) => {
    setAccepting(rescueId)
    try {
      await acceptRescue({
        variables: {
          input: { rescueId }
        }
      })
    } catch (error) {
      console.error('Failed to accept rescue:', error)
    } finally {
      setAccepting(null)
    }
  }

  const handleReject = async (rescueId: string, reason?: string) => {
    setRejecting(rescueId)
    try {
      // TODO: Implement reject mutation if needed
      await new Promise(resolve => setTimeout(resolve, 500))
      // Refresh assignments
    } catch (error) {
      console.error('Failed to reject rescue:', error)
    } finally {
      setRejecting(null)
    }
  }

  const openNavigation = (lat: number, lng: number) => {
    // Open Google Maps or other navigation app
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-6xl">
        
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
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Assignments
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Rescue requests assigned to you
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({displayAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {displayAssignments.map((assignment) => {
              const priorityConfig = PRIORITY_CONFIG[assignment.priority as keyof typeof PRIORITY_CONFIG]
              
              return (
                <Card key={assignment.id} className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{assignment.referenceNumber}</h3>
                        <Badge className={cn('text-white', priorityConfig.color)}>
                          {priorityConfig.label} Priority
                        </Badge>
                        {assignment.isEmergency && (
                          <Badge className="bg-red-600 text-white">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Emergency
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{Math.round((Date.now() - new Date(assignment.createdAt).getTime()) / 60000)} min ago</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{assignment.distance} km away</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-4">
                      
                      {/* Location */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Location</h4>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                          <p className="font-medium">{assignment.address}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ward {assignment.ward}, {assignment.municipality}
                          </p>
                          {assignment.landmark && (
                            <p className="text-sm text-gray-500 mt-1">
                              Near: {assignment.landmark}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Snake Information */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Snake Information</h4>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                          <p className="mb-2">{assignment.snakeDescription}</p>
                          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Size: {assignment.snakeSize}</span>
                            <span>Color: {assignment.snakeColor}</span>
                          </div>
                          {assignment.snakeImages.length > 0 && (
                            <div className="mt-3 flex gap-2">
                              {assignment.snakeImages.map((img, idx) => (
                                <div
                                  key={idx}
                                  className="h-20 w-20 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                                >
                                  <Camera className="h-6 w-6 text-gray-400" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Citizen Contact */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Citizen Contact</h4>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                          <p className="font-medium">{assignment.citizenName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {assignment.citizenPhone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions Sidebar */}
                    <div className="space-y-4">
                      
                      {/* Accept/Reject */}
                      <Card className="p-4 border-2 border-green-200 dark:border-green-900">
                        <h4 className="font-semibold mb-3">Accept this rescue?</h4>
                        <div className="space-y-2">
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleAccept(assignment.id)}
                            disabled={accepting === assignment.id || rejecting === assignment.id}
                          >
                            {accepting === assignment.id ? (
                              <>Loading...</>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept Assignment
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleReject(assignment.id)}
                            disabled={accepting === assignment.id || rejecting === assignment.id}
                          >
                            {rejecting === assignment.id ? (
                              <>Loading...</>
                            ) : (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>

                      {/* Navigation */}
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3">Navigation</h4>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => openNavigation(assignment.lat, assignment.lng)}
                          >
                            <Navigation className="mr-2 h-4 w-4" />
                            Open in Maps
                          </Button>
                          <div className="text-xs text-center text-gray-500">
                            {assignment.distance} km away
                          </div>
                        </div>
                      </Card>

                      {/* Contact */}
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3">Contact</h4>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.location.href = `tel:${assignment.citizenPhone}`}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call Citizen
                        </Button>
                      </Card>

                      {/* Safety Warning */}
                      {assignment.isEmergency && (
                        <Card className="p-4 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-red-900 dark:text-red-100">
                                Emergency Case
                              </h4>
                              <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                                Exercise extra caution. This has been marked as an emergency.
                              </p>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}

            {displayAssignments.length === 0 && (
              <Card className="p-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No Pending Assignments</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You have no rescue assignments at the moment
                </p>
                <Button
                  className="mt-4"
                  onClick={() => router.push('/dashboard/rescuer')}
                >
                  Go to Dashboard
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="p-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">Assignment History</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                View your past assignments and completed rescues
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push('/dashboard/rescuer/history')}
              >
                View Full History
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
