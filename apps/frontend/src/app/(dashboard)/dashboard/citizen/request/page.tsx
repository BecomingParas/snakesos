'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Camera,
  ImagePlus,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  X,
  Home,
  TreePine,
  HeartPulse,
  Siren,
  TriangleAlert,
  Navigation,
  User,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useCreateRescueRequestMutation } from '@/lib/graphql/hooks/rescue.hooks';
import { useCurrentUser } from '@/hooks/dashboard/useCurrentUser';
import { toast } from 'sonner';

/** Must match CreateRescueInputSchema in the backend DTO */
const SNAKE_SIZE_OPTIONS = [
  { value: 'Small (<1ft)', label: 'Small (< 1 ft)' },
  { value: 'Medium (1-3ft)', label: 'Medium (1–3 ft)' },
  { value: 'Large (>3ft)', label: 'Large (> 3 ft)' },
] as const;

type SnakeSizeValue = (typeof SNAKE_SIZE_OPTIONS)[number]['value'];

const PHONE_REGEX = /^[0-9]{10}$/;

/** Strip formatting and Nepal country/leading-zero prefixes → 10-digit local number */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');

  if (digits.startsWith('977') && digits.length >= 12) {
    digits = digits.slice(3);
  }

  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }

  return digits;
}

function isValidPhone(raw: string): boolean {
  return PHONE_REGEX.test(normalizePhone(raw));
}

function parseGraphQLErrorMessage(err: {
  message?: string;
  graphQLErrors?: Array<{
    message?: string;
    extensions?: {
      context?: { errors?: Array<{ path: string; message: string }> };
    };
  }>;
}): string {
  const gqlError = err.graphQLErrors?.[0];
  const fieldErrors = gqlError?.extensions?.context?.errors;
  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    return fieldErrors.map((e) => `${e.path}: ${e.message}`).join(' · ');
  }
  return gqlError?.message || err.message || 'An error occurred';
}

/**
 * Multi-Step Rescue Request Form
 *
 * Step 1: Request Type
 * Step 2: Location
 * Step 3: Snake Information (with working camera / upload)
 * Step 4: Review & Submit
 */

type RequestType =
  | 'SNAKE_INSIDE'
  | 'SNAKE_OUTSIDE'
  | 'INJURED_SNAKE'
  | 'SNAKEBITE'
  | 'OTHER';

interface SnakeImage {
  id: string;
  dataUrl: string;
  file: File;
}

interface FormData {
  requestType: RequestType | null;

  municipality: string;
  ward: string;
  address: string;
  landmark: string;
  lat: number | null;
  lng: number | null;
  locationMethod: 'GPS' | 'MANUAL' | null;

  snakeDescription: string;
  snakeSize: SnakeSizeValue;
  snakeColor: string;
  snakeImages: SnakeImage[];
  isEmergency: boolean;
  hasBite: boolean;

  name: string;
  phone: string;
  email: string;
}

const REQUEST_TYPES: {
  value: RequestType;
  label: string;
  description: string;
  icon: typeof Home;
  tone: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet';
}[] = [
  {
    value: 'SNAKE_INSIDE',
    label: 'Snake Inside Property',
    description: 'Snake found inside house, room, or building',
    icon: Home,
    tone: 'blue',
  },
  {
    value: 'SNAKE_OUTSIDE',
    label: 'Snake Outside Property',
    description: 'Snake in garden, yard, or outdoor area',
    icon: TreePine,
    tone: 'emerald',
  },
  {
    value: 'INJURED_SNAKE',
    label: 'Injured Snake',
    description: 'Snake appears injured or in distress',
    icon: HeartPulse,
    tone: 'violet',
  },
  {
    value: 'SNAKEBITE',
    label: 'Snakebite Emergency',
    description: 'Someone has been bitten by a snake',
    icon: Siren,
    tone: 'rose',
  },
  {
    value: 'OTHER',
    label: 'Other Emergency',
    description: 'Other snake-related emergency',
    icon: TriangleAlert,
    tone: 'amber',
  },
];

const STEP_LABELS = ['Type', 'Location', 'Details', 'Review'];
const MAX_IMAGES = 4;

