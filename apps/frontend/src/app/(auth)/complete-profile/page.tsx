'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Loader2,
  AlertCircle,
  Upload,
  MapPin,
  Briefcase,
  UserCircle,
} from 'lucide-react';
import { Button, Label, Input, Textarea, PhoneInput } from '@snake-rescue/ui';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { AuthCard } from '../../../components/auth/AuthCard';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    avatar: '',
    address: '',
    city: '',
    district: '',
    emergencyContact: '',
    emergencyName: '',
    occupation: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock API call - replace with actual GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Complete Your Profile"
        subtitle="Help us personalize your rescue experience"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Profile Picture */}
          <div className="space-y-3">
            <Label className="text-gray-300">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-12 h-12 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label htmlFor="avatar">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/5"
                    onClick={() => document.getElementById('avatar')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-300">
              Street Address
            </Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                id="address"
                type="text"
                placeholder="Enter your street address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* City & District */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-300">
                City
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="Kathmandu"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district" className="text-gray-300">
                District
              </Label>
              <Input
                id="district"
                type="text"
                placeholder="Kathmandu"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-400 font-semibold">
              Emergency Contact
            </p>
            <div className="space-y-2">
              <Label htmlFor="emergencyName" className="text-gray-300 text-xs">
                Contact Name
              </Label>
              <Input
                id="emergencyName"
                type="text"
                placeholder="Full name"
                value={formData.emergencyName}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyName: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <PhoneInput
              id="emergencyContact"
              label=""
              placeholder="+977 98XXXXXXXX"
              value={formData.emergencyContact}
              onChange={(e) =>
                setFormData({ ...formData, emergencyContact: e.target.value })
              }
            />
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-gray-300">
              Occupation (Optional)
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                id="occupation"
                type="text"
                placeholder="e.g. Wildlife Enthusiast, Student, etc."
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">
              About You (Optional)
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us a bit about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-6 rounded-xl transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving profile...
                </>
              ) : (
                'Complete Profile'
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-gray-400 hover:text-white hover:bg-white/5 py-6 rounded-xl"
            >
              Skip for Now
            </Button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
