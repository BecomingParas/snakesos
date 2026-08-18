'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ActiveCallouts } from '@/components/active-callouts'
import { CoverageTracker } from '@/components/coverage-tracker'
import { ConservationAwareness } from '@/components/conservation-awareness'

export default function HomePage() {
  const stats = [
    { label: 'Active Rescues', value: '4', delta: '2 critical' },
    { label: 'Responders on Duty', value: '11', delta: '3 districts' },
    { label: 'Avg. Response Time', value: '24 min', delta: '−6 min this month' },
    { label: 'Snakes Released', value: '2,847', delta: 'since 2019' },
  ]

  return (
    <div>
      {/* Hero Section - Premium Light Mode */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-20" />
        
        <div className="relative mx-auto max-w-[1400px] px-5 py-20 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Left Column - Hero Text */}
            <div className="flex flex-col justify-center">
              <Badge variant="outline" className="mb-8 w-fit gap-2 px-4 py-2 border-primary/30 bg-primary/5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">4 Live Call-Outs</span>
              </Badge>

              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight lg:text-6xl text-foreground">
                Every snake{' '}
                <span className="text-primary">rescued</span>,<br />every person{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">safe.</span>
              </h1>

              <p className="mt-8 text-lg leading-relaxed text-muted-foreground lg:text-xl max-w-xl">
                A single console for rescue dispatch, volunteer readiness, AI-assisted
                species identification and community snakebite education — built for
                teams who answer the call at 2 a.m.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-12 px-8 shadow-lg hover:shadow-xl transition-all">
                  <Link href="/rescues">
                    Open dispatch board
                    <span className="ml-2">→</span>
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 border-border/50 hover:border-primary/50 transition-all">
                  <Link href="/identify">Identify a snake</Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary text-lg">📞</span>
                <span>24/7 hotline · 1166 · average pickup <strong className="text-foreground">11 seconds</strong></span>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-primary/10 to-accent/10 shadow-2xl backdrop-blur-sm">
                <Image 
                  src="/wallets/snakelanding.jpg" 
                  alt="Snake rescue in action" 
                  width={800}
                  height={600}
                  className="h-full w-full object-cover opacity-90"
                  priority
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Stats Grid - Glass Treatment */}
          <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              We provide swift, professional wildlife rescue across five major municipalities in
              Rupandehi District.
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
          <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/5 text-primary">
            <span className="font-bold uppercase tracking-widest text-xs">Emergency Response</span>
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Need Emergency Snake Rescue?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Our expert team is available 24/7 to respond to wildlife emergencies across Rupandehi
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="text-base h-12 px-8 shadow-lg hover:shadow-xl"
            >
              <Link href="/rescues">
                View Active Rescues
              </Link>
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="text-base h-12 px-8 hover:border-primary/50"
            >
              <Link href="/identify">
                Identify a Snake
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
