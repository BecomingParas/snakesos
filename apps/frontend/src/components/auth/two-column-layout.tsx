
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
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-background">
      {/* ============================================================
          LEFT — BRAND PANEL
      ============================================================ */}
      <aside className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white lg:flex">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Left Panel Content */}
        <div className="relative z-10 flex w-full flex-col">
          {/* Centered Content */}
          <div className="flex flex-1 items-center justify-center px-12 py-16">
            <div className="w-full max-w-lg">
              {/* Logo + Brand */}
              <Link
                href="/"
                className="group mb-10 inline-flex items-center gap-4"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center">
                  <img
                    src="/logo.jpg"
                    alt="SnakeSOS Logo"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div>
                  <h1 className="font-display text-2xl font-bold uppercase tracking-[0.18em]">
                    Snake<span className="text-green-400">SOS</span>
                  </h1>

                  <p className="mt-1 text-xs tracking-wide text-slate-400">
                    Wildlife Rescue Management
                  </p>
                </div>
              </Link>

              {/* Main Content */}
              <div className="max-w-md space-y-5">
                <div className="h-1 w-12 rounded-full bg-green-400" />

                <h2 className="text-4xl font-bold leading-[1.15] tracking-tight">
                  Welcome Back to{' '}
                  <span className="text-green-400">SnakeSOS</span>
                </h2>

                <p className="text-base leading-7 text-slate-300">
                  Your all-in-one platform for wildlife rescue management,
                  live incident tracking, and community engagement.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <p className="text-xl font-bold text-primary">24/7</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Rescue Support
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <p className="text-xl font-bold text-primary">Live</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Incident Tracking
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <p className="text-xl font-bold text-primary">Safe</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Wildlife Care
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="px-12 pb-8">
            <p className="text-center text-xs text-muted-foreground">
              © 2024 SnakeSOS. All rights reserved.
            </p>
          </div>
        </div>
      </aside>

      {/* ============================================================
          RIGHT — FORM PANEL
      ============================================================ */}
      <main className="flex w-full items-center justify-center overflow-y-auto lg:w-[55%]">
        <div className="w-full max-w-md px-6 py-10 sm:px-8 lg:max-w-lg lg:px-12">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link
              href="/"
              className="mb-4 inline-flex items-center justify-center"
            >
              <img
                src="/logo.jpg"
                alt="SnakeSOS Logo"
                className="h-24 w-24 object-contain"
              />
            </Link>

            <h1 className="font-display text-2xl font-bold uppercase tracking-[0.15em]">
              Snake<span className="text-primary">SOS</span>
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Wildlife Rescue Management
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
            {/* Form Heading */}
            <div className="mb-7 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
                {title}
              </h2>

              {subtitle && (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
