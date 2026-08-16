'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MapPin, 
  Camera, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { useCreateRescueRequestMutation } from '@/lib/graphql/hooks/rescue.hooks'
import { toast } from 'sonner'

/**
 * Multi-Step Rescue Request Form
 * 
 * Step 1: Request Type
 * Step 2: Location
 * Step 3: Snake Information
 * Step 4: Review & Submit
 */

type RequestType = 
  | 'SNAKE_INSIDE' 
  | 'SNAKE_OUTSIDE' 
  | 'INJURED_SNAKE' 
  | 'SNAKEBITE' 
  | 'OTHER'

interface FormData {
  // Step 1
  requestType: RequestType | null
  
  // Step 2
  municipality: string
  ward: string
  address: string
  landmark: string
  lat: number | null
  lng: number | null
  locationMethod: 'GPS' | 'MANUAL' | null
  
  // Step 3
  snakeDescription: string
  snakeSize: string
  snakeColor: string
  snakeImages: string[]
  isEmergency: boolean
  hasBite: boolean
  
  // Contact (pre-filled from user profile)
  name: string
  phone: string
  email: string
}

const REQUEST_TYPES = [
  {
    value: 'SNAKE_INSIDE',
    label: 'Snake Inside Property',
    description: 'Snake found inside house, room, or building',
    icon: '🏠',
  },
  {
    value: 'SNAKE_OUTSIDE',
    label: 'Snake Outside Property',
    description: 'Snake in garden, yard, or outdoor area',
    icon: '🌳',
  },
  {
    value: 'INJURED_SNAKE',
    label: 'Injured Snake',
    description: 'Snake appears injured or in distress',
    icon: '🩹',
  },
  {
    value: 'SNAKEBITE',
    label: 'Snakebite Emergency',
    description: 'Someone has been bitten by a snake',
    icon: '🚨',
  },
  {
    value: 'OTHER',
    label: 'Other Emergency',
    description: 'Other snake-related emergency',
    icon: '⚠️',
  },
]

