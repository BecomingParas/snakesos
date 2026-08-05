'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Users } from 'lucide-react';
import {
  Button,
  SectionHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
} from '@snake-rescue/ui';

const snakeInfo = [
  {
    title: 'Indian Cobra',
    description:
      'Highly venomous and commonly seen near residential edges and agricultural land.',
    badge: 'Venomous',
    badgeVariant: 'destructive' as const,
  },
  {
    title: 'Common Krait',
    description:
      'A nocturnal species that is easy to miss and requires extra caution at night.',
    badge: 'Venomous',
    badgeVariant: 'destructive' as const,
  },
  {
    title: 'Rat Snake',
    description:
      'Non-venomous and highly beneficial for controlling rodents in gardens and fields.',
    badge: 'Non-venomous',
    badgeVariant: 'secondary' as const,
  },
  {
    title: 'Keelback',
    description:
      'Often found near water and commonly confused with more dangerous snakes.',
    badge: 'Non-venomous',
    badgeVariant: 'secondary' as const,
  },
];

export function EducationSection() {
  return (
    <section className="section-block">
      <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/80 p-8 lg:p-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHeader
              badge="Education"
              title="Knowledge Saves Lives"
              subtitle="Local workshops and quick guidance help residents understand snakes, respond calmly, and seek help early."
            />
            
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/snakes">
                <Button>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Species Guide
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Contact Team
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {snakeInfo.map((snake, index) => (
              <motion.div
                key={snake.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{snake.title}</CardTitle>
                      <Badge variant={snake.badgeVariant} className="text-xs">
                        {snake.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{snake.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}