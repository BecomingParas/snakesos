'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  Phone,
  AlertTriangle,
  Building2,
  Syringe,
  FileText,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  useMyAssignedRescuesQuery,
  useCompleteRescueMutation,
  useUpdateRescueProgressMutation,
} from '@/lib/graphql/hooks/rescue.hooks'
import { useSearchHospitals } from '@/lib/graphql/hooks/hospital.hooks'
import { toast } from 'sonner'

/**
 * Active Rescue Page
 * Shows current active rescue for rescuer with ability to:
 * - Update progress status
 * - Navigate to location
 * - Call citizen
 * - Complete rescue with hospital information
 */

const OUTCOMES = [
  { value: 'RESCUED_RELOCATED', label: 'Rescued & Relocated', icon: CheckCircle },
  { value: 'ALREADY_GONE', label: 'Already Gone', icon: AlertTriangle },
  { value: 'FALSE_ALARM', label: 'False Alarm', icon: AlertTriangle },
  { value: 'NO_SNAKE_FOUND', label: 'No Snake Found', icon: AlertTriangle },
  { value: 'DECEASED', label: 'Snake Deceased', icon: AlertTriangle },
]

const ANTIVENOM_TYPES = [
  'Polyvalent Anti-snake Venom',
  'Monovalent Anti-snake Venom',
  'Anti-Viper Venom',
  'Anti-Cobra Venom',
  'Anti-Krait Venom',
  'Other',
]

