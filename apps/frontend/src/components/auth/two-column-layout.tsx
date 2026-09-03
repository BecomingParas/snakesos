
import { ReactNode } from 'react';
import Link from 'next/link';

interface TwoColumnAuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function TwoColumnAuthLayout({
  children,
  title,
  subtitle,
}: TwoColumnAuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* ============================================================
          LEFT — BRAND PANEL (Desktop Only)
      ============================================================ */}
      <aside className="relative hidden lg:flex lg:w-1/2 xl:w-[45%] overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />

        {/* Content Container - Centered Vertically */}
        <div className="relative z-10 flex items-center justify-center w-full p-12 lg:p-16">
          <div className="max-w-lg space-y-5 text-center">
            {/* Logo - Centered above heading */}
            <div className="flex justify-center mb-1">
              <Link href="/" className="group">
                <img
                  src="/snakesoslogo_bg.png"
                  alt="SnakeSOS Logo"
                  className="h-32 w-32 sm:h-40 sm:w-40 lg:h-56 lg:w-56 object-contain transition-transform group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Heading & Description */}
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                Professional Wildlife<br />
                <span className="text-emerald-400">Rescue Platform</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Empowering communities with 24/7 emergency response, real-time incident management, and AI-powered snake identification.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 hover:bg-white/15 transition-colors">
                <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
                <div className="text-sm text-slate-300">Emergency Response</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 hover:bg-white/15 transition-colors">
                <div className="text-3xl font-bold text-emerald-400 mb-2">AI</div>
                <div className="text-sm text-slate-300">Snake ID System</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 hover:bg-white/15 transition-colors">
                <div className="text-3xl font-bold text-emerald-400 mb-2">Live</div>
                <div className="text-sm text-slate-300">Dispatch Tracking</div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-slate-400 mt-12">
              © 2026 SnakeSOS. Protecting lives, conserving wildlife.
            </p>
          </div>
        </div>
      </aside>

      {/* ============================================================
          RIGHT — FORM PANEL
      ============================================================ */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex flex-col items-center space-y-4 lg:hidden">
            <Link href="/" className="group">
              <img
                src="/snakesoslogo_bg.png"
                alt="SnakeSOS Logo"
                className="h-32 w-32 object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Container */}
          <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
            {children}
          </div>

          {/* Additional Info */}
          <p className="text-center text-sm text-muted-foreground">
            Protected by industry-standard encryption
          </p>
        </div>
      </main>
    </div>
  );
}
