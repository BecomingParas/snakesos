/**
 * SnakeList - Presentational component for displaying list of snakes
 */
import { SnakeCard, SnakeCardProps } from './SnakeCard';
import { Button } from '@snake-rescue/ui';
import { Loader2 } from 'lucide-react';

export interface SnakeListProps {
  snakes: SnakeCardProps['snake'][];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export const SnakeList = ({
  snakes,
  loading = false,
  hasMore = false,
  onLoadMore,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  emptyMessage = 'No snakes found',
}: SnakeListProps) => {
  if (!loading && snakes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snakes.map((snake) => (
          <SnakeCard
            key={snake.id}
            snake={snake}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={showActions}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {hasMore && !loading && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button onClick={onLoadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};
