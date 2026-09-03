'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActiveCallouts } from '@/components/active-callouts';
import { CoverageTracker } from '@/components/coverage-tracker';
import { ConservationAwareness } from '@/components/conservation-awareness';

export default function HomePage() {
  const stats = [
    { label: 'Active Rescues', value: '4', delta: '2 critical' },
    { label: 'Responders on Duty', value: '11', delta: '3 districts' },
    {
      label: 'Avg. Response Time',
      value: '24 min',
      delta: '−6 min this month',
    },
    { label: 'Snakes Released', value: '2,847', delta: 'since 2019' },
  ];

  return (
    <div>
      {/* Hero Section - Video Background with Premium Polish */}
      <div className="relative overflow-hidden h-[calc(100vh-64px)] sm:h-screen">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/snake_rescue_poster.jpg"
            className="h-full w-full object-cover opacity-0 transition-opacity duration-1000"
            style={{ objectPosition: 'center 35%' }}
            onLoadedData={(e) => {
              (e.target as HTMLVideoElement).style.opacity = '1';
            }}
          >
            <source
              src="https://res.cloudinary.com/dwrqifa8x/video/upload/v1787244867/snake_rescue3.mp4"
              type="video/mp4"
            />
          </video>

          {/* Mobile: Strong but not too dark overlay */}
          {/* Desktop: Directional gradient keeping video visible on right */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/80 sm:bg-gradient-to-r sm:from-black/75 sm:via-black/45 lg:from-black/70 lg:via-black/35 lg:to-transparent" />

          {/* Subtle vignette for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        {/* Content Container - Bottom-aligned on mobile, center on desktop */}
        <div className="relative z-10 h-full flex items-end pb-8 sm:pb-12 lg:pb-0 lg:items-center">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-5">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              {/* Left Column - Hero Content */}
              <div className="flex flex-col justify-end lg:justify-center max-w-[520px]">
                {/* Badge */}
                <Badge
                  variant="outline"
                  className="mb-3 sm:mb-4 w-fit gap-2 px-2.5 sm:px-3 py-1.5 border-emerald-400/40 bg-emerald-500/15 backdrop-blur-md shadow-lg"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-100">
                    4 Live Call-Outs
                  </span>
                </Badge>

                {/* Headline - Responsive sizing */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-tight lg:text-5xl xl:text-6xl text-white drop-shadow-lg">
                  Every snake <span className="text-emerald-400">rescued</span>,
                  <br />
                  every person <span className="text-emerald-300">safe.</span>
                </h1>

                {/* Description - Compact on mobile */}
                <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-white/95 lg:text-lg max-w-[480px] drop-shadow-md">
                  Professional rescue dispatch, volunteer coordination, AI
                  species identification, and community education — available
                  24/7.
                </p>

                {/* CTA Buttons - Stack on mobile */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all font-semibold"
                  >
                    <Link href="/rescues">
                      Open dispatch board
                      <span className="ml-2">→</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-11 px-6 border-white/40 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-all font-medium shadow-lg"
                  >
                    <Link href="/identify">Identify a snake</Link>
                  </Button>
                </div>

                {/* Quick Info - Compact */}
                <div className="mt-5 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-white/90 backdrop-blur-md bg-white/10 px-3 py-2 rounded-lg w-fit shadow-lg border border-white/20">
                  <span className="text-emerald-400 text-base">📞</span>
                  <span className="leading-snug">
                    24/7 hotline · 1166 · avg.{' '}
                    <strong className="text-white">11s</strong>
                  </span>
                </div>
              </div>

              {/* Right Column - Empty space for video on desktop */}
              <div className="hidden lg:block" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Separate Section Below Hero */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl border border-border/30 bg-background/60 p-6 backdrop-blur-xl shadow-md hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="mt-3 text-4xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {stat.delta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Call-outs Section */}
      <ActiveCallouts />

      {/* Coverage Tracker Section */}
      <div className="bg-background">
        <div className="mx-auto max-w-[1400px] px-5 py-20 lg:py-28">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary mb-3">
              Service Coverage
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Our Operational Coverage Area
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground leading-relaxed">
              We provide swift, professional wildlife rescue across five major
              municipalities in Rupandehi District.
            </p>
          </div>
          <CoverageTracker className="mt-12" />
        </div>
      </div>

      {/* Conservation and Safety Awareness Section */}
      <ConservationAwareness />

      {/* CTA Section - Premium Glass Treatment */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-30" />

        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <Badge
            variant="outline"
            className="mb-6 border-primary/30 bg-primary/5 text-primary"
          >
            <span className="font-bold uppercase tracking-widest text-xs">
              Emergency Response
            </span>
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Need Emergency Snake Rescue?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Our expert team is available 24/7 to respond to wildlife emergencies
            across Rupandehi
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-base h-12 px-8 shadow-lg hover:shadow-xl"
            >
              <Link href="/rescues">View Active Rescues</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base h-12 px-8 hover:border-primary/50"
            >
              <Link href="/identify">Identify a Snake</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
