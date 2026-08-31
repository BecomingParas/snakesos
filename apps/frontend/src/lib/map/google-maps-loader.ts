'use client';

import { useEffect, useState } from 'react';

export const GOOGLE_MAPS_LIBRARIES = [
  'places',
  'geometry',
  'drawing',
  'visualization',
] as const;

const SCRIPT_FLAG = 'data-snake-sos-google-maps';

export type GoogleMapsLoadErrorCode =
  | 'MISSING_KEY'
  | 'SCRIPT_LOAD_FAILED'
  | 'AUTH_FAILURE'
  | 'UNKNOWN';

export class GoogleMapsLoadError extends Error {
  code: GoogleMapsLoadErrorCode;

  constructor(code: GoogleMapsLoadErrorCode, message: string) {
    super(message);
    this.name = 'GoogleMapsLoadError';
    this.code = code;
  }
}

function getApiKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? '';
}

export function isGoogleMapsApiKeyConfigured(): boolean {
  const apiKey = getApiKey();
  if (!apiKey) return false;
  const normalized = apiKey.toLowerCase();
  if (
    normalized.includes('your_google_maps') ||
    normalized.includes('your-key') ||
    normalized.includes('paste_your') ||
    normalized.includes('your_api_key') ||
    normalized === 'undefined'
  ) {
    return false;
  }
  return apiKey.length >= 20;
}

function isMapsApiReady(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.google?.maps?.Map === 'function'
  );
}

let loadPromise: Promise<void> | null = null;
let authFailure: GoogleMapsLoadError | null = null;

function installAuthFailureHandler() {
  if (typeof window === 'undefined') return;
  const previous = window.gm_authFailure;
  window.gm_authFailure = () => {
    authFailure = new GoogleMapsLoadError(
      'AUTH_FAILURE',
      'Google Maps could not authenticate this API key for the current origin.',
    );
    if (typeof previous === 'function') {
      previous();
    }
  };
}

export function loadGoogleMapsApi(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(
      new GoogleMapsLoadError('UNKNOWN', 'Google Maps cannot load during SSR.'),
    );
  }

  if (authFailure) {
    return Promise.reject(authFailure);
  }

  if (isMapsApiReady()) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  if (!isGoogleMapsApiKeyConfigured()) {
    return Promise.reject(
      new GoogleMapsLoadError(
        'MISSING_KEY',
        'Google Maps is not configured. Please configure the Google Maps API key.',
      ),
    );
  }

  installAuthFailureHandler();

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[${SCRIPT_FLAG}="true"]`,
    );

    const handleReady = () => {
      if (authFailure) {
        reject(authFailure);
        return;
      }
      if (isMapsApiReady()) {
        resolve();
        return;
      }
      reject(
        new GoogleMapsLoadError(
          'UNKNOWN',
          'Google Maps script loaded but the Maps API is not available.',
        ),
      );
    };

    if (existing) {
      if (isMapsApiReady()) {
        resolve();
        return;
      }
      existing.addEventListener('load', handleReady, { once: true });
      existing.addEventListener(
        'error',
        () =>
          reject(
            new GoogleMapsLoadError(
              'SCRIPT_LOAD_FAILED',
              'Google Maps could not be loaded.',
            ),
          ),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.setAttribute(SCRIPT_FLAG, 'true');
    script.async = true;
    script.defer = true;
    const params = new URLSearchParams({
      key: getApiKey(),
      libraries: GOOGLE_MAPS_LIBRARIES.join(','),
      v: 'weekly',
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.onload = handleReady;
    script.onerror = () => {
      loadPromise = null;
      reject(
        new GoogleMapsLoadError(
          'SCRIPT_LOAD_FAILED',
          'Google Maps could not be loaded.',
        ),
      );
    };
    document.head.appendChild(script);
  }).catch((error) => {
    loadPromise = null;
    throw error;
  });

  return loadPromise;
}

export function resetGoogleMapsLoaderForRetry() {
  loadPromise = null;
  authFailure = null;
}

export function useGoogleMapsApi() {
  const [isLoaded, setIsLoaded] = useState(isMapsApiReady);
  const [error, setError] = useState<GoogleMapsLoadError | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsApi()
      .then(() => {
        if (!cancelled) {
          setError(null);
          setIsLoaded(true);
        }
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        if (loadError instanceof GoogleMapsLoadError) {
          setError(loadError);
        } else {
          setError(
            new GoogleMapsLoadError(
              'UNKNOWN',
              'Google Maps could not be loaded.',
            ),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const retry = () => {
    if (error?.code === 'AUTH_FAILURE' && typeof window !== 'undefined') {
      window.location.reload();
      return;
    }
    resetGoogleMapsLoaderForRetry();
    setError(null);
    setIsLoaded(false);
    loadGoogleMapsApi()
      .then(() => {
        setError(null);
        setIsLoaded(true);
      })
      .catch((loadError: unknown) => {
        if (loadError instanceof GoogleMapsLoadError) {
          setError(loadError);
        } else {
          setError(
            new GoogleMapsLoadError(
              'UNKNOWN',
              'Google Maps could not be loaded.',
            ),
          );
        }
      });
  };

  return {
    isLoaded,
    error,
    retry,
    apiKeyConfigured: isGoogleMapsApiKeyConfigured(),
  };
}

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}
