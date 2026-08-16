'use client'

import { useState } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Circle,
  AlertCircle,
  XCircle,
  MessageCircle,
  Navigation,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useRescueRequestQuery, useCancelRescueMutation } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

/**
 * Rescue Request Tracking Page
 * Shows complete status of a rescue request with:
 * - Visual timeline
 * - Rescuer information (when assigned)
 * - Real-time status updates
 * - Map (when active)
 * - Actions (cancel, contact)
 */

interface PageProps {
  params: Promise<{ id: string }>
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-500',
    icon: Clock,
    description: 'Your request is being reviewed',
  },
  ASSIGNED: {
    label: 'Assigned',
    color: 'bg-blue-500',
    icon: User,
    description: 'A rescuer has been assigned',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-green-500',
    icon: CheckCircle,
    description: 'Rescuer is on the way',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'bg-purple-500',
    icon: Navigation,
    description: 'Rescue operation underway',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-600',
    icon: CheckCircle,
    description: 'Rescue completed successfully',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-500',
    icon: XCircle,
    description: 'Request was cancelled',
  },
}

export default function RequestTrackingPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()

  // Fetch rescue request with real-time polling
  const { data, loading, error, refetch } = useRescueRequestQuery({
    variables: { id },
    pollInterval: 5000, // Poll every 5 seconds for real-time updates
    fetchPolicy: 'cache-and-network',
  })

  // Cancel mutation
  const [cancelRescue, { loading: cancelling }] = useCancelRescueMutation({
    onCompleted: () => {
      toast.success('Rescue request cancelled')
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to cancel: ${error.message}`)
    }
  })

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading rescue details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-center mb-2">Error Loading Rescue</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
          <Button onClick={() => router.back()} className="w-full">
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const rescue = data?.rescueRequest

  if (!rescue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-center mb-2">Rescue Not Found</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            The rescue request you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => router.push('/dashboard/citizen')} className="w-full">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  // TODO: Replace mockRescue with rescue from GraphQL
  // For now, we'll use the GraphQL data
  const statusConfig = STATUS_CONFIG[rescue.status as keyof typeof STATUS_CONFIG]
  const StatusIcon = statusConfig.icon

  const canCancel = ['PENDING', 'ASSIGNED'].includes(rescue.status)

  const timelineSteps = [
    {
      status: 'REQUESTED',
      label: 'Request Submitted',
      completed: true,
      timestamp: rescue.createdAt,
    },
    {
      status: 'ASSIGNED',
      label: 'Rescuer Assigned',
      completed: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(rescue.status),
      timestamp: rescue.assignedAt,
      detail: rescue.assignedVolunteer?.name,
    },
    {
      status: 'ACCEPTED',
      label: 'On The Way',
      completed: ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(rescue.status),
      timestamp: rescue.acceptedAt,
      active: rescue.status === 'ACCEPTED',
    },
    {
      status: 'IN_PROGRESS',
      label: 'Rescue Started',
      completed: ['IN_PROGRESS', 'COMPLETED'].includes(rescue.status),
      timestamp: rescue.startedAt,
      active: rescue.status === 'IN_PROGRESS',
    },
    {
      status: 'COMPLETED',
      label: 'Completed',
      completed: rescue.status === 'COMPLETED',
      timestamp: rescue.completedAt,
    },
  ]

  const handleCancel = async () => {
    await cancelRescue({
      variables: {
        rescueId: id,
        reason: 'Cancelled by citizen'
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/citizen')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Rescue Request
              </h1>
              <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
                {rescue.referenceNumber}
              </p>
            </div>
            
            <Badge className={cn('text-white', statusConfig.color)}>
              <StatusIcon className="mr-1 h-4 w-4" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Card */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn('p-3 rounded-full', statusConfig.color, 'text-white')}>
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{statusConfig.label}</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {statusConfig.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Rescue Progress</h3>
              
              <div className="space-y-6">
                {timelineSteps.map((step, index) => (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                          step.completed
                            ? 'bg-green-500 text-white'
                            : step.active
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-500 dark:bg-gray-700'
                        )}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div
                          className={cn(
                            'w-0.5 h-12 transition-colors',
                            step.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                          )}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-4">
                      <p className="font-semibold">{step.label}</p>
                      {step.detail && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{step.detail}</p>
                      )}
                      {step.timestamp && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(step.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Snake Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Snake Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1">{rescue.snakeDescription}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Size</p>
                    <p className="mt-1">{rescue.snakeSize}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Color</p>
                    <p className="mt-1">{rescue.snakeColor}</p>
                  </div>
                </div>

                {rescue.snakeImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Photos</p>
                    <div className="flex gap-2">
                      {rescue.snakeImages.map((img, idx) => (
                        <div key={idx} className="h-20 w-20 rounded bg-gray-200" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p>{rescue.address}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ward {rescue.ward}, {rescue.municipality}
                    </p>
                    {rescue.landmark && (
                      <p className="text-sm text-gray-500">Near: {rescue.landmark}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-4 h-48 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <p className="text-gray-500">Map View</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Rescuer Card */}
            {rescue.assignedVolunteer && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Rescuer</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{rescue.assignedVolunteer.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {rescue.assignedVolunteer.experience} Rescuer
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-medium">{rescue.assignedVolunteer.totalRescues} rescues</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating</span>
                      <span className="font-medium">⭐ {rescue.assignedVolunteer.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" variant="default">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Rescuer
                    </Button>
                    <Button className="w-full" variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              
              <div className="space-y-2">
                {canCancel && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancel}
                    disabled={cancelling}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {cancelling ? 'Cancelling...' : 'Cancel Request'}
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100">
                Emergency?
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                If this is a medical emergency, call immediately
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
