/**
 * AI Chat Header
 * Premium header with context indicators
 */

'use client';

import React from 'react';
import { X, Minimize2, Maximize2, MoreVertical, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AIChatHeaderProps {
  context?: 'public' | 'rescuer' | 'admin';
  onClose: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  isMobile?: boolean;
}

export function AIChatHeader({
  context = 'public',
  onClose,
  onToggleExpand,
  isExpanded = false,
  isMobile = false,
}: AIChatHeaderProps) {
  const contextLabels = {
    public: 'Safety & Rescue Assistant',
    rescuer: 'Rescuer Assistant',
    admin: 'Operations Assistant',
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Icon & Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Animated icon */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-md" />
          <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success border-2 border-background" />
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            SnakeSOS AI
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {contextLabels[context]}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Expand/collapse (desktop only) */}
        {!isMobile && onToggleExpand && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
            className="h-8 w-8"
            aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Chat options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              New conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              View history
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Close */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
