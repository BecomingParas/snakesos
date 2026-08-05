'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, AlertTriangle, User, FileText, Eye, Send, Navigation, Loader2 } from 'lucide-react';
import { Button, Input, Label, Textarea } from '@snake-rescue/ui';

const STEPS = ['Contact Info', 'Location', 'Details', 'Submit'];
const MUNICIPALITIES = ['Butwal', 'Tilottama', 'Siddharthanagar', 'Devdaha', 'Other'];

interface FormData {
  name: string;
  phone: string;
  municipality: string;
  address: string;
  notes: string;
  lat: number | null;
  lng: number | null;
}

interface RescueFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

export function RescueForm({ onSubmit, loading = false }: RescueFormProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    municipality: 'Butwal',
    address: '',
    notes: '',
    lat: null,
    lng: null,
  });
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  const update = (field: keyof FormData, value: string | number | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const getLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        update('lat', pos.coords.latitude);
        update('lng', pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError('Could not get GPS. Enter address manually.');
      },
      { timeout: 10000 }
    );
  };

  const validateStep = () => {
    if (step === 0 && (!form.name.trim() || !form.phone.trim())) {
      setError('Please enter your name and phone number.');
      return false;
    }
    if (step === 1 && !form.address.trim()) {
      setError('Please provide your address or use GPS.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    await onSubmit(form);
  };

  return (
    <div className="space-y-8">
      {/* Step Indicators */}
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary z-0 transition-all duration-500"
          style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-col items-center z-10 relative">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step
                  ? 'bg-primary border-primary text-primary-foreground'
                  : i === step
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-background border-muted text-muted-foreground'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                i === step ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* Step 1: Contact Info */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Your Contact Details</h2>
                  <p className="text-muted-foreground text-sm">So our team can reach you</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="pl-10"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Your Location</h2>
                  <p className="text-muted-foreground text-sm">Where is the snake sighting?</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Municipality</Label>
                <div className="grid grid-cols-3 gap-2">
                  {MUNICIPALITIES.map(m => (
                    <Button
                      key={m}
                      type="button"
                      variant={form.municipality === m ? 'default' : 'outline'}
                      onClick={() => update('municipality', m)}
                      className="w-full"
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                onClick={getLocation}
                disabled={locating}
                variant="outline"
                className="w-full"
              >
                {locating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="mr-2 h-4 w-4" />
                )}
                {locating ? 'Getting GPS location…' : 'Use My Current GPS Location'}
              </Button>

              {form.lat && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-sm text-primary text-center">
                  ✓ GPS: {form.lat.toFixed(5)}, {form.lng?.toFixed(5)}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="address">Address / Landmark *</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  placeholder="e.g. Near Buddha Chowk, opposite petrol pump, house no. 45..."
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Details */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Additional Details</h2>
                  <p className="text-muted-foreground text-sm">Optional but helpful for our team</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  Any notes (snake description, is anyone bitten, etc.)
                </Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  placeholder="e.g. Black snake about 1 meter, coiled near drain. No one bitten."
                  rows={4}
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-semibold mb-1">If someone is bitten:</p>
                    <p className="text-yellow-300/80">
                      Go to Lumbini Provincial Hospital immediately. Do NOT suck the venom or apply
                      tourniquet.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Review & Submit</h2>
                  <p className="text-muted-foreground text-sm">Confirm details before submitting</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Name', value: form.name },
                  { label: 'Phone', value: form.phone },
                  { label: 'Municipality', value: form.municipality },
                  { label: 'Address', value: form.address },
                  { label: 'Notes', value: form.notes || '(Not provided)' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {form.lat && (
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-lg p-3 border border-primary/20">
                  <Navigation className="w-4 h-4" />
                  GPS: {form.lat.toFixed(5)}, {form.lng?.toFixed(5)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-destructive/20 border border-destructive/40 rounded-lg p-3 text-destructive text-sm"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={nextStep} className="flex-1">
            Continue →
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Submitting…' : 'Submit Emergency Request'}
          </Button>
        )}
      </div>
    </div>
  );
}