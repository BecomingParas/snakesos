'use client';

import { motion } from 'framer-motion';
import { Camera, ChevronRight, Crown, Star } from 'lucide-react';

interface PlayerCardPremiumProps {
  player: {
    id: string;
    name: string;
    role: string;
    jerseyNumber?: string | null;
    nationality?: string | null;
    isCaptain?: boolean;
    isViceCaptain?: boolean;
    specialty?: string;
  };
  avatarUrl?: string;
  accent?: 'gold' | 'cyan' | 'purple' | 'blue';
  index?: number;
  onView: () => void;
  onUpload?: (file: File) => void;
  showUpload?: boolean;
}

const accentConfig = {
  gold: {
    gradient: 'from-yellow-400 to-amber-500',
    ring: 'ring-yellow-400/20',
    bg: 'bg-yellow-400/10',
    text: 'text-yellow-400',
  },
  cyan: {
    gradient: 'from-cyan-400 to-blue-500',
    ring: 'ring-cyan-400/20',
    bg: 'bg-cyan-400/10',
    text: 'text-cyan-400',
  },
  purple: {
    gradient: 'from-purple-400 to-pink-500',
    ring: 'ring-purple-400/20',
    bg: 'bg-purple-400/10',
    text: 'text-purple-400',
  },
  blue: {
    gradient: 'from-blue-400 to-cyan-500',
    ring: 'ring-blue-400/20',
    bg: 'bg-blue-400/10',
    text: 'text-blue-400',
  },
};

export function PlayerCardPremium({
  player,
  avatarUrl,
  accent = 'gold',
  index = 0,
  onView,
  onUpload,
  showUpload = true,
}: PlayerCardPremiumProps) {
  const config = accentConfig[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onView}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-card/80 shadow-xl transition-all duration-300 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onView();
      }}
    >
      {/* Top Accent Bar */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${config.gradient}`} />

      {/* Hover Glow Effect */}
      <div className={`absolute -right-20 top-10 h-40 w-40 rounded-full ${config.bg} blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

      {/* Header */}
      <div className="relative flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {/* Jersey Number */}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-black text-foreground ring-1 ring-border/50">
            #{player.jerseyNumber || '00'}
          </span>

          {/* Captain Badge */}
          {player.isCaptain && (
            <span className={`inline-flex items-center gap-1 rounded-lg ${config.bg} px-2 py-1 text-xs font-black uppercase tracking-wider ${config.text} ring-1 ${config.ring}`}>
              <Crown className="h-3 w-3" />
              <span className="hidden sm:inline">Captain</span>
            </span>
          )}

          {/* Vice Captain Badge */}
          {player.isViceCaptain && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-2 py-1 text-xs font-black uppercase tracking-wider text-blue-400 ring-1 ring-blue-400/20">
              <Star className="h-3 w-3" />
              <span className="hidden sm:inline">VC</span>
            </span>
          )}
        </div>

        {/* Upload Button */}
        {showUpload && onUpload && (
          <button
            type="button"
            aria-label={`Upload ${player.name} photo`}
            onClick={(e) => {
              e.stopPropagation();
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (ev) => {
                const file = (ev.target as HTMLInputElement).files?.[0];
                if (file) onUpload(file);
              };
              input.click();
            }}
            className="rounded-lg bg-muted p-2 text-muted-foreground transition-all duration-300 hover:bg-muted/80 hover:text-foreground"
          >
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Player Image */}
      <div className="relative mx-4 mb-4 flex h-48 items-end justify-center overflow-hidden rounded-xl bg-gradient-to-b from-muted/50 to-muted/20 ring-1 ring-border/50 md:h-56">
        {/* Accent Gradient Overlay */}
        <div className={`absolute bottom-0 h-32 w-full bg-gradient-to-t ${config.gradient} opacity-10`} />

        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={player.name}
            className="relative z-10 h-full w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative z-10 flex h-full w-full items-center justify-center text-6xl font-black text-muted-foreground/20">
            {player.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="relative p-4 pt-0">
        {/* Name & Role */}
        <div className="mb-4 flex items-end justify-between gap-3 border-t border-border/50 pt-4">
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-base font-black uppercase text-foreground md:text-lg">
              {player.name}
            </h4>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {player.role}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-muted/50 p-3 ring-1 ring-border/50">
            <div className="text-muted-foreground">Specialty</div>
            <div className="mt-1 truncate font-bold text-foreground">
              {player.specialty || 'All-round'}
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 ring-1 ring-border/50">
            <div className="text-muted-foreground">Nation</div>
            <div className="mt-1 truncate font-bold text-foreground">
              {player.nationality || 'Squad'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