export default function ActiveRescuePage() {
  const router = useRouter()
  const [showCompleteForm, setShowCompleteForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch active rescue
  const { data, loading, refetch } = useMyAssignedRescuesQuery({
    variables: {
      filter: { statuses: ['ACCEPTED', 'IN_PROGRESS', 'ARRIVED'] },
    },
    fetchPolicy: 'cache-and-network',
  })

  // Progress mutation
  const [updateProgress, { loading: updating }] = useUpdateRescueProgressMutation({
    onCompleted: () => {
      toast.success('Status updated')
      refetch()
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`)
    },
  })

  // Complete mutation
  const [completeRescue, { loading: completing }] = useCompleteRescueMutation({
    onCompleted: () => {
      toast.success('Rescue completed! Well done! 🎉')
      setTimeout(() => {
        router.push('/dashboard/rescuer')
      }, 2000)
    },
    onError: (error) => {
      toast.error(`Failed to complete: ${error.message}`)
    },
  })

  // Form state
  const [outcome, setOutcome] = useState('')
  const [rescueReport, setRescueReport] = useState('')
  const [rescueImages, setRescueImages] = useState<string[]>([])
  const [victimWentToHospital, setVictimWentToHospital] = useState<boolean | null>(null)
  const [selectedHospital, setSelectedHospital] = useState('')
  const [antivenomAdministered, setAntivenomAdministered] = useState(false)
  const [antivenomType, setAntivenomType] = useState('')
  const [hospitalAdmission, setHospitalAdmission] = useState(false)
  const [hospitalNotes, setHospitalNotes] = useState('')

  // Hospital search
  const { data: hospitalsData } = useSearchHospitals(searchQuery, 20)
  const hospitals = (hospitalsData as any)?.searchHospitals || []

  const activeRescue = data?.myAssignedRescues?.edges?.[0]?.node

  const handleUpdateStatus = async (newStatus: string) => {
    if (!activeRescue) return

    await updateProgress({
      variables: {
        input: {
          rescueId: activeRescue.id,
          status: newStatus,
        },
      },
    })
  }

  const handleComplete = async () => {
    if (!activeRescue || !outcome || !rescueReport) {
      toast.error('Please fill in all required fields')
      return
    }

    if (victimWentToHospital && !selectedHospital) {
      toast.error('Please select a hospital')
      return
    }

    await completeRescue({
      variables: {
        input: {
          rescueId: activeRescue.id,
          outcome,
          rescueReport,
          rescueImages,
          victimWentToHospital: victimWentToHospital || false,
          hospitalId: victimWentToHospital ? selectedHospital : undefined,
          antivenomAdministered: victimWentToHospital ? antivenomAdministered : undefined,
          antivenomType: antivenomAdministered ? antivenomType : undefined,
          hospitalAdmission: victimWentToHospital ? hospitalAdmission : undefined,
          hospitalNotes: victimWentToHospital ? hospitalNotes : undefined,
        },
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!activeRescue) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="mx-auto max-w-2xl">
          <Card className="p-12 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Active Rescue</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have any active rescues at the moment.
            </p>
            <Button onClick={() => router.push('/dashboard/rescuer')}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/rescuer')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Active Rescue</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {activeRescue.referenceNumber}
              </p>
            </div>
          </div>
          <Badge
            className={cn(
              'text-white',
              activeRescue.status === 'ACCEPTED' && 'bg-blue-500',
              activeRescue.status === 'IN_PROGRESS' && 'bg-green-500',
              activeRescue.status === 'ARRIVED' && 'bg-purple-500'
            )}
          >
            {activeRescue.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Rescue Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Rescue Information</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeRescue.address}, {activeRescue.municipality}
                  {activeRescue.ward && ` (Ward ${activeRescue.ward})`}
                </p>
              </div>
            </div>

            {activeRescue.snakeDescription && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Snake Description</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activeRescue.snakeDescription}
                  </p>
                </div>
              </div>
            )}

            {activeRescue.user && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Citizen Contact</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activeRescue.user.name} - {activeRescue.user.phone}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                if (activeRescue.user?.phone) {
                  window.location.href = `tel:${activeRescue.user.phone}`
                }
              }}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Citizen
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (activeRescue.lat && activeRescue.lng) {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${activeRescue.lat},${activeRescue.lng}`,
                    '_blank'
                  )
                }
              }}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Navigate
            </Button>
          </div>
        </Card>

        {/* Status Updates */}
        {!showCompleteForm && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Update Status</h2>
            <div className="grid grid-cols-2 gap-3">
              {activeRescue.status === 'ACCEPTED' && (
                <Button
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Start Rescue
                </Button>
              )}
              {(activeRescue.status === 'ACCEPTED' || activeRescue.status === 'IN_PROGRESS') && (
                <Button
                  onClick={() => handleUpdateStatus('ARRIVED')}
                  disabled={updating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Mark Arrived
                </Button>
              )}
              <Button
                onClick={() => setShowCompleteForm(true)}
                className="col-span-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Rescue
              </Button>
            </div>
          </Card>
        )}

        {/* Complete Form */}
        {showCompleteForm && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Complete Rescue</h2>
            
            <div className="space-y-6">
              {/* Outcome */}
              <div>
                <Label>Outcome *</Label>
                <RadioGroup value={outcome} onValueChange={setOutcome} className="grid grid-cols-2 gap-3 mt-2">
                  {OUTCOMES.map((item) => (
                    <div key={item.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={item.value} id={item.value} />
                      <Label htmlFor={item.value} className="cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Rescue Report */}
              <div>
                <Label htmlFor="report">Rescue Report *</Label>
                <Textarea
                  id="report"
                  value={rescueReport}
                  onChange={(e) => setRescueReport(e.target.value)}
                  placeholder="Describe what happened during the rescue..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              {/* Hospital Section */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold">Hospital Information</h3>
                </div>

                {/* Did victim go to hospital? */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                  <Label htmlFor="hospital-visit">Did the victim go to a hospital?</Label>
                  <Switch
                    id="hospital-visit"
                    checked={victimWentToHospital === true}
                    onCheckedChange={(checked) => setVictimWentToHospital(checked)}
                  />
                </div>

                {victimWentToHospital && (
                  <div className="space-y-4 pl-4 border-l-2 border-blue-500">
                    {/* Hospital Selection */}
                    <div>
                      <Label>Select Hospital *</Label>
                      <Input
                        type="text"
                        placeholder="Search hospital by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-2 mb-2"
                      />
                      <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hospital" />
                        </SelectTrigger>
                        <SelectContent>
                          {hospitals.map((hospital: any) => (
                            <SelectItem key={hospital.id} value={hospital.id}>
                              {hospital.name} - {hospital.municipality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Antivenom */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        <Label htmlFor="antivenom">Antivenom Administered?</Label>
                      </div>
                      <Switch
                        id="antivenom"
                        checked={antivenomAdministered}
                        onCheckedChange={setAntivenomAdministered}
                      />
                    </div>

                    {antivenomAdministered && (
                      <div>
                        <Label>Antivenom Type</Label>
                        <Select value={antivenomType} onValueChange={setAntivenomType}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select antivenom type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ANTIVENOM_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Hospital Admission */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <Label htmlFor="admission">Patient Admitted to Hospital?</Label>
                      <Switch
                        id="admission"
                        checked={hospitalAdmission}
                        onCheckedChange={setHospitalAdmission}
                      />
                    </div>

                    {/* Hospital Notes */}
                    <div>
                      <Label htmlFor="hospital-notes">Hospital Notes (Optional)</Label>
                      <Textarea
                        id="hospital-notes"
                        value={hospitalNotes}
                        onChange={(e) => setHospitalNotes(e.target.value)}
                        placeholder="Any additional notes about hospital visit..."
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCompleteForm(false)}
                  className="flex-1"
                  disabled={completing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={completing || !outcome || !rescueReport}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {completing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Rescue
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
