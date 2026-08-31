'use client';

import { AlertTriangle } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { GoogleMapsLoadError } from '@/lib/map/google-maps-loader';
import { isGoogleMapsApiKeyConfigured } from '@/lib/map/google-maps-loader';

interface StatusFrameProps {
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}

function StatusFrame({ style, className = '', children }: StatusFrameProps) {
  return (
    <div
      style={style}
      className={`flex items-center justify-center bg-slate-100 ${className}`}
    >
      {children}
    </div>
  );
}

export function GoogleMapsMissingKeyState({
  style,
  className,
}: {
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <StatusFrame style={style} className={className}>
      <div className="max-w-md p-6 text-center text-slate-700">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
        <p className="font-semibold text-slate-900">
          Google Maps is not configured.
        </p>
        <p className="mt-2 text-sm">
          Please configure the Google Maps API key.
        </p>
      </div>
    </StatusFrame>
  );
}

export function GoogleMapsLoadErrorState({
  error,
  onRetry,
  style,
  className,
}: {
  error?: GoogleMapsLoadError | Error | null;
  onRetry?: () => void;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <StatusFrame style={style} className={className}>
      <div className="max-w-md p-6 text-center text-slate-700">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <p className="font-semibold text-slate-900">
          Google Maps could not be loaded.
        </p>
        {error?.message ? (
          <p className="mt-2 text-sm">{error.message}</p>
        ) : null}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        ) : null}
      </div>
    </StatusFrame>
  );
}

export function GoogleMapsLoadingState({
  style,
  className,
}: {
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <StatusFrame style={style} className={className}>
      <p className="font-semibold text-slate-600">Loading Map...</p>
    </StatusFrame>
  );
}

export function GoogleMapsDevDiagnostics({
  mapInitialized,
  locationCount,
}: {
  mapInitialized: boolean;
  locationCount?: number;
}) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="pointer-events-none absolute left-2 top-2 z-10 rounded bg-black/70 px-2 py-1 font-mono text-[10px] leading-4 text-white">
      <div>Google Maps</div>
      <div>
        API key configured: {isGoogleMapsApiKeyConfigured() ? '✓' : '✗'}
      </div>
      <div>
        Maps API loaded:{' '}
        {typeof window !== 'undefined' && window.google?.maps ? '✓' : '✗'}
      </div>
      <div>Map initialized: {mapInitialized ? '✓' : '✗'}</div>
      {typeof locationCount === 'number' ? (
        <div>GraphQL locations: {locationCount}</div>
      ) : null}
    </div>
  );
}
