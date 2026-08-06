'use client';

import { 
  HeroSection, 
  StatsSection, 
  ServicesSection,
  CoverageAreaSection,
  EducationSection 
} from '@snake-rescue/features';

export default function HomePage() {
  return (
    <div className="space-y-24">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <CoverageAreaSection />
      <EducationSection />
    </div>
  );
}
