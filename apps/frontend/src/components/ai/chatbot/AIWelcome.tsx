/**
 * AI Welcome Screen
 * Context-aware initial state with suggestions
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  AlertTriangle,
  MapPin,
  Hospital,
  Shield,
  HelpCircle,
  Camera,
  BarChart3,
  Users,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Suggestion {
  icon: React.ReactNode;
  label: string;
  message: string;
  variant?: 'default' | 'primary' | 'warning';
}

interface AIWelcomeProps {
  context?: 'public' | 'rescuer' | 'admin';
  onSuggestionClick: (message: string) => void;
}

export function AIWelcome({ context = 'public', onSuggestionClick }: AIWelcomeProps) {
  const getSuggestions = (): Suggestion[] => {
    switch (context) {
      case 'rescuer':
        return [
          {
            icon: <Activity className="h-4 w-4" />,
            label: 'Show active rescues',
            message: 'Show my active rescue requests',
          },
          {
            icon: <MapPin className="h-4 w-4" />,
            label: 'Nearby requests',
            message: 'Find rescue requests near my location',
          },
          {
            icon: <BarChart3 className="h-4 w-4" />,
            label: 'Today\'s statistics',
            message: 'Show my rescue statistics for today',
          },
          {
            icon: <Search className="h-4 w-4" />,
            label: 'Snake identification',
            message: 'Help me identify a snake',
          },
        ];
      
      case 'admin':
        return [
          {
            icon: <BarChart3 className="h-4 w-4" />,
            label: 'System overview',
            message: 'Show today\'s system statistics',
          },
          {
            icon: <Activity className="h-4 w-4" />,
            label: 'Active operations',
            message: 'Show current active rescue operations',
          },
          {
            icon: <Users className="h-4 w-4" />,
            label: 'Rescuer availability',
            message: 'Show available rescuers by district',
          },
          {
            icon: <Hospital className="h-4 w-4" />,
            label: 'Hospital status',
            message: 'Check antivenom availability at hospitals',
          },
        ];
      
      default: // public
        return [
          {
            icon: <Camera className="h-4 w-4" />,
            label: 'Identify a snake',
            message: 'I want to identify a snake',
            variant: 'primary',
          },
          {
            icon: <AlertTriangle className="h-4 w-4" />,
            label: 'Report a snake',
            message: 'I need to report a snake sighting',
            variant: 'warning',
          },
          {
            icon: <MapPin className="h-4 w-4" />,
            label: 'Find rescuers',
            message: 'Find snake rescuers near me',
          },
          {
            icon: <Hospital className="h-4 w-4" />,
            label: 'Find hospitals',
            message: 'Find hospitals with antivenom near me',
          },
          {
            icon: <Shield className="h-4 w-4" />,
            label: 'Safety tips',
            message: 'What should I do if I encounter a snake?',
          },
          {
            icon: <HelpCircle className="h-4 w-4" />,
            label: 'Ask a question',
            message: 'I have a question about snake safety',
          },
        ];
    }
  };

  const suggestions = getSuggestions();

  const getWelcomeText = () => {
    switch (context) {
      case 'rescuer':
        return {
          title: 'Ready to assist',
          description: 'I can help you manage rescue operations, find nearby requests, and access rescue statistics.',
        };
      case 'admin':
        return {
          title: 'Operations assistant',
          description: 'I can provide system analytics, operational insights, and help you manage the SnakeSOS platform.',
        };
      default:
        return {
          title: 'Your intelligent snake safety assistant',
          description: 'I can help you identify snakes, report sightings, find nearby rescuers and hospitals, and answer snake safety questions.',
        };
    }
  };

  const welcomeText = getWelcomeText();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative text-6xl">🐍</div>
          </motion.div>
        </div>

        {/* Welcome text */}
        <div className="text-center space-y-3">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground"
          >
            SnakeSOS AI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {welcomeText.description}
          </motion.p>
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.message}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Button
                variant={suggestion.variant === 'primary' ? 'default' : 'outline'}
                className={cn(
                  'w-full justify-start h-auto py-3 px-4',
                  'hover:scale-[1.02] transition-transform',
                  suggestion.variant === 'warning' && 'border-warning/50 hover:border-warning'
                )}
                onClick={() => onSuggestionClick(suggestion.message)}
              >
                <span className="flex items-center gap-3 w-full">
                  <span className={cn(
                    'flex-shrink-0',
                    suggestion.variant === 'warning' && 'text-warning'
                  )}>
                    {suggestion.icon}
                  </span>
                  <span className="flex-1 text-left text-sm font-medium">
                    {suggestion.label}
                  </span>
                </span>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-center text-muted-foreground pt-4"
        >
          💡 You can ask me anything about snake safety and rescue operations
        </motion.p>
      </motion.div>
    </div>
  );
}
