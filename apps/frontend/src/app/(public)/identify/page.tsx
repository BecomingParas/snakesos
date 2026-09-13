'use client';

import { useRef, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Camera,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Activity,
} from 'lucide-react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Button } from '@/components/ui/button';

type IdentificationResult = {
  id: string;
  imageUrl?: string;
  species?: {
    id?: string;
    name?: string;
    scientificName?: string;
    nepaliName?: string;
    localNames?: string[];
    venomous?: boolean | null;
    venomousStatus?: string | null;
    dangerLevel?: string | null;
  } | null;
  confidence?: number | null;
  provider?: string | null;
  model?: string | null;
  dangerAssessment?: string | null;
  venomousDetected?: boolean | null;
  imageQuality?: string | null;
  identificationStatus?: string | null;
  visualFeatures?: string[];
  safety?: {
    riskLevel?: string;
    handlingAdvice?: string;
    publicSafetyMessage?: string;
  };
  medicalWarning?: string | null;
  reasoning?: string | null;
  alternativeMatches?: Array<{
    confidence?: number | null;
    reasoning?: string | null;
    species?: {
      name?: string | null;
      scientificName?: string | null;
      venomous?: boolean | null;
    } | null;
  }>;
  createdAt?: string;
  nearestHospital?: {
    name: string;
    address: string;
    phone?: string;
    emergencyPhone?: string;
    distance?: number;
    antivenomStatus: string;
    snakebiteTreatmentAvailable: boolean;
  };
  nearestRescuer?: {
    name: string;
    contact: string;
    experience: string;
    distance?: number;
    rating?: number;
    totalRescues?: number;
  };
};

function classifyDisplayLabel(dangerAssessment?: string | null) {
  switch (dangerAssessment) {
    case 'HIGH_RISK':
      return {
        label: 'LIKELY VENOMOUS',
        pill: 'border-destructive/40 bg-destructive/15 text-destructive',
        bar: 'bg-destructive',
      };
    case 'LOW_RISK':
      return {
        label: 'LIKELY NON-VENOMOUS',
        pill: 'border-success/40 bg-success/15 text-success',
        bar: 'bg-success',
      };
    default:
      return {
        label: 'IDENTIFICATION UNCERTAIN',
        pill: 'border-warning/40 bg-warning/15 text-warning',
        bar: 'bg-warning',
      };
  }
}

