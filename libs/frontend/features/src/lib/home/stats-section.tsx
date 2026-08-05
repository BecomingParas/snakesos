'use client';

import { Shield, Users, Clock, Award } from 'lucide-react';
import { StatsCard } from '@snake-rescue/ui';

const stats = [
  { icon: Shield, label: 'Snakes Rescued', value: 1240, subtitle: 'Safe releases' },
  { icon: Award, label: 'Success Rate', value: '100%', subtitle: 'No incidents' },
  { icon: Users, label: 'Community Sessions', value: 50, subtitle: 'Education programs' },
  { icon: Clock, label: 'Avg Response', value: '18 min', subtitle: 'Emergency calls' },
];

export function StatsSection() {
  return (
    <section className="section-block">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            subtitle={stat.subtitle}
            delay={index * 0.1}
            variant="premium"
          />
        ))}
      </div>
    </section>
  );
}