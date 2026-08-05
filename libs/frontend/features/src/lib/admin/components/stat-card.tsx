'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { StatCardProps } from '../types';

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  subtext,
  href,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        className={`block glass-card rounded-2xl p-5 border border-white/10 hover:border-${color}-500/30 transition-all group`}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-10 h-10 bg-${color}-500/20 rounded-xl flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 text-${color}-400`} />
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <p className="text-gray-600 text-xs mt-1">{subtext}</p>
      </Link>
    </motion.div>
  );
}

interface StatCardGridProps {
  stats: {
    totalRescues: number;
    activeRescues: number;
    pendingRescues: number;
    totalVolunteers: number;
    pendingVolunteers: number;
    totalSpecies: number;
    totalBlogs: number;
  };
}

export function StatCardGrid({ stats }: StatCardGridProps) {
  const { AlertCircle, Clock, Users, Bug } = require('lucide-react');

  const cards: StatCardProps[] = [
    {
      label: 'Total Rescues',
      value: stats.totalRescues,
      icon: AlertCircle,
      color: 'emerald',
      subtext: `${stats.activeRescues} active`,
      href: '/admin/rescues',
      delay: 0,
    },
    {
      label: 'Pending Rescues',
      value: stats.pendingRescues,
      icon: Clock,
      color: 'yellow',
      subtext: 'Need attention',
      href: '/admin/rescues',
      delay: 0.08,
    },
    {
      label: 'Volunteers',
      value: stats.totalVolunteers,
      icon: Users,
      color: 'blue',
      subtext: `${stats.pendingVolunteers} pending`,
      href: '/admin/volunteers',
      delay: 0.16,
    },
    {
      label: 'Species in DB',
      value: stats.totalSpecies,
      icon: Bug,
      color: 'purple',
      subtext: `${stats.totalBlogs} blog posts`,
      href: '/admin/species',
      delay: 0.24,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
