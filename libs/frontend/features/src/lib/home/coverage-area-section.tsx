'use client';

import dynamic from 'next/dynamic';
import { useApp } from '../context/app-provider';

const CoverageMap = dynamic(() => import('./coverage-map'), { ssr: false });

export function CoverageAreaSection() {
  const { volunteers } = useApp();

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
       
          <h2 className="mb-4 font-poppins text-3xl font-bold text-gray-500 md:text-4xl">
            Our Operational Coverage Area
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400">
            We provide swift, professional wildlife rescue across five major municipalities in
            Rupandehi District.
          </p>
        </div>

        <CoverageMap volunteers={volunteers} />
      </div>
    </section>
  );
}