export default function IdentifyPage() {
  const [preview, setPreview] = useState<{
    url: string;
    name: string;
    file?: File;
  } | null>(null);
  const [state, setState] = useState<
    'idle' | 'uploading' | 'scanning' | 'done'
  >('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, isUploading, progress } = useMediaUpload();

  function pickFile(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be under 10MB for safe AI analysis.');
      return;
    }
    setPreview({ url: URL.createObjectURL(file), name: file.name, file });
    setResult(null);
    setError(null);
    setState('idle');
  }

  async function identify() {
    if (!preview?.file) return;

    try {
      setState('scanning');
      setError(null);

      // Get user's location
      let userLocation: { lat: number; lng: number } | null = null;
      if ('geolocation' in navigator) {
        try {
          console.log('[Identify] Requesting user location...');
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false,
            });
          });
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('[Identify] User location obtained:', userLocation);
        } catch (geoError) {
          console.warn('[Identify] Could not get location:', geoError);
          // Continue without location - still identify the snake
        }
      } else {
        console.warn('[Identify] Geolocation not supported');
      }

      // Send the file directly to the API endpoint
      const formData = new FormData();
      formData.append('file', preview.file);
      
      // Add location if available
      if (userLocation) {
        formData.append('lat', userLocation.lat.toString());
        formData.append('lng', userLocation.lng.toString());
      }

      const response = await fetch('/api/identify-snake', {
        method: 'POST',
        body: formData,
      });

      const mlResult = await response.json();

      console.log('[Identify] API Response:', {
        success: mlResult.success,
        hasHospital: !!mlResult.data?.nearestHospital,
        hasRescuer: !!mlResult.data?.nearestRescuer,
        hospital: mlResult.data?.nearestHospital,
        rescuer: mlResult.data?.nearestRescuer,
      });

      // Handle error responses from the new API format
      if (!response.ok || !mlResult.success) {
        const errorCode = mlResult.error?.code || 'UNKNOWN_ERROR';
        const errorMessage = mlResult.error?.message || 'Failed to identify snake';

        // Map error codes to user-friendly messages
        const userMessage = {
          'AI_RATE_LIMITED': 'Too many requests. Please wait a few minutes and try again.',
          'AI_SERVICE_NOT_CONFIGURED': 'AI service is temporarily unavailable. Please contact support.',
          'INVALID_IMAGE': 'Please upload a valid image file.',
          'INVALID_IMAGE_TYPE': 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
          'IMAGE_TOO_LARGE': 'Image is too large. Please use an image under 10MB.',
          'AI_INVALID_RESPONSE': 'AI service returned an invalid response. Please try again.',
          'AI_PROVIDER_TIMEOUT': 'AI service took too long to respond. Please try again.',
          'AI_PROVIDER_RATE_LIMITED': 'AI service is experiencing high demand. Please try again in a few minutes.',
          'AI_PROVIDER_ERROR': 'AI service error. Please try again or contact support.',
          'SNAKE_IDENTIFICATION_FAILED': 'Unable to identify the snake. Please try again with a clearer image.',
        }[errorCode] || errorMessage;

        throw new Error(userMessage);
      }

      // Handle the new API response format (with backward compatibility for old format)
      let data;
      
      if (mlResult.data) {
        // NEW API format
        data = mlResult.data;
      } else if (mlResult.identification) {
        // OLD API format (backward compatibility during migration)
        const oldData = mlResult.identification;
        data = {
          imageUrl: oldData.imageUrl,
          is_snake: oldData.is_snake,
          image_quality: 'good',
          identification_status: 'identified',
          species: oldData.species,
          confidence: oldData.confidence,
          visualFeatures: oldData.visualFeatures || [],
          alternativeMatches: oldData.alternativeMatches || [],
          safety: {
            risk_level: oldData.species?.dangerLevel === 'HIGH' || oldData.species?.dangerLevel === 'MODERATE' ? 'high' : 'low',
            handling_advice: oldData.safetyAdvice || '',
            public_safety_message: oldData.safetyAdvice || '',
          },
          medicalWarning: oldData.firstAid || null,
          reasoning: oldData.description || null,
        };
      } else {
        throw new Error('Invalid API response format');
      }
      
      // Check identification status for specific error states
      if (data.identification_status === 'insufficient_image') {
        setError('The image quality is too poor for identification. Please upload a clearer, well-lit photo from a safe distance.');
        setState('idle');
        return;
      }

      if (data.identification_status === 'not_a_snake') {
        setError('No snake was detected in this image. Please upload a different image.');
        setState('idle');
        return;
      }

      if (!data.is_snake) {
        setError('No snake detected in the image. Please ensure the snake is clearly visible and try again.');
        setState('idle');
        return;
      }

      // Map the new API response to the expected format
      const dangerAssessment = 
        data.safety?.risk_level === 'high' ? 'HIGH_RISK' :
        data.safety?.risk_level === 'low' ? 'LOW_RISK' :
        data.safety?.risk_level === 'moderate' ? 'CAUTION' :
        data.species?.dangerLevel || 'UNKNOWN';

      const payload: IdentificationResult = {
        id: mlResult.meta?.request_id || crypto.randomUUID(),
        imageUrl: data.imageUrl || preview.url,
        species: data.species ? {
          id: data.species.scientificName ?? 'unknown',
          name: data.species.name ?? 'Unknown',
          scientificName: data.species.scientificName ?? 'Unknown',
          nepaliName: null,
          localNames: [],
          venomous: data.species.venomous ?? null,
          venomousStatus: data.species.venomousStatus || (data.species.venomous === false ? 'non_venomous' : data.species.venomous === true ? 'venomous' : 'unknown'),
          dangerLevel: dangerAssessment,
        } : null,
        confidence: data.confidence ?? 0,
        provider: 'GEMINI',
        model: mlResult.meta?.model ?? mlResult.identification?.model ?? 'gemini-1.5-flash',
        dangerAssessment,
        venomousDetected: data.species?.venomous ?? null,
        imageQuality: data.image_quality,
        identificationStatus: data.identification_status,
        visualFeatures: data.visualFeatures ?? [],
        safety: data.safety,
        medicalWarning: data.medicalWarning,
        reasoning: data.reasoning,
        alternativeMatches: (data.alternativeMatches ?? []).map(
          (alt: { species?: { name?: string; scientificName?: string; venomous?: boolean }; confidence?: number }) => ({
            confidence: alt.confidence ?? 0,
            reasoning: alt.species?.venomous ? 'Venomous species' : 'Non-venomous species',
            species: {
              name: alt.species?.name ?? 'Unknown',
              scientificName: alt.species?.scientificName ?? 'Unknown',
              venomous: alt.species?.venomous ?? null,
            },
          }),
        ),
        createdAt: new Date().toISOString(),
        nearestHospital: data.nearestHospital,
        nearestRescuer: data.nearestRescuer,
      };

      setResult(payload);
      setState('done');
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Unable to analyze the image right now. Please try another photo.';
      setError(message);
      setState('idle');
    }
  }

  function reset() {
    setPreview(null);
    setResult(null);
    setState('idle');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  const meta = classifyDisplayLabel(result?.dangerAssessment);
  const confidencePercent = Math.round((result?.confidence ?? 0) * 100);
  const riskText =
    result?.dangerAssessment === 'HIGH_RISK'
      ? 'Likely venomous snake detected.'
      : result?.dangerAssessment === 'LOW_RISK'
        ? 'This snake is classified as likely non-venomous based on the available image.'
        : 'Snake identification is uncertain. Keep your distance and contact a trained rescuer if the snake is nearby.';

  return (
    <div>
      <section className="relative px-5 py-20 lg:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-foreground shadow-sm">
            <Bot className="h-3.5 w-3.5" /> AI-powered
          </span>
          <h1 className="mt-6 font-display text-5xl lg:text-6xl font-bold tracking-tight">
            Snake <span className="text-primary">Identifier</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Take a clear photo from a safe distance. Our AI will estimate the
            species and guide the next safest step.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Verified snake
              knowledge base
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Safety-first AI
              analysis
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              Identify a Snake
            </h2>

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                pickFile(event.dataTransfer.files?.[0]);
              }}
              className="mt-4 overflow-hidden rounded-2xl border border-dashed border-accent/40 bg-accent/5 backdrop-blur-sm"
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview.url}
                    alt="Uploaded snake"
                    className="h-64 w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-background/80 px-2 py-1 font-mono text-[11px] backdrop-blur">
                    {preview.name}
                  </span>
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Remove photo"
                    className="absolute inset-0 m-auto grid h-10 w-10 place-items-center rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="grid h-64 w-full place-items-center px-6 text-center"
                >
                  <span>
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-primary/40 bg-primary/15">
                      <Camera className="h-6 w-6 text-primary" />
                    </span>
                    <span className="mt-4 block font-semibold">
                      Take a clear photo from a safe distance
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Do not approach the snake. Upload a JPG, PNG, or WEBP
                      image under 10MB.
                    </span>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                      <Upload className="h-4 w-4" /> Take Photo
                    </span>
                  </span>
                </button>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) => pickFile(event.target.files?.[0])}
            />

            <div className="mt-4 flex gap-2">
              <Button
                className="flex-1"
                size="lg"
                onClick={identify}
                disabled={
                  !preview ||
                  state === 'uploading' ||
                  state === 'scanning' ||
                  isUploading
                }
              >
                {state === 'uploading' ||
                state === 'scanning' ||
                isUploading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-4 w-4" />
                )}
                {state === 'uploading'
                  ? 'Uploading image...'
                  : state === 'scanning'
                    ? 'Analyzing snake...'
                    : 'Identify Snake'}
              </Button>
              {preview && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={reset}
                  aria-label="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>

            {state === 'uploading' && (
              <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm text-muted-foreground">
                Uploading image... {progress}%
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              Analysis Results
            </h2>

            {result ? (
              <div className="mt-4 space-y-5">
                <div className="rounded-2xl border border-accent/40 bg-accent/10 backdrop-blur-sm shadow-md p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">
                        {result.species?.name || 'Uncertain identification'}
                      </h3>
                      <p className="text-sm italic text-muted-foreground">
                        {result.species?.scientificName ||
                          'Not confidently matched'}
                      </p>
                      {result.species?.venomousStatus && (
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                              result.species.venomousStatus === 'venomous'
                                ? 'border-destructive/40 bg-destructive/15 text-destructive'
                                : result.species.venomousStatus === 'non_venomous'
                                  ? 'border-success/40 bg-success/15 text-success'
                                  : 'border-warning/40 bg-warning/15 text-warning'
                            }`}
                          >
                            {result.species.venomousStatus === 'venomous' && '⚠️ VENOMOUS'}
                            {result.species.venomousStatus === 'non_venomous' && '✓ NON-VENOMOUS'}
                            {result.species.venomousStatus === 'potentially_venomous' && '⚠️ POTENTIALLY VENOMOUS'}
                            {result.species.venomousStatus === 'unknown' && '? VENOMOUS STATUS UNKNOWN'}
                          </span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.pill}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                      <span>AI confidence</span>
                      <span>{confidencePercent}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={meta.bar}
                        style={{
                          width: `${confidencePercent}%`,
                          height: '100%',
                        }}
                      />
                    </div>
                  </div>

                  {result.reasoning && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {result.reasoning}
                    </p>
                  )}
                </div>

                {result.alternativeMatches &&
                  result.alternativeMatches.length > 0 && (
                    <div className="rounded-2xl border border-border/30 bg-background/60 p-5">
                      <p className="flex items-center gap-2 font-semibold text-primary">
                        <CheckCircle2 className="h-4 w-4" /> Possible matches
                      </p>
                      <ul className="mt-3 space-y-2 text-sm">
                        {result.alternativeMatches
                          .slice(0, 3)
                          .map((match, index) => (
                            <li
                              key={`${match.species?.scientificName ?? 'match'}-${index}`}
                              className="flex items-center justify-between gap-3"
                            >
                              <span>
                                {match.species?.name || 'Other species'}
                              </span>
                              <span className="font-mono text-xs text-muted-foreground">
                                {Math.round((match.confidence ?? 0) * 100)}%
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                <div className="rounded-xl border border-warning/40 bg-warning/10 p-5">
                  <p className="flex items-center gap-2 font-semibold text-warning">
                    <AlertTriangle className="h-4 w-4" /> Safety guidance
                  </p>
                  {result.safety?.publicSafetyMessage ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {result.safety.publicSafetyMessage}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {result.dangerAssessment === 'HIGH_RISK'
                        ? 'Do not approach, touch, corner, or attempt to capture the snake. Keep a safe distance and contact a trained snake rescuer.'
                        : result.dangerAssessment === 'LOW_RISK'
                          ? 'This snake appears likely non-venomous, but do not handle or capture it. Keep a safe distance and avoid provoking it.'
                          : 'The image may not provide enough visual information for reliable identification. Keep your distance and contact a trained rescuer if the snake is nearby.'}
                    </p>
                  )}
                  {result.medicalWarning && (
                    <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                      <p className="text-sm font-semibold text-destructive">
                        Medical Warning
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {result.medicalWarning}
                      </p>
                    </div>
                  )}
                </div>

                {result.visualFeatures && result.visualFeatures.length > 0 && (
                  <div className="rounded-2xl border border-border/30 bg-background/60 p-5">
                    <p className="flex items-center gap-2 font-semibold text-primary">
                      <CheckCircle2 className="h-4 w-4" /> Visual features detected
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {result.visualFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.reasoning && (
                  <div className="rounded-2xl border border-border/30 bg-background/60 p-5">
                    <p className="flex items-center gap-2 font-semibold text-primary">
                      <Bot className="h-4 w-4" /> AI reasoning
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {result.reasoning}
                    </p>
                  </div>
                )}

                {/* Nearest Hospital & Rescuer Cards */}
                <div className="space-y-4">
                  {/* Debug info - remove this after testing */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="rounded-lg border border-blue-500 bg-blue-50 p-3 text-xs">
                      <p><strong>Debug:</strong></p>
                      <p>Has Hospital Data: {result.nearestHospital ? 'Yes' : 'No'}</p>
                      <p>Has Rescuer Data: {result.nearestRescuer ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                  
                  {result.nearestHospital && (
                    <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                          <Activity className="h-5 w-5" />
                          Nearest Hospital
                        </h3>
                        {result.nearestHospital.distance && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                            <Navigation className="h-3 w-3" />
                            {result.nearestHospital.distance.toFixed(1)} km away
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-lg">{result.nearestHospital.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {result.nearestHospital.address}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {result.nearestHospital.snakebiteTreatmentAvailable && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                              <CheckCircle2 className="h-3 w-3" />
                              Snakebite Treatment Available
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                            result.nearestHospital.antivenomStatus === 'AVAILABLE' 
                              ? 'border-success/40 bg-success/15 text-success'
                              : result.nearestHospital.antivenomStatus === 'LOW_STOCK'
                              ? 'border-warning/40 bg-warning/15 text-warning'
                              : 'border-destructive/40 bg-destructive/15 text-destructive'
                          }`}>
                            {result.nearestHospital.antivenomStatus === 'AVAILABLE' && '✓ Antivenom Available'}
                            {result.nearestHospital.antivenomStatus === 'LOW_STOCK' && '⚠️ Low Antivenom Stock'}
                            {result.nearestHospital.antivenomStatus === 'OUT_OF_STOCK' && '✗ No Antivenom'}
                            {result.nearestHospital.antivenomStatus === 'UNKNOWN' && '? Antivenom Status Unknown'}
                          </span>
                        </div>

                        <div className="flex gap-3 pt-2">
                          {result.nearestHospital.emergencyPhone && (
                            <a 
                              href={`tel:${result.nearestHospital.emergencyPhone}`}
                              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors"
                            >
                              <Phone className="h-4 w-4" />
                              Emergency: {result.nearestHospital.emergencyPhone}
                            </a>
                          )}
                          {!result.nearestHospital.emergencyPhone && result.nearestHospital.phone && (
                            <a 
                              href={`tel:${result.nearestHospital.phone}`}
                              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              <Phone className="h-4 w-4" />
                              Call: {result.nearestHospital.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {result.nearestRescuer && (
                    <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-accent">
                          <ShieldCheck className="h-5 w-5" />
                          Nearest Snake Rescuer
                        </h3>
                        {result.nearestRescuer.distance && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                            <Navigation className="h-3 w-3" />
                            {result.nearestRescuer.distance.toFixed(1)} km away
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-lg">{result.nearestRescuer.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.nearestRescuer.experience} Rescuer
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {result.nearestRescuer.totalRescues !== undefined && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                              <CheckCircle2 className="h-3 w-3" />
                              {result.nearestRescuer.totalRescues} Rescues Completed
                            </span>
                          )}
                          {result.nearestRescuer.rating && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
                              ⭐ {result.nearestRescuer.rating.toFixed(1)} Rating
                            </span>
                          )}
                        </div>

                        <a 
                          href={`tel:${result.nearestRescuer.contact}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          Call Rescuer: {result.nearestRescuer.contact}
                        </a>
                        
                        <p className="text-xs text-muted-foreground italic">
                          💡 Tip: Do not approach the snake. Keep a safe distance and let the trained rescuer handle it.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Show message if no hospital/rescuer data but location was provided */}
                  {!result.nearestHospital && !result.nearestRescuer && (
                    <div className="rounded-2xl border border-warning/40 bg-warning/10 p-6">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-warning mb-3">
                        <MapPin className="h-5 w-5" />
                        Location Services
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We couldn't find nearby hospitals or rescuers. This may be because:
                      </p>
                      <ul className="mt-2 text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Location permission was not granted</li>
                        <li>• No hospitals/rescuers are currently registered in our database</li>
                        <li>• Service is not yet available in your area</li>
                      </ul>
                      <p className="mt-3 text-sm font-semibold">
                        Please call the emergency hotlines below for immediate assistance.
                      </p>
                    </div>
                  )}

                  {/* Emergency Hotline Card - Always Show */}
                  <div className="rounded-2xl border border-destructive/40 bg-gradient-to-br from-destructive/10 to-warning/5 backdrop-blur-sm shadow-lg p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-destructive mb-4">
                      <Clock className="h-5 w-5 animate-pulse" />
                      24/7 Emergency Hotline
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Snake emergency? Our trained rescuers are available round the clock.
                    </p>
                    <div className="space-y-2">
                      <a 
                        href="tel:9812482578"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        Emergency Line 1: 9812482578
                      </a>
                      <a 
                        href="tel:9807591342"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        Emergency Line 2: 9807591342
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid min-h-[280px] place-items-center rounded-xl border border-border/70 bg-card/60 p-8 text-center">
                <div>
                  {state === 'uploading' ||
                  state === 'scanning' ||
                  isUploading ? (
                    <Loader2 className="mx-auto h-9 w-9 animate-spin text-primary" />
                  ) : (
                    <Camera className="mx-auto h-9 w-9 text-primary" />
                  )}
                  <p className="mt-4 text-sm text-muted-foreground">
                    {state === 'uploading'
                      ? 'Uploading image...'
                      : state === 'scanning'
                        ? 'Checking image quality, identifying species, and preparing safety guidance.'
                        : 'Upload a clear snake photo and click Identify Snake to see the result here.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-warning/40 bg-warning/10 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-warning">
            <AlertTriangle className="h-4 w-4" /> Important disclaimer
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This AI assistance is not a guarantee of species identification.
            Keep your distance, do not approach the snake, and contact a trained
            rescuer if there is any uncertainty or risk.
          </p>
        </div>
      </div>
    </div>
  );
}
