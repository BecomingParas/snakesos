/**
 * SnakeCard - Presentational component for displaying snake info
 */
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@snake-rescue/ui';
import { Badge } from '@snake-rescue/ui';
import { Button } from '@snake-rescue/ui';

export interface SnakeCardProps {
  snake: {
    id: string;
    commonName: string;
    scientificName: string;
    venomous: boolean;
    dangerLevel?: string | null;
    imageUrl?: string | null;
    description?: string | null;
  };
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const SnakeCard = ({
  snake,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}: SnakeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {snake.imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={snake.imageUrl}
            alt={snake.commonName}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{snake.commonName}</CardTitle>
            <CardDescription className="italic">{snake.scientificName}</CardDescription>
          </div>
          <div className="flex gap-2">
            {snake.venomous && (
              <Badge variant="destructive">Venomous</Badge>
            )}
            {snake.dangerLevel && (
              <Badge variant="outline">{snake.dangerLevel}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      {snake.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {snake.description}
          </p>
        </CardContent>
      )}
      
      {showActions && (
        <CardFooter className="flex gap-2">
          {onView && (
            <Button variant="default" size="sm" onClick={() => onView(snake.id)}>
              View Details
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(snake.id)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(snake.id)}>
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