export default function RequestRescuePage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [createRescue, { loading: submitting }] =
    useCreateRescueRequestMutation({
      onCompleted: (data) => {
        toast.success('Rescue request submitted successfully!');
        router.push(
          `/dashboard/citizen/requests/${data.createRescueRequest.id}`,
        );
      },
      onError: (err) => {
        const message = parseGraphQLErrorMessage(err);
        setError(message);
        toast.error(message);
      },
    });

  const [formData, setFormData] = useState<FormData>({
    requestType: null,
    municipality: 'Butwal',
    ward: '',
    address: '',
    landmark: '',
    lat: null,
    lng: null,
    locationMethod: null,
    snakeDescription: '',
    snakeSize: 'Medium (1-3ft)',
    snakeColor: '',
    snakeImages: [],
    isEmergency: false,
    hasBite: false,
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      name: prev.name || user.name || '',
      phone: prev.phone || normalizePhone(user.phone || ''),
      email: prev.email || user.email || '',
    }));
  }, [user]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return formData.requestType !== null;
      case 2:
        return !!(
          formData.municipality &&
          formData.address &&
          (formData.lat !== null || formData.locationMethod === 'MANUAL')
        );
      case 3:
        // Snake details are optional at this step (backend GraphQL schema)
        return true;
      case 4:
        return formData.name.trim().length >= 2 && isValidPhone(formData.phone);
      default:
        return true;
    }
  };

  // ---------------------------------------------------------------------
  // Location
  // ---------------------------------------------------------------------
  const handleGetLocation = () => {
    setError(null);

    if (!('geolocation' in navigator)) {
      setError(
        'Geolocation is not supported by your browser. Enter the address manually below.',
      );
      updateFormData({ locationMethod: 'MANUAL' });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        updateFormData({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          locationMethod: 'GPS',
        });
      },
      (err) => {
        setLocating(false);
        console.error('Geolocation error:', err);
        let message =
          'Unable to get your location. Please enter the address manually.';
        if (err.code === err.PERMISSION_DENIED) {
          message =
            'Location access was denied. Enable location permission for this site in your browser settings, or enter the address manually.';
        } else if (err.code === err.TIMEOUT) {
          message =
            'Location request timed out. Try again or enter the address manually.';
        }
        setError(message);
        updateFormData({ locationMethod: 'MANUAL' });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  // ---------------------------------------------------------------------
  // Images — camera capture + gallery upload
  // ---------------------------------------------------------------------
  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const remaining = MAX_IMAGES - formData.snakeImages.length;
    if (remaining <= 0) {
      setError(`You can attach up to ${MAX_IMAGES} photos.`);
      return;
    }

    const files = Array.from(fileList).slice(0, remaining);
    const invalid = files.find((f) => !f.type.startsWith('image/'));
    if (invalid) {
      setError('Only image files are allowed.');
      return;
    }
    const tooLarge = files.find((f) => f.size > 10 * 1024 * 1024);
    if (tooLarge) {
      setError('Each image must be under 10MB.');
      return;
    }

    try {
      const newImages: SnakeImage[] = await Promise.all(
        files.map(async (file) => ({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          dataUrl: await readFileAsDataUrl(file),
          file,
        })),
      );
      updateFormData({ snakeImages: [...formData.snakeImages, ...newImages] });
    } catch (err) {
      console.error('Failed to read image:', err);
      setError('Something went wrong reading that image. Please try again.');
    }
  };

  const removeImage = (id: string) => {
    updateFormData({
      snakeImages: formData.snakeImages.filter((img) => img.id !== id),
    });
  };

  // ---------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------
  const handleSubmit = async () => {
    setError(null);

    const phone = normalizePhone(formData.phone);
    if (formData.name.trim().length < 2) {
      setError('Contact name required');
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setError(
        'Phone must be a 10-digit Nepali mobile number (e.g. 98XXXXXXXX)',
      );
      return;
    }
    if (
      formData.snakeDescription.trim().length > 0 &&
      formData.snakeDescription.trim().length < 10
    ) {
      setError('Snake description must be at least 10 characters if provided');
      return;
    }

    try {
      const wardValue =
        formData.ward.trim() !== ''
          ? Number.parseInt(formData.ward, 10)
          : undefined;

      await createRescue({
        variables: {
          input: {
            name: formData.name.trim(),
            phone,
            email: formData.email || undefined,
            municipality: formData.municipality,
            ward:
              typeof wardValue === 'number' && Number.isFinite(wardValue)
                ? wardValue
                : undefined,
            address: formData.address,
            landmark: formData.landmark || undefined,
            lat: formData.lat ?? undefined,
            lng: formData.lng ?? undefined,
            snakeDescription: formData.snakeDescription.trim() || undefined,
            snakeSize: formData.snakeSize || undefined,
            snakeColor: formData.snakeColor || undefined,
            snakeImages:
              formData.snakeImages.length > 0
                ? formData.snakeImages.map((img) => img.dataUrl)
                : undefined,
            snakeImageUrl: formData.snakeImages[0]?.dataUrl ?? undefined,
            isEmergency: formData.isEmergency,
            hasBite: formData.hasBite,
          },
        },
      });
    } catch (err) {
      console.error('Failed to submit rescue request:', err);
    }
  };

  const selectedType = REQUEST_TYPES.find(
    (t) => t.value === formData.requestType,
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Request Snake Rescue
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Tell us about the snake and we&apos;ll send a rescuer to help
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 rounded-xl border border-border bg-card px-4 py-4 shadow-soft sm:px-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200',
                      i === step
                        ? 'bg-primary text-primary-foreground glow-primary'
                        : i < step
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {i < step ? <CheckCircle className="h-4.5 w-4.5" /> : i}
                  </div>
                  <span
                    className={cn(
                      'hidden text-[11px] font-medium sm:block',
                      i === step ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {STEP_LABELS[i - 1]}
                  </span>
                </div>
                {i < 4 && (
                  <div
                    className={cn(
                      'mx-1.5 h-0.5 flex-1 rounded-full transition-colors duration-200 sm:mx-2',
                      i < step ? 'bg-success' : 'bg-border',
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-start gap-2.5 text-destructive">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm leading-relaxed">{error}</p>
            </div>
          </Card>
        )}

        {/* Step Content */}
        <Card className="border-border bg-card p-5 shadow-soft sm:p-7">
          {/* Step 1: Request Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  What type of rescue do you need?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select the option that best describes your situation
                </p>
              </div>

              <RadioGroup
                value={formData.requestType || ''}
                onValueChange={(value) => {
                  const type = value as RequestType;
                  updateFormData({
                    requestType: type,
                    isEmergency: type === 'SNAKEBITE' || type === 'OTHER',
                    hasBite: type === 'SNAKEBITE',
                  });
                }}
                className="space-y-3"
              >
                {REQUEST_TYPES.map((type) => {
                  const Icon = type.icon;
                  const active = formData.requestType === type.value;
                  return (
                    <label
                      key={type.value}
                      className={cn(
                        'flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-150',
                        active
                          ? 'border-primary bg-accent shadow-soft'
                          : 'border-border hover:border-primary/40 hover:bg-muted/50',
                      )}
                    >
                      <RadioGroupItem value={type.value} className="mt-1" />
                      <div
                        className={cn(
                          'icon-' + type.tone,
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <span className="font-semibold text-foreground">
                          {type.label}
                        </span>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Where is the snake?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Provide the location so rescuers can find you
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  type="button"
                  variant={
                    formData.locationMethod === 'GPS' ? 'default' : 'outline'
                  }
                  onClick={handleGetLocation}
                  disabled={locating}
                  className={cn(
                    'w-full justify-center',
                    formData.locationMethod === 'GPS' && 'glow-primary',
                  )}
                >
                  {locating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting your location...
                    </>
                  ) : formData.lat && formData.lng ? (
                    <>
                      <Navigation className="mr-2 h-4 w-4" />
                      {`Location captured (${formData.lat.toFixed(5)}, ${formData.lng.toFixed(5)})`}
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Use My Current Location
                    </>
                  )}
                </Button>

                {!formData.lat && !locating && (
                  <p className="text-xs text-muted-foreground">
                    If location access is blocked, fill in the address fields
                    below and continue — GPS is optional.
                  </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="municipality">Municipality *</Label>
                    <Input
                      id="municipality"
                      value={formData.municipality}
                      onChange={(e) =>
                        updateFormData({ municipality: e.target.value })
                      }
                      placeholder="Butwal"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ward">Ward Number</Label>
                    <Input
                      id="ward"
                      value={formData.ward}
                      onChange={(e) => updateFormData({ ward: e.target.value })}
                      placeholder="1"
                      type="number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      updateFormData({ address: e.target.value })
                    }
                    placeholder="Enter street address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="landmark">Nearby Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) =>
                      updateFormData({ landmark: e.target.value })
                    }
                    placeholder="Near temple, school, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Snake Information */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Tell us about the snake
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This helps our rescuers prepare appropriately
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="description">Snake Description</Label>
                  <Textarea
                    id="description"
                    value={formData.snakeDescription}
                    onChange={(e) =>
                      updateFormData({ snakeDescription: e.target.value })
                    }
                    placeholder="Describe the snake's appearance, behavior, and location..."
                    rows={4}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Optional, but a short description helps rescuers prepare
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="size">Approximate Size</Label>
                    <select
                      id="size"
                      value={formData.snakeSize}
                      onChange={(e) =>
                        updateFormData({
                          snakeSize: e.target.value as SnakeSizeValue,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    >
                      {SNAKE_SIZE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="color">Color/Pattern</Label>
                    <Input
                      id="color"
                      value={formData.snakeColor}
                      onChange={(e) =>
                        updateFormData({ snakeColor: e.target.value })
                      }
                      placeholder="Brown, black, green, striped..."
                    />
                  </div>
                </div>

                {/* Working image capture / upload */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Snake Photos (Optional)</Label>
                    <span className="text-xs text-muted-foreground">
                      {formData.snakeImages.length}/{MAX_IMAGES}
                    </span>
                  </div>

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      handleFilesSelected(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleFilesSelected(e.target.files);
                      e.target.value = '';
                    }}
                  />

                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={formData.snakeImages.length >= MAX_IMAGES}
                      className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="icon-blue flex h-10 w-10 items-center justify-center rounded-full">
                        <Camera className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Take Photo
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={formData.snakeImages.length >= MAX_IMAGES}
                      className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="icon-violet flex h-10 w-10 items-center justify-center rounded-full">
                        <ImagePlus className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Upload Photo
                      </span>
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    PNG or JPG, up to 10MB each, {MAX_IMAGES} photos max
                  </p>

                  {formData.snakeImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {formData.snakeImages.map((img) => (
                        <div
                          key={img.id}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                        >
                          <img
                            src={img.dataUrl}
                            alt="Snake photo"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Remove photo"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Review Your Request
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Please verify all information before submitting
                </p>
              </div>

              {formData.isEmergency && (
                <div className="flex items-center gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 pulse-border">
                  <Siren className="h-4.5 w-4.5 text-destructive" />
                  <span className="text-sm font-medium text-destructive">
                    Marked as an emergency request — rescuers will be notified
                    immediately
                  </span>
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Your Contact Details
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      So rescuers can reach you
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          updateFormData({ name: e.target.value })
                        }
                        placeholder="Your full name"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            updateFormData({ phone: e.target.value })
                          }
                          placeholder="98XXXXXXXX"
                          className="pl-9"
                          inputMode="numeric"
                          required
                        />
                      </div>
                      <p
                        className={cn(
                          'mt-1 text-xs',
                          formData.phone && !isValidPhone(formData.phone)
                            ? 'text-destructive'
                            : 'text-muted-foreground',
                        )}
                      >
                        {formData.phone && !isValidPhone(formData.phone)
                          ? 'Enter a valid 10-digit number (977 prefix is OK)'
                          : '10 digits — 977 country code is stripped automatically'}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData({ email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                      Request Type
                    </h3>
                    <div className="flex items-center gap-2">
                      {selectedType && (
                        <div
                          className={cn(
                            'icon-' + selectedType.tone,
                            'flex h-7 w-7 items-center justify-center rounded-md',
                          )}
                        >
                          <selectedType.icon className="h-4 w-4" />
                        </div>
                      )}
                      <p className="text-sm text-foreground">
                        {selectedType?.label}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                      Location
                    </h3>
                    <p className="text-sm text-foreground">
                      {formData.address}
                      {formData.ward ? `, Ward ${formData.ward}` : ''},{' '}
                      {formData.municipality}
                    </p>
                    {formData.landmark && (
                      <p className="text-sm text-muted-foreground">
                        Near: {formData.landmark}
                      </p>
                    )}
                    {formData.lat && formData.lng && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        GPS: {formData.lat.toFixed(5)},{' '}
                        {formData.lng.toFixed(5)}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                      Snake Information
                    </h3>
                    {formData.snakeDescription ? (
                      <p className="text-sm text-foreground">
                        {formData.snakeDescription}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No description provided
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>
                        Size:{' '}
                        {SNAKE_SIZE_OPTIONS.find(
                          (o) => o.value === formData.snakeSize,
                        )?.label ?? formData.snakeSize}
                      </span>
                      {formData.snakeColor && (
                        <span>Color: {formData.snakeColor}</span>
                      )}
                    </div>

                    {formData.snakeImages.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {formData.snakeImages.map((img) => (
                          <img
                            key={img.id}
                            src={img.dataUrl}
                            alt="Snake photo"
                            className="aspect-square w-full rounded-md border border-border object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || submitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed(step)}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !canProceed(4)}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
