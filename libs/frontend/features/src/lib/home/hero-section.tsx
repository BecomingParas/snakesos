'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, ShieldAlert, Heart } from 'lucide-react';
import { Button } from '@snake-rescue/ui';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Snake Rescue Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient overlays for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e293b]/80 via-[#1e293b]/70 to-[#0f172a]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b]/50 via-transparent to-[#1e293b]/50" />
      </div>

      {/* Large Logo Watermark - Centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
        <div className="relative w-full max-w-5xl px-8">
          <div className="relative w-full h-[400px] opacity-[0.03]">
            <Image
              src="/logo.png"
              alt="Butwal Snake Rescuers Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* 24 Hours Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-5 py-2.5 text-emerald-400 text-sm font-bold backdrop-blur-md shadow-lg"
          >
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            24 HOURS AVAILABLE
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(46, 204, 113, 0.15)' }}
          >
            24/7 Snake Rescue Service in
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Butwal & Rupandehi
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Protecting People, Conserving Wildlife Through Safe Rescue & Awareness.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <Link href="/emergency">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-7 text-lg rounded-2xl shadow-2xl hover:shadow-red-600/30 transition-all duration-300 group border-2 border-red-500"
              >
                <ShieldAlert className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Request Rescue
              </Button>
            </Link>
            
            <Link href="tel:9816482570">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-2 border-emerald-400 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-300 font-bold px-10 py-7 text-lg rounded-2xl backdrop-blur-md shadow-xl transition-all duration-300"
              >
                <Phone className="mr-3 h-6 w-6" />
                Call Now: 9816482570
              </Button>
            </Link>

            <Link href="/volunteer">
              <Button 
                size="lg" 
                variant="ghost"
                className="w-full sm:w-auto text-white/90 hover:text-white hover:bg-white/10 font-semibold px-10 py-7 text-lg rounded-2xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <Heart className="mr-3 h-6 w-6" />
                Volunteer With Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent z-[2]" />
    </section>
  );
}