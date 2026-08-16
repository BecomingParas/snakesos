'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Clock,
  AlertCircle,
  Phone,
  User,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { type RescueRequest } from '@/lib/graphql/hooks/rescue.hooks'

interface CommandCenterMobileProps {
  rescues: RescueRequest[]
  loading: boolean
  onRescueSelect: (rescue: RescueRequest) => void
}

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  ASSIGNED: { label: 'Assigned', color: 'bg-blue-500', textColor: 'text-blue-700' },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-500', textColor: 'text-green-700' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-purple-500', textColor: 'text-purple-700' },
  COMPLETED: { label: 'Completed', color: 'bg-green-600', textColor: 'text-green-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-700' },
}

const PRIORITY_CONFIG = {
  LOW: { color: 'bg-gray-500', label: 'Low' },
  MEDIUM: { color: 'bg-yellow-500', label: 'Medium' },
  HIGH: { color: 'bg-orange-500', label: 'High' },
  CRITICAL: { color: 'bg-red-600', label: 'Critical' },
}

/**
 * Mobile Command Center - Queue View
 * Shows rescue requests as cards with priority and status
 * Tapping a card navigates to detail view
 */
export function CommandCenterMobile({
  rescues,
  loading,
  onRescueSelect,
}: CommandCenterMobileProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active'>('all')

  // Filter rescues by tab
  const filteredRescues = rescues.filter((rescue) => {
    if (activeTab === 'pending') return rescue.status === 'PENDING'
    if (activeTab === 'active') return ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(rescue.status)
    return true
  })

  // Group by priority
  const criticalRescues = filteredRescues.filter(r => r.priority === 'CRITICAL')
  const highRescues = filteredRescues.filter(r => r.priority === 'HIGH')
  const otherRescues = filteredRescues.filter(r => !['CRITICAL', 'HIGH'].includes(r.priority))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading rescues...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Stats Summary */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Open</p>
            <p className="text-2xl font-bold">{rescues.filter(r => r.status === 'PENDING').length}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-2xl font-bold">
              {rescues.filter(r => ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status)).length}
            </p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-destructive">{criticalRescues.length}</p>
          </Card>
        </div>
      </div>

      {/* Tab Filters */}
      <div className="flex gap-2 p-4 border-b overflow-x-auto">
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('all')}
          className="shrink-0"
        >
          All ({rescues.length})
        </Button>
        <Button
          variant={activeTab === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('pending')}
          className="shrink-0"
        >
          Pending ({rescues.filter(r => r.status === 'PENDING').length})
        </Button>
        <Button
          variant={activeTab === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('active')}
          className="shrink-0"
        >
          Active ({rescues.filter(r => ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status)).length})
        </Button>
      </div>

      {/* Rescue List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRescues.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No rescues found</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {/* Critical Priority */}
            {criticalRescues.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <h3 className="text-sm font-semibold text-destructive">Critical Priority</h3>
                </div>
                {criticalRescues.map(rescue => (
                  <RescueCard key={rescue.id} rescue={rescue} onClick={() => onRescueSelect(rescue)} />
                ))}
              </>
            )}

            {/* High Priority */}
            {highRescues.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-2 mt-4">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-orange-500">High Priority</h3>
                </div>
                {highRescues.map(rescue => (
                  <RescueCard key={rescue.id} rescue={rescue} onClick={() => onRescueSelect(rescue)} />
                ))}
              </>
            )}

            {/* Other Priority */}
            {otherRescues.length > 0 && criticalRescues.length + highRescues.length > 0 && (
              <div className="flex items-center gap-2 mb-2 mt-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Standard Priority</h3>
              </div>
            )}
            {otherRescues.map(rescue => (
              <RescueCard key={rescue.id} rescue={rescue} onClick={() => onRescueSelect(rescue)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Individual Rescue Card Component
 */
function RescueCard({ rescue, onClick }: { rescue: RescueRequest; onClick: () => void }) {
  const statusConfig = STATUS_CONFIG[rescue.status as keyof typeof STATUS_CONFIG]
  const priorityConfig = PRIORITY_CONFIG[rescue.priority as keyof typeof PRIORITY_CONFIG]
  const timeAgo = Math.round((Date.now() - new Date(rescue.createdAt).getTime()) / 60000)

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all active:scale-[0.98]',
        rescue.priority === 'CRITICAL' && 'border-destructive/50',
        rescue.priority === 'HIGH' && 'border-orange-500/50'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm truncate">{rescue.referenceNumber}</p>
            {rescue.isEmergency && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                EMERGENCY
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{rescue.address}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge className={cn('text-xs text-white', statusConfig.color)}>
          {statusConfig.label}
        </Badge>
        <Badge className={cn('text-xs text-white', priorityConfig.color)}>
          {priorityConfig.label}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{timeAgo}m ago</span>
        </div>
        {rescue.assignedVolunteer ? (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{rescue.assignedVolunteer.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-yellow-500">
            <AlertCircle className="h-3 w-3" />
            <span>Unassigned</span>
          </div>
        )}
      </div>

      {rescue.snakeDescription && (
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground line-clamp-1">
            🐍 {rescue.snakeDescription}
          </p>
        </div>
      )}
    </Card>
  )
}
