'use client';

import { 
  HeroSection, 
  StatsSection, 
  ServicesSection, 
  EducationSection 
} from '@snake-rescue/features';

export default function HomePage() {
  return (
    <div className="space-y-24">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <EducationSection />
    </div>
  );
}
