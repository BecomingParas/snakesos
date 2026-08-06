/**
 * RescueCard - Presentational component for rescue request
 */
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@snake-rescue/ui';
import { Badge } from '@snake-rescue/ui';
import { Button } from '@snake-rescue/ui';
import { MapPin, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface RescueCardProps {
  rescue: {
    id: string;
    status: string;
    priority: string;
    location: {
      address?: string | null;
      city?: string | null;
    };
    description?: string | null;
    createdAt: string;
    volunteer?: {
      name: string;
    } | null;
  };
  onView?: (id: string) => void;
  onAssign?: (id: string) => void;
  onUpdateStatus?: (id: string) => void;
  showActions?: boolean;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  ASSIGNED: 'bg-blue-500',
  IN_PROGRESS: 'bg-purple-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-gray-500',
};

const priorityVariants: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
  LOW: 'outline',
  MEDIUM: 'secondary',
  HIGH: 'destructive',
  URGENT: 'destructive',
};

export const RescueCard = ({
  rescue,
  onView,
  onAssign,
  onUpdateStatus,
  showActions = true,
}: RescueCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">Rescue #{rescue.id.slice(0, 8)}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={priorityVariants[rescue.priority] || 'default'}>
              {rescue.priority}
            </Badge>
            <div className={`w-3 h-3 rounded-full ${statusColors[rescue.status] || 'bg-gray-500'}`} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{rescue.location.address || `${rescue.location.city || 'Unknown location'}`}</span>
        </div>

        {rescue.volunteer && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Assigned to {rescue.volunteer.name}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDistanceToNow(new Date(rescue.createdAt), { addSuffix: true })}</span>
        </div>

        {rescue.description && (
          <p className="text-sm line-clamp-2">{rescue.description}</p>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="flex gap-2">
          {onView && (
            <Button size="sm" onClick={() => onView(rescue.id)}>
              View Details
            </Button>
          )}
          {onAssign && rescue.status === 'PENDING' && (
            <Button size="sm" variant="outline" onClick={() => onAssign(rescue.id)}>
              Assign
            </Button>
          )}
          {onUpdateStatus && (
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(rescue.id)}>
              Update Status
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
