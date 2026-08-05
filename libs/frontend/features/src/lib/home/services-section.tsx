'use client';

import { motion } from 'framer-motion';
import {
  SectionHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@snake-rescue/ui';

const rescueServices = [
  {
    icon: '🛟',
    title: 'Certified Response Team',
    description:
      'Experienced handlers ready to respond through every district zone with community-safe techniques.',
  },
  {
    icon: '🩹',
    title: 'Rapid First Aid Support',
    description:
      'Clear guidance and hospital coordination help reduce panic and keep every rescue as safe as possible.',
  },
  {
    icon: '📚',
    title: 'Education and Awareness',
    description:
      'Workshops and local guidance help families identify species and minimise risky encounters.',
  },
];

export function ServicesSection() {
  return (
    <section className="section-block">
      <SectionHeader
        badge="Rapid Response"
        title="Built Around Safe Rescues"
        subtitle="Every mission combines field experience, public safety, and professional coordination."
        align="center"
      />
      
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rescueServices.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 text-4xl">{service.icon}</div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}