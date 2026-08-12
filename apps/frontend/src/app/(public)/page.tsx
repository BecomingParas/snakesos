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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-background">
        <div className="mx-auto max-w-[1400px] px-5 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Hero Text */}
            <div className="flex flex-col justify-center">
              <Badge variant="secondary" className="mb-6 w-fit gap-2 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">4 Live Call-Outs</span>
              </Badge>

              <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight lg:text-6xl text-white">
                Every snake{' '}
                <span className="text-green-400">rescued</span>, every person{' '}
                <span className="text-primary">safe.</span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-300 lg:text-xl">
                A single console for rescue dispatch, volunteer readiness, AI-assisted
                species identification and community snakebite education — built for
                teams who answer the call at 2 a.m.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-12 px-8 bg-green-600 hover:bg-green-700">
                  <Link href="/rescues">
                    Open dispatch board
                    <span className="ml-2">→</span>
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Link href="/identify">Identify a snake</Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
                <span className="text-primary">📞</span>
                <span>24/7 hotline · 1166 · average pickup 11 seconds</span>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary/20 to-accent/20">
                <Image 
                  src="/wallets/snakelanding.jpg" 
                  alt="Snake rescue in action" 
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm"
              >
                <div className="text-sm uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
                <div className="mt-2 font-display text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.delta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Call-outs Section */}
      <ActiveCallouts />

      {/* Coverage Tracker Section */}
      <div className="bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 py-16 lg:py-24">
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Our Operational Coverage Area
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              We provide swift, professional wildlife rescue across five major municipalities in
              Rupandehi District.
            </p>
          </div>
          <CoverageTracker className="mt-10" />
        </div>
      </div>

      {/* Conservation and Safety Awareness Section */}
      <ConservationAwareness />

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Need Emergency Snake Rescue?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our expert team is available 24/7 to respond to wildlife emergencies across Rupandehi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="text-lg h-12 px-8 bg-green-600 hover:bg-green-700"
            >
              <Link href="/rescues">
                View Active Rescues
              </Link>
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="text-lg h-12 px-8"
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
