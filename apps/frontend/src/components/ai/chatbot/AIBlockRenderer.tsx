'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  Phone,
  MapPin,
  Star,
  Shield,
  Clock,
} from 'lucide-react';
import type { StructuredBlock } from './types';

interface AIBlockRendererProps {
  block: StructuredBlock;
}

export function AIBlockRenderer({ block }: AIBlockRendererProps) {
  switch (block.type) {
    case 'snake-card':
      return <SnakeCard data={block.data} />;
    case 'rescuer-card':
      return <RescuerCard data={block.data} />;
    case 'alert':
      return <AlertBlock data={block.data} />;
    case 'action-buttons':
      return <ActionButtons data={block.data} />;
    default:
      return null;
  }
}

// Snake Card Component
function SnakeCard({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-3"
    >
      {data.imageUrl && (
        <img
          src={data.imageUrl}
          alt={data.name || 'Snake'}
          className="w-full h-40 object-cover rounded-lg"
        />
      )}

      <div>
        <h4 className="text-white font-semibold text-base">{data.name}</h4>
        {data.scientificName && (
          <p className="text-white/50 text-xs italic">{data.scientificName}</p>
        )}
      </div>

      {data.venomous !== undefined && (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            data.venomous
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}
        >
          {data.venomous ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              Venomous
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Non-venomous
            </>
          )}
        </div>
      )}

      {data.description && (
        <p className="text-white/70 text-sm leading-relaxed">{data.description}</p>
      )}

      {data.habitat && (
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
          <span className="text-white/60">{data.habitat}</span>
        </div>
      )}
    </motion.div>
  );
}

// Rescuer Card Component
function RescuerCard({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        {data.avatar ? (
          <img
            src={data.avatar}
            alt={data.name}
            className="w-12 h-12 rounded-full border-2 border-white/20"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-base">{data.name}</h4>
          {data.experience && (
            <p className="text-white/50 text-xs">{data.experience}</p>
          )}

          {data.rating !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white/80 text-sm font-medium">
                {data.rating.toFixed(1)}
              </span>
              {data.completedRescues !== undefined && (
                <span className="text-white/40 text-xs ml-1">
                  • {data.completedRescues} rescues
                </span>
              )}
            </div>
          )}

          {data.phone && (
            <a
              href={`tel:${data.phone}`}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Alert Block Component
function AlertBlock({ data }: { data: any }) {
  const severityConfig = {
    emergency: {
      icon: AlertTriangle,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-300',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-300',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-300',
      iconColor: 'text-blue-400',
    },
  };

  const config = severityConfig[data.severity as keyof typeof severityConfig] || severityConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 flex gap-3`}
    >
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        {data.title && (
          <h4 className={`${config.textColor} font-semibold text-sm mb-1`}>
            {data.title}
          </h4>
        )}
        <p className="text-white/80 text-sm leading-relaxed">{data.message}</p>
      </div>
    </motion.div>
  );
}

// Action Buttons Component
function ActionButtons({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2"
    >
      {data.buttons?.map((button: any, index: number) => (
        <button
          key={index}
          onClick={() => button.action && button.action()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            button.primary
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
              : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/80'
          }`}
        >
          {button.label}
        </button>
      ))}
    </motion.div>
  );
}
