'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { gql } from '@apollo/client';
import {
  Bell,
  Clock3,
  DollarSign,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  MapPin,
  Save,
  ShieldCheck,
  SquarePen,
  UserRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery } from '@/lib/apollo/hooks';
import { CHANGE_PASSWORD_MUTATION } from '@/lib/graphql/mutations/auth.mutations';
import { useMyFinance } from '@/lib/graphql/hooks/finance.hooks';
import {
  useMyProfileQuery,
  useUpdateUserProfileMutation,
} from '@/lib/graphql/hooks/user.hooks';
import {
  useMyVolunteerProfileQuery,
  useUpdateVolunteerProfileMutation,
} from '@/lib/graphql/hooks/volunteer.hooks';
import { toast } from 'sonner';
import { MediaUploader } from '@/components/media/MediaUploader';

type Preferences = {
  highPriorityRescueAlerts: boolean;
  rescueCompletionNotifications: boolean;
  systemAlerts: boolean;
  enableApp: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
};
type RescueSettings = {
  experience: string;
  experienceYears: number;
  municipality: string;
  ward: number;
  vehicle: string;
  vehicleDetails: string;
  availableTime: string;
  coverageRadius: number;
  isAvailableNow: boolean;
  emergencyAvailability: boolean;
  equipment: string;
};
type DailyAvailability = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
};
const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
const DEFAULT_SCHEDULE: DailyAvailability[] = DAYS_OF_WEEK.map((day) => ({
  day,
  enabled: day !== 'Sunday',
  startTime: '09:00',
  endTime: '17:00',
}));
const defaultPreferences: Preferences = {
  highPriorityRescueAlerts: true,
  rescueCompletionNotifications: true,
  systemAlerts: true,
  enableApp: true,
  enableEmail: true,
  enableSMS: false,
};
const defaultSettings: RescueSettings = {
  experience: '',
  experienceYears: 0,
  municipality: '',
  ward: 0,
  vehicle: 'NONE',
  vehicleDetails: '',
  availableTime: 'ANYTIME',
  coverageRadius: 20,
  isAvailableNow: false,
  emergencyAvailability: true,
  equipment: '',
};
const EXPERIENCE_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'EXPERT', label: 'Expert' },
] as const;
const VEHICLE_TYPES = [
  { value: 'NONE', label: 'None' },
  { value: 'BIKE', label: 'Bike' },
  { value: 'CAR', label: 'Car' },
  { value: 'BOTH', label: 'Bike and car' },
] as const;
const EQUIPMENT_OPTIONS = [
  'Snake hook',
  'Snake tongs',
  'Rescue bag',
  'Protective gloves',
  'Flashlight',
  'First aid kit',
] as const;
const preferencesQuery = gql`
  query RescuerPreferences {
    myNotificationPreferences {
      highPriorityRescueAlerts
      rescueCompletionNotifications
      systemAlerts
      enableApp
      enableEmail
      enableSMS
    }
  }
`;
const updatePreferencesMutation = gql`
  mutation UpdateRescuerPreferences(
    $input: UpdateNotificationPreferencesInput!
  ) {
    updateNotificationPreferences(input: $input) {
      highPriorityRescueAlerts
      rescueCompletionNotifications
      systemAlerts
      enableApp
      enableEmail
      enableSMS
    }
  }
`;

const NAV_ITEMS = [
  { value: 'profile', label: 'Profile', icon: UserRound },
  { value: 'rescue', label: 'Rescue Profile', icon: ShieldCheck },
  { value: 'availability', label: 'Availability', icon: Clock3 },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'location', label: 'Location & Coverage', icon: MapPin },
  { value: 'payments', label: 'Payments & Earnings', icon: DollarSign },
  { value: 'security', label: 'Security', icon: KeyRound },
] as const;