export default function RequestRescuePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // GraphQL mutation
  const [createRescue, { loading: submitting }] = useCreateRescueRequestMutation({
    onCompleted: (data) => {
      toast.success('Rescue request submitted successfully!')
      router.push(`/dashboard/citizen/requests/${data.createRescueRequest.id}`)
    },
    onError: (error) => {
      setError(error.message)
      toast.error('Failed to submit rescue request')
    }
  })

  const [formData, setFormData] = useState<FormData>({
    requestType: null,
    municipality: 'Butwal',
    ward: '',
    address: '',
    landmark: '',
    lat: null,
    lng: null,
    locationMethod: null,
    snakeDescription: '',
    snakeSize: 'MEDIUM',
    snakeColor: '',
    snakeImages: [],
    isEmergency: false,
    hasBite: false,
    name: '', // TODO: Pre-fill from user context
    phone: '',
    email: '',
  })

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const canProceed = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return formData.requestType !== null
      case 2:
        return !!(
          formData.municipality &&
          formData.address &&
          (formData.lat !== null || formData.locationMethod === 'MANUAL')
        )
      case 3:
        return formData.snakeDescription.length > 0
      default:
        return true
    }
  }

  const handleGetLocation = () => {
    setError(null)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateFormData({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            locationMethod: 'GPS',
          })
        },
        (error) => {
          setError('Unable to get your location. Please enter manually.')
          console.error('Geolocation error:', error)
        }
      )
    } else {
      setError('Geolocation not supported by your browser')
    }
  }

  const handleSubmit = async () => {
    setError(null)

    try {
      await createRescue({
        variables: {
          input: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || undefined,
            municipality: formData.municipality,
            ward: formData.ward ? parseInt(formData.ward) : undefined,
            address: formData.address,
            landmark: formData.landmark || undefined,
            lat: formData.lat || undefined,
            lng: formData.lng || undefined,
            snakeDescription: formData.snakeDescription || undefined,
            snakeSize: formData.snakeSize || undefined,
            snakeColor: formData.snakeColor || undefined,
            snakeImages: formData.snakeImages.length > 0 ? formData.snakeImages : undefined,
            isEmergency: formData.isEmergency,
            hasBite: formData.hasBite,
          }
        }
      })
      // Navigation handled in onCompleted callback
    } catch (err: any) {
      // Error handled in onError callback
      console.error('Failed to submit rescue request:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => step > 1 ? setStep(step - 1) : router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Request Snake Rescue
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Tell us about the snake and we'll send a rescuer to help
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    i === step
                      ? 'bg-primary text-white'
                      : i < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700'
                  )}
                >
                  {i < step ? <CheckCircle className="h-5 w-5" /> : i}
                </div>
                {i < 4 && (
                  <div
                    className={cn(
                      'h-1 w-16 transition-colors sm:w-24',
                      i < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Type</span>
            <span>Location</span>
            <span>Details</span>
            <span>Review</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        {/* Step Content */}
        <Card className="p-6">
          {/* Step 1: Request Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">What type of rescue do you need?</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select the option that best describes your situation
                </p>
              </div>

              <RadioGroup
                value={formData.requestType || ''}
                onValueChange={(value) => updateFormData({ requestType: value as RequestType })}
                className="space-y-3"
              >
                {REQUEST_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={cn(
                      'flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800',
                      formData.requestType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-700'
                    )}
                  >
                    <RadioGroupItem value={type.value} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{type.icon}</span>
                        <span className="font-semibold">{type.label}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Where is the snake?</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Provide the location so rescuers can find you
                </p>
              </div>

              <div className="space-y-4">
                {/* GPS Location Button */}
                <Button
                  type="button"
                  variant={formData.locationMethod === 'GPS' ? 'default' : 'outline'}
                  onClick={handleGetLocation}
                  className="w-full"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {formData.lat && formData.lng
                    ? `Location Captured (${formData.lat.toFixed(5)}, ${formData.lng.toFixed(5)})`
                    : 'Use My Current Location'}
                </Button>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="municipality">Municipality *</Label>
                    <Input
                      id="municipality"
                      value={formData.municipality}
                      onChange={(e) => updateFormData({ municipality: e.target.value })}
                      placeholder="Butwal"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ward">Ward Number</Label>
                    <Input
                      id="ward"
                      value={formData.ward}
                      onChange={(e) => updateFormData({ ward: e.target.value })}
                      placeholder="1"
                      type="number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData({ address: e.target.value })}
                    placeholder="Enter street address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="landmark">Nearby Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => updateFormData({ landmark: e.target.value })}
                    placeholder="Near temple, school, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Snake Information */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Tell us about the snake</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This helps our rescuers prepare appropriately
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Snake Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.snakeDescription}
                    onChange={(e) => updateFormData({ snakeDescription: e.target.value })}
                    placeholder="Describe the snake's appearance, behavior, and location..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="size">Approximate Size</Label>
                    <select
                      id="size"
                      value={formData.snakeSize}
                      onChange={(e) => updateFormData({ snakeSize: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="SMALL">Small (&lt;1 ft)</option>
                      <option value="MEDIUM">Medium (1-3 ft)</option>
                      <option value="LARGE">Large (3-6 ft)</option>
                      <option value="VERY_LARGE">Very Large (&gt;6 ft)</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="color">Color/Pattern</Label>
                    <Input
                      id="color"
                      value={formData.snakeColor}
                      onChange={(e) => updateFormData({ snakeColor: e.target.value })}
                      placeholder="Brown, black, green, striped..."
                    />
                  </div>
                </div>

                {/* Image Upload (Placeholder) */}
                <div>
                  <Label>Snake Photos (Optional)</Label>
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
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Review Your Request</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please verify all information before submitting
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="font-semibold mb-2">Request Type</h3>
                  <p className="text-sm">
                    {REQUEST_TYPES.find(t => t.value === formData.requestType)?.label}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-sm">
                    {formData.address}, Ward {formData.ward}, {formData.municipality}
                  </p>
                  {formData.landmark && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Near: {formData.landmark}
                    </p>
                  )}
                  {formData.lat && formData.lng && (
                    <p className="text-xs text-gray-500 mt-1">
                      GPS: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}
                    </p>
                  )}
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="font-semibold mb-2">Snake Information</h3>
                  <p className="text-sm">{formData.snakeDescription}</p>
                  <div className="mt-2 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Size: {formData.snakeSize}</span>
                    {formData.snakeColor && <span>Color: {formData.snakeColor}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || submitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed(step)}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
