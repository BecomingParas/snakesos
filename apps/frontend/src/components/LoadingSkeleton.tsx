/**
 * LoadingSkeleton - Reusable skeleton loading components
 * Provides consistent loading states across the app
 */

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse border border-white/10">
    <div className="h-40 bg-white/10 rounded-xl mb-4" />
    <div className="h-5 bg-white/10 rounded mb-2 w-3/4" />
    <div className="h-4 bg-white/10 rounded w-1/2" />
  </div>
);

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="glass-card rounded-xl p-4 animate-pulse border border-white/10 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-2/3" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const ImageSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-white/10 animate-pulse ${className}`} />
);

export const TextSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`h-4 bg-white/10 rounded animate-pulse ${className}`} />
);

export const FormSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div>
      <div className="h-4 bg-white/10 rounded w-1/4 mb-2" />
      <div className="h-12 bg-white/10 rounded-xl" />
    </div>
    <div>
      <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
      <div className="h-12 bg-white/10 rounded-xl" />
    </div>
    <div>
      <div className="h-4 bg-white/10 rounded w-1/5 mb-2" />
      <div className="h-32 bg-white/10 rounded-xl" />
    </div>
    <div className="h-12 bg-white/10 rounded-xl" />
  </div>
);

export const HeroSkeleton = () => (
  <div className="py-20 px-4 text-center animate-pulse">
    <div className="h-8 bg-white/10 rounded-full w-40 mx-auto mb-4" />
    <div className="h-12 bg-white/10 rounded w-2/3 mx-auto mb-4" />
    <div className="h-6 bg-white/10 rounded w-1/2 mx-auto" />
  </div>
);