function Section({
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div>
            <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="mt-5 sm:mt-6">{children}</div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 border-b border-border py-4 last:border-0">
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {description && (
          <span className="mt-1 block text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-primary disabled:opacity-50"
      />
    </label>
  );
}

function ToggleGroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

export default function RescuerSettingsPage() {
  const [section, setSection] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [availabilitySchedule, setAvailabilitySchedule] =
    useState<DailyAvailability[]>(DEFAULT_SCHEDULE);
  const [otherEquipment, setOtherEquipment] = useState('');
  const [account, setAccount] = useState({ name: '', avatar: '' });
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [password, setPassword] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [visiblePasswords, setVisiblePasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const { data: userData, refetch: refetchUser } = useMyProfileQuery({
    fetchPolicy: 'cache-and-network',
  });
  const {
    data: volunteerData,
    loading,
    error,
    refetch,
  } = useMyVolunteerProfileQuery({ fetchPolicy: 'cache-and-network' });
  const { data: preferenceData, loading: preferencesLoading } = useQuery<{
    myNotificationPreferences: Partial<Preferences>;
  }>(preferencesQuery, { fetchPolicy: 'cache-and-network' });
  const { data: financeData } = useMyFinance({
    pagination: { page: 1, limit: 10 },
  });
  const [updateProfile, { loading: saving }] =
    useUpdateVolunteerProfileMutation();
  const [updateUserProfile, { loading: savingAccount }] =
    useUpdateUserProfileMutation();
  const [updatePreferences, { loading: savingPreferences }] = useMutation(
    updatePreferencesMutation,
  );
  const [changePassword, { loading: changingPassword }] = useMutation(
    CHANGE_PASSWORD_MUTATION,
  );
  const profile = volunteerData?.myVolunteerProfile;

  useEffect(() => {
    if (profile) {
      const equipment = profile.equipment || [];
      const standardEquipment = equipment.filter((item) =>
        EQUIPMENT_OPTIONS.includes(item as (typeof EQUIPMENT_OPTIONS)[number]),
      );
      setOtherEquipment(
        equipment
          .filter(
            (item) =>
              !EQUIPMENT_OPTIONS.includes(
                item as (typeof EQUIPMENT_OPTIONS)[number],
              ),
          )
          .join(', '),
      );
      setAvailabilitySchedule(
        DAYS_OF_WEEK.map(
          (day) =>
            profile.availabilitySchedule?.find((entry) => entry.day === day) ||
            DEFAULT_SCHEDULE[DAYS_OF_WEEK.indexOf(day)],
        ),
      );
      setSettings({
        experience: profile.experience || '',
        experienceYears: profile.experienceYears || 0,
        municipality: profile.municipality || '',
        ward: profile.ward || 0,
        vehicle: profile.vehicle || 'NONE',
        vehicleDetails: profile.vehicleDetails || '',
        availableTime: profile.availableTime || 'ANYTIME',
        coverageRadius: profile.coverageRadius || 20,
        isAvailableNow: profile.isAvailableNow,
        emergencyAvailability: profile.emergencyAvailability ?? true,
        equipment: standardEquipment.join(', '),
      });
    }
  }, [profile]);
  useEffect(() => {
    if (userData?.me) {
      setAccount({
        name: userData.me.name,
        avatar: userData.me.avatar || '',
      });
    }
  }, [userData]);
  useEffect(() => {
    if (preferenceData?.myNotificationPreferences)
      setPreferences({
        ...defaultPreferences,
        ...preferenceData.myNotificationPreferences,
      });
  }, [preferenceData]);

  const saveSettings = async (): Promise<void> => {
    if (!settings.experience || !settings.municipality) {
      toast.error('Experience and municipality are required');
      return;
    }
    try {
      await updateProfile({
        variables: {
          input: {
            ...settings,
            ward: settings.ward || undefined,
            experienceYears: settings.experienceYears || undefined,
            coverageRadius: settings.coverageRadius || undefined,
            vehicleDetails: settings.vehicleDetails || undefined,
            equipment: [
              ...settings.equipment
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
              ...otherEquipment
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
            ],
            availabilitySchedule,
          },
        },
      });
      toast.success('Rescue settings saved');
      setEditing(false);
      await refetch();
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save settings',
      );
    }
  };

  const toggleEquipment = (equipment: string, checked: boolean) => {
    const selected = settings.equipment
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const next = checked
      ? [...new Set([...selected, equipment])]
      : selected.filter((item) => item !== equipment);
    setSettings({ ...settings, equipment: next.join(', ') });
  };
  const updateSchedule = (day: string, changes: Partial<DailyAvailability>) => {
    setAvailabilitySchedule((current) =>
      current.map((entry) =>
        entry.day === day ? { ...entry, ...changes } : entry,
      ),
    );
  };
  const saveAccount = async (): Promise<void> => {
    if (!account.name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      await updateUserProfile({
        variables: {
          input: {
            name: account.name.trim(),
            avatar: account.avatar || undefined,
          },
        },
      });
      toast.success('Profile updated');
      await refetchUser();
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to update profile',
      );
    }
  };
  const savePreferences = async () => {
    try {
      await updatePreferences({ variables: { input: preferences } });
      toast.success('Notification preferences saved');
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save notifications',
      );
    }
  };
  const savePassword = async (): Promise<void> => {
    if (password.next.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (password.next !== password.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await changePassword({
        variables: {
          input: {
            currentPassword: password.current,
            newPassword: password.next,
          },
        },
      });
      toast.success('Password changed successfully');
      setPassword({ current: '', next: '', confirm: '' });
    } catch (passwordError) {
      toast.error(
        passwordError instanceof Error
          ? passwordError.message
          : 'Unable to change password',
      );
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (error || !profile)
    return (
      <Card className="mx-auto m-4 max-w-2xl p-6 sm:m-6">
        <p className="font-semibold">Unable to load rescuer settings</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message || 'Your account is not linked to a rescuer profile.'}
        </p>
      </Card>
    );
  const settled =
    financeData?.mySettlements?.edges.reduce(
      (sum, edge) => sum + Number(edge.node.amount),
      0,
    ) || 0;
  const paid =
    financeData?.myPayouts?.edges
      .filter((edge) => edge.node.status === 'PAID')
      .reduce((sum, edge) => sum + Number(edge.node.amount), 0) || 0;

  const showFooterBar =
    editing ||
    section === 'rescue' ||
    section === 'availability' ||
    section === 'location';
  const editAction = !editing ? (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="shrink-0 rounded-lg"
      aria-label="Edit rescue settings"
      title="Edit rescue settings"
      onClick={() => setEditing(true)}
    >
      <SquarePen className="h-4 w-4" />
    </Button>
  ) : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 pb-28 sm:p-6 lg:pb-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm">
          Rescuer account
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Manage your SnakeSOS profile and rescue preferences.
        </p>
      </header>

      <Tabs
        value={section}
        onValueChange={setSection}
        className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start"
      >
        {/* Mobile / tablet: horizontal scrollable pill nav */}
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0 lg:hidden">
          {NAV_ITEMS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="shrink-0 gap-2 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Desktop: sticky sidebar nav */}
        <TabsList className="sticky top-6 hidden h-auto w-full flex-col items-stretch justify-start gap-2 self-start rounded-xl border border-border bg-card p-3 shadow-sm lg:flex">
          {NAV_ITEMS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="group min-h-12 w-full justify-start gap-3 rounded-lg border border-transparent px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0 space-y-6">
          <TabsContent value="profile" className="mt-0 space-y-6">
            <Section
              icon={UserRound}
              title="Profile"
              description="Identity details are controlled by your authenticated account."
              action={editAction}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 flex flex-wrap items-center gap-5">
                  <Avatar className="h-20 w-20 border-2 border-border">
                    {account.avatar ? (
                      <AvatarImage src={account.avatar} alt={account.name} />
                    ) : null}
                    <AvatarFallback>
                      {account.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <Label>Profile image</Label>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3">
                      <MediaUploader
                        mediaType="RESCUER_PROFILE_IMAGE"
                        accept="image/jpeg,image/png,image/webp"
                        label={account.avatar ? 'Change image' : 'Upload image'}
                        disabled={!editing}
                        onUploaded={(media) => {
                          if (media.secureUrl) {
                            setAccount((current) => ({
                              ...current,
                              avatar: media.secureUrl || '',
                            }));
                          }
                          toast.success('Profile image uploaded');
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {account.avatar
                          ? 'Replace your current photo'
                          : 'Add a profile photo'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG, or WebP up to 5 MB.
                    </p>
                  </div>
                </div>
                <Field label="Full name">
                  <Input
                    value={account.name}
                    disabled={!editing}
                    onChange={(event) =>
                      setAccount({ ...account, name: event.target.value })
                    }
                  />
                </Field>
                <Field label="Email">
                  <Input value={userData?.me?.email || ''} disabled />
                </Field>
                <Field label="Phone">
                  <Input value={userData?.me?.phone || 'Not set'} disabled />
                </Field>
                <Field label="Status">
                  <div className="pt-2">
                    <Badge variant="outline">
                      {userData?.me?.status || 'ACTIVE'}
                    </Badge>
                  </div>
                </Field>
              </div>
              <div className="mt-5 flex justify-end">
                {editing ? (
                  <Button
                    onClick={() => void saveAccount()}
                    disabled={savingAccount}
                  >
                    {savingAccount && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save profile
                  </Button>
                ) : null}
              </div>
            </Section>
            <Section
              icon={ShieldCheck}
              title="Verification"
              description="Verification status cannot be changed from this page."
            >
              <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
                <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
                <div>
                  <p className="font-semibold">
                    {profile.status === 'VERIFIED'
                      ? 'Verified Rescuer'
                      : 'Verification Pending'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Managed by SnakeSOS administrators.
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-border p-4">
                <p className="text-sm font-medium">Verification document</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Upload a supporting document for administrator review. It
                  remains private.
                </p>
                <div className="mt-3">
                  <MediaUploader
                    mediaType="RESCUER_VERIFICATION_DOCUMENT"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    label="Upload document"
                    onUploaded={() =>
                      toast.success('Verification document uploaded')
                    }
                  />
                </div>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="rescue" className="mt-0">
            <Section
              icon={ShieldCheck}
              title="Rescue profile"
              description="These details help dispatchers assign suitable requests."
              action={editAction}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Experience level">
                  <Select
                    value={settings.experience}
                    onValueChange={(value) =>
                      setSettings({ ...settings, experience: value })
                    }
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Years of experience">
                  <Input
                    type="number"
                    min="0"
                    value={settings.experienceYears}
                    disabled={!editing}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        experienceYears: Number(event.target.value) || 0,
                      })
                    }
                  />
                </Field>
                <Field label="Vehicle">
                  <Select
                    value={settings.vehicle}
                    onValueChange={(value) =>
                      setSettings({ ...settings, vehicle: value })
                    }
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map((vehicle) => (
                        <SelectItem key={vehicle.value} value={vehicle.value}>
                          {vehicle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Vehicle details">
                  <Input
                    value={settings.vehicleDetails}
                    disabled={!editing}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        vehicleDetails: event.target.value,
                      })
                    }
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Equipment">
                    <div className="grid gap-3 rounded-md border border-border bg-muted/20 p-4 sm:grid-cols-2">
                      {EQUIPMENT_OPTIONS.map((equipment) => {
                        const checked = settings.equipment
                          .split(',')
                          .map((item) => item.trim())
                          .includes(equipment);
                        return (
                          <label
                            key={equipment}
                            className="flex items-center gap-3 text-sm"
                          >
                            <Checkbox
                              checked={checked}
                              disabled={!editing}
                              onCheckedChange={(value) =>
                                toggleEquipment(equipment, value === true)
                              }
                            />
                            {equipment}
                          </label>
                        );
                      })}
                      <label className="flex items-center gap-3 text-sm">
                        <Checkbox
                          checked={Boolean(otherEquipment)}
                          disabled={!editing}
                          onCheckedChange={(value) => {
                            if (!value) setOtherEquipment('');
                          }}
                        />
                        Other equipment
                      </label>
                      <Input
                        value={otherEquipment}
                        disabled={!editing}
                        placeholder="Enter other equipment"
                        onChange={(event) =>
                          setOtherEquipment(event.target.value)
                        }
                        className="sm:col-span-2"
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="availability" className="mt-0">
            <Section
              icon={Clock3}
              title="Availability"
              description="Control which requests can be assigned to you."
              action={editAction}
            >
              <Toggle
                label={
                  settings.isAvailableNow
                    ? 'Available for rescue requests'
                    : 'Currently unavailable'
                }
                description={
                  settings.isAvailableNow
                    ? 'You can receive new assignments.'
                    : 'You will not receive new assignments.'
                }
                checked={settings.isAvailableNow}
                disabled={!editing}
                onChange={(value) =>
                  setSettings({ ...settings, isAvailableNow: value })
                }
              />
              <Toggle
                label="Available for emergency dispatches"
                checked={settings.emergencyAvailability}
                disabled={!editing}
                onChange={(value) =>
                  setSettings({ ...settings, emergencyAvailability: value })
                }
              />
              <div className="mt-6 border-t border-border pt-6">
                <div className="mb-4">
                  <h3 className="font-semibold">Working hours</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Set the hours when you can accept rescue assignments.
                  </p>
                </div>
                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="hidden grid-cols-[1.2fr_1fr_1fr] gap-4 border-b border-border bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
                    <span>Day</span>
                    <span>Start</span>
                    <span>End</span>
                  </div>
                  <div className="divide-y divide-border">
                    {availabilitySchedule.map((entry) => (
                      <div
                        key={entry.day}
                        className="grid gap-3 px-4 py-3 sm:grid-cols-[1.2fr_1fr_1fr] sm:items-center sm:gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={entry.enabled}
                            disabled={!editing}
                            onCheckedChange={(value) =>
                              updateSchedule(entry.day, {
                                enabled: value === true,
                              })
                            }
                          />
                          <span className="font-medium">{entry.day}</span>
                          {!entry.enabled && (
                            <span className="text-xs text-muted-foreground">
                              Unavailable
                            </span>
                          )}
                        </div>
                        <label className="flex items-center gap-2 text-sm sm:block">
                          <span className="w-12 text-muted-foreground sm:hidden">
                            Start
                          </span>
                          <Input
                            type="time"
                            value={entry.startTime}
                            disabled={!editing || !entry.enabled}
                            onChange={(event) =>
                              updateSchedule(entry.day, {
                                startTime: event.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="flex items-center gap-2 text-sm sm:block">
                          <span className="w-12 text-muted-foreground sm:hidden">
                            End
                          </span>
                          <Input
                            type="time"
                            value={entry.endTime}
                            disabled={!editing || !entry.enabled}
                            onChange={(event) =>
                              updateSchedule(entry.day, {
                                endTime: event.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Section
              icon={Bell}
              title="Notifications"
              description="Security alerts remain mandatory."
              action={
                <Button
                  onClick={() => void savePreferences()}
                  disabled={preferencesLoading || savingPreferences}
                  className="w-full sm:w-auto"
                >
                  {savingPreferences ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save notifications
                </Button>
              }
            >
              <ToggleGroupLabel>Alerts</ToggleGroupLabel>
              <Toggle
                label="High-priority rescue alerts"
                checked={preferences.highPriorityRescueAlerts}
                onChange={(value) =>
                  setPreferences({
                    ...preferences,
                    highPriorityRescueAlerts: value,
                  })
                }
              />
              <Toggle
                label="Rescue completion updates"
                checked={preferences.rescueCompletionNotifications}
                onChange={(value) =>
                  setPreferences({
                    ...preferences,
                    rescueCompletionNotifications: value,
                  })
                }
              />
              <Toggle
                label="System and security alerts"
                checked={preferences.systemAlerts}
                disabled
                onChange={() => undefined}
              />

              <div className="pt-5">
                <ToggleGroupLabel>Delivery channels</ToggleGroupLabel>
                <Toggle
                  label="App notifications"
                  checked={preferences.enableApp}
                  onChange={(value) =>
                    setPreferences({ ...preferences, enableApp: value })
                  }
                />
                <Toggle
                  label="Email notifications"
                  checked={preferences.enableEmail}
                  onChange={(value) =>
                    setPreferences({ ...preferences, enableEmail: value })
                  }
                />
                <Toggle
                  label="SMS notifications"
                  checked={preferences.enableSMS}
                  onChange={(value) =>
                    setPreferences({ ...preferences, enableSMS: value })
                  }
                />
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="location" className="mt-0">
            <Section
              icon={MapPin}
              title="Location & coverage"
              description="Your precise live location is not displayed here."
              action={editAction}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Municipality">
                  <Input
                    value={settings.municipality}
                    disabled={!editing}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        municipality: event.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="Ward">
                  <Input
                    type="number"
                    value={settings.ward || ''}
                    disabled={!editing}
                    onChange={(event) =>
                      setSettings({
                        ...settings,
                        ward: Number(event.target.value) || 0,
                      })
                    }
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    label={`Service radius: ${settings.coverageRadius} km`}
                  >
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={settings.coverageRadius}
                      disabled={!editing}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          coverageRadius: Number(event.target.value),
                        })
                      }
                      className="mt-3 w-full accent-primary disabled:opacity-50"
                    />
                  </Field>
                </div>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                Citizens outside your coverage may not see you as a recommended
                rescuer.
              </p>
            </Section>
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <Section
              icon={DollarSign}
              title="Payments & earnings"
              description="Financial values come from the finance service and cannot be edited here."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Settled earnings shown
                  </p>
                  <p className="mt-1 text-xl font-bold sm:text-2xl">
                    NPR {settled.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Paid out shown
                  </p>
                  <p className="mt-1 text-xl font-bold sm:text-2xl">
                    NPR {paid.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    window.location.assign('/dashboard/rescuer/earnings')
                  }
                >
                  View earnings
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    window.location.assign('/dashboard/rescuer/history')
                  }
                >
                  View history
                </Button>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="security" className="mt-0 space-y-6">
            <Section
              icon={KeyRound}
              title="Security"
              description="Change your password with server-side verification."
            >
              <div className="max-w-xl space-y-4">
                <Field label="Current password">
                  <div className="relative">
                    <Input
                      type={visiblePasswords.current ? 'text' : 'password'}
                      value={password.current}
                      onChange={(event) =>
                        setPassword({
                          ...password,
                          current: event.target.value,
                        })
                      }
                      className="pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                      aria-label={
                        visiblePasswords.current
                          ? 'Hide current password'
                          : 'Show current password'
                      }
                      title={
                        visiblePasswords.current
                          ? 'Hide current password'
                          : 'Show current password'
                      }
                      onClick={() =>
                        setVisiblePasswords((current) => ({
                          ...current,
                          current: !current.current,
                        }))
                      }
                    >
                      {visiblePasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Field>
                <Field label="New password">
                  <div className="relative">
                    <Input
                      type={visiblePasswords.next ? 'text' : 'password'}
                      value={password.next}
                      onChange={(event) =>
                        setPassword({ ...password, next: event.target.value })
                      }
                      className="pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                      aria-label={
                        visiblePasswords.next
                          ? 'Hide new password'
                          : 'Show new password'
                      }
                      title={
                        visiblePasswords.next
                          ? 'Hide new password'
                          : 'Show new password'
                      }
                      onClick={() =>
                        setVisiblePasswords((current) => ({
                          ...current,
                          next: !current.next,
                        }))
                      }
                    >
                      {visiblePasswords.next ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Field>
                <Field label="Confirm new password">
                  <div className="relative">
                    <Input
                      type={visiblePasswords.confirm ? 'text' : 'password'}
                      value={password.confirm}
                      onChange={(event) =>
                        setPassword({
                          ...password,
                          confirm: event.target.value,
                        })
                      }
                      className="pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                      aria-label={
                        visiblePasswords.confirm
                          ? 'Hide password confirmation'
                          : 'Show password confirmation'
                      }
                      title={
                        visiblePasswords.confirm
                          ? 'Hide password confirmation'
                          : 'Show password confirmation'
                      }
                      onClick={() =>
                        setVisiblePasswords((current) => ({
                          ...current,
                          confirm: !current.confirm,
                        }))
                      }
                    >
                      {visiblePasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Field>
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => void savePassword()}
                  disabled={changingPassword}
                >
                  {changingPassword && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Change password
                </Button>
              </div>
            </Section>
            <Card className="border-destructive/30 bg-destructive/5 p-4 sm:p-6">
              <h2 className="font-semibold text-destructive">Danger zone</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Contact SnakeSOS support to deactivate or delete an account
                while preserving required records.
              </p>
            </Card>
          </TabsContent>

          {showFooterBar && (
            <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 p-3 backdrop-blur supports-backdrop-filter:bg-background/80 lg:static lg:z-auto lg:border-t lg:bg-transparent lg:p-0 lg:pt-5 lg:backdrop-blur-none">
              <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:justify-end">
                {editing && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                )}
                {editing && (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => void saveSettings()}
                    disabled={saving}
                  >
                    {saving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save rescue settings
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
