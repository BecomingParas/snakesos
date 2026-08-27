'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertCircle,
  Phone,
  MapPin,
  Clock,
  Save,
  Edit,
  Loader2,
  UserPlus,
} from 'lucide-react';
import {
  useEmergencyContactQuery,
  useSaveEmergencyContactMutation,
} from '@/lib/graphql/hooks/user.hooks';
import { toast } from 'sonner';

/**
 * Emergency Page
 * Quick access emergency contacts and snake bite first aid - NOW WITH GRAPHQL INTEGRATION ✅
 */

export default function EmergencyPage() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  // Fetch emergency contact
  const {
    data,
    loading: loadingContact,
    error,
    refetch,
  } = useEmergencyContactQuery({
    fetchPolicy: 'cache-and-network',
  });

  const emergencyContact = data?.myEmergencyContact;

  // Save emergency contact mutation
  const [saveContact, { loading: saving }] = useSaveEmergencyContactMutation({
    onCompleted: () => {
      toast.success('Emergency contact saved successfully!');
      setEditing(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  // Populate form when contact loads
  useEffect(() => {
    if (emergencyContact) {
      setFormData({
        name: emergencyContact.name,
        phone: emergencyContact.phone,
        relationship: emergencyContact.relationship,
      });
    }
  }, [emergencyContact]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }

    await saveContact({
      variables: {
        input: {
          name: formData.name,
          phone: formData.phone,
          relationship: formData.relationship || 'Family',
        },
      },
    });
  };

  if (error) {
    toast.error(`Failed to load emergency contact: ${error.message}`);
  }

  const isLoading = loadingContact || saving;
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Emergency
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Quick access to emergency contacts and snake bite first aid
        </p>
      </div>

      <Card className="border-destructive/40 bg-destructive/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Need a snake rescue now?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Submit an emergency request so admins and rescuers are notified
              immediately.
            </p>
          </div>
          <Button asChild variant="destructive" className="shrink-0">
            <Link href="/dashboard/citizen/request?emergency=true">
              <AlertCircle className="mr-2 h-4 w-4" />
              Request Emergency Rescue
            </Link>
          </Button>
        </div>
      </Card>

      {/* Personal Emergency Contact */}
      <Card className="p-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Your Emergency Contact
            </h2>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Person to contact in case of emergency
            </p>
          </div>
          {!editing && emergencyContact && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="border-blue-600 text-blue-700 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {loadingContact ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : editing || !emergencyContact ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="contactName"
                  className="text-blue-900 dark:text-blue-100"
                >
                  Name
                </Label>
                <Input
                  id="contactName"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Emergency contact name"
                  className="bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <Label
                  htmlFor="contactPhone"
                  className="text-blue-900 dark:text-blue-100"
                >
                  Phone
                </Label>
                <Input
                  id="contactPhone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Emergency contact phone"
                  className="bg-white dark:bg-gray-900"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="contactRelationship"
                className="text-blue-900 dark:text-blue-100"
              >
                Relationship
              </Label>
              <Input
                id="contactRelationship"
                value={formData.relationship}
                onChange={(e) =>
                  setFormData({ ...formData, relationship: e.target.value })
                }
                placeholder="e.g., Spouse, Parent, Sibling"
                className="bg-white dark:bg-gray-900"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Contact
              </Button>
              {emergencyContact && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: emergencyContact.name,
                      phone: emergencyContact.phone,
                      relationship: emergencyContact.relationship,
                    });
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  {emergencyContact.name}
                </span>
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  ({emergencyContact.relationship})
                </span>
              </div>
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Phone className="h-4 w-4" />
                <a
                  href={`tel:${emergencyContact.phone}`}
                  className="hover:underline"
                >
                  {emergencyContact.phone}
                </a>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Emergency Contacts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-red-200 bg-card p-6 dark:border-red-900">
          <div className="flex items-start gap-4">
            <Phone className="mt-1 h-6 w-6 shrink-0 text-red-600" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                Emergency Ambulance
              </h2>
              <p className="text-red-800 dark:text-red-200 mb-4">
                For immediate medical emergency
              </p>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={() => (window.location.href = 'tel:102')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call 102
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-orange-200 bg-card p-6 dark:border-orange-900">
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-orange-600" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-2">
                Snake Rescue Hotline
              </h2>
              <p className="text-orange-800 dark:text-orange-200 mb-4">
                24/7 snake rescue service
              </p>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => (window.location.href = 'tel:1234567890')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Hotline
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Snake Bite First Aid and hospitals */}
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            Snake Bite First Aid
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-400">
                ✓ DO:
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 mt-0.5 text-green-600" />
                  <span>Call emergency services immediately (102)</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 mt-0.5 text-green-600" />
                  <span>Keep the bitten person calm and still</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-green-600" />
                  <span>Remove jewelry and tight clothing near the bite</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-green-600" />
                  <span>Keep the affected limb below heart level</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-green-600" />
                  <span>Get to hospital as quickly as possible</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-red-700 dark:text-red-400">
                ✗ DON'T:
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
                  <span>Don't apply ice or tourniquet</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
                  <span>Don't cut the bite or try to suck out venom</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
                  <span>Don't give alcohol or medications</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
                  <span>Don't try to catch or kill the snake</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Nearest Hospitals */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Nearest Hospitals with Anti-Venom
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            These hospitals stock anti-venom serum
          </p>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <h3 className="font-semibold">Lumbini Provincial Hospital</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Distance: 2.5 km
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <h3 className="font-semibold">Universal Medical College</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Distance: 4.1 km
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
