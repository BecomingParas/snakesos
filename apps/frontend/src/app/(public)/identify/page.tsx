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

      // Send the file directly to the API endpoint
      const formData = new FormData();
      formData.append('file', preview.file);

      const response = await fetch('/api/identify-snake', {
        method: 'POST',
        body: formData,
      });

      const mlResult = await response.json();

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
        model: mlResult.meta?.model ?? mlResult.identification?.model ?? 'gemini-3.6-flash',
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
