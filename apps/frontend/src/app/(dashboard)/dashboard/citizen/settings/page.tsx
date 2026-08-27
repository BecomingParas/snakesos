'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { gql } from '@apollo/client';
import {
  Bell,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Save,
  Shield,
  SquarePen,
  UserRound,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery } from '@/lib/apollo/hooks';
import { CHANGE_PASSWORD_MUTATION } from '@/lib/graphql/mutations/auth.mutations';
import {
  useMyProfileQuery,
  useUpdateUserProfileMutation,
} from '@/lib/graphql/hooks/user.hooks';
import { toast } from 'sonner';
import { MediaUploader } from '@/components/media/MediaUploader';

const preferencesQuery = gql`
  query CitizenPreferences {
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
  mutation UpdateCitizenPreferences(
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

type Preferences = {
  highPriorityRescueAlerts: boolean;
  rescueCompletionNotifications: boolean;
  systemAlerts: boolean;
  enableApp: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
};

const defaultPreferences: Preferences = {
  highPriorityRescueAlerts: true,
  rescueCompletionNotifications: true,
  systemAlerts: true,
  enableApp: true,
  enableEmail: true,
  enableSMS: false,
};

function Section({
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  description: string;
  icon: typeof UserRound;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
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

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 border-b border-border py-4 last:border-0">
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
      />
    </label>
  );
}

export default function CitizenSettingsPage() {
  const [section, setSection] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [account, setAccount] = useState({ name: '', phone: '', avatar: '' });
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [password, setPassword] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [visible, setVisible] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const { data, loading, refetch } = useMyProfileQuery({
    fetchPolicy: 'cache-and-network',
  });
  const { data: preferenceData } = useQuery<{
    myNotificationPreferences: Partial<Preferences>;
  }>(preferencesQuery, { fetchPolicy: 'cache-and-network' });
  const [updateProfile, { loading: saving }] = useUpdateUserProfileMutation();
  const [updatePreferences, { loading: savingPreferences }] = useMutation(
    updatePreferencesMutation,
  );
  const [changePassword, { loading: changingPassword }] = useMutation(
    CHANGE_PASSWORD_MUTATION,
  );
  const user = data?.me;

  useEffect(() => {
    if (!user) return;
    setAccount({
      name: user.name || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
    });
  }, [user]);
  useEffect(() => {
    if (!preferenceData?.myNotificationPreferences) return;
    setPreferences({
      ...defaultPreferences,
      ...preferenceData.myNotificationPreferences,
    });
  }, [preferenceData]);

  const saveProfile = async () => {
    if (!account.name.trim()) {
      toast.error('Name is required');
      return;
    }
    await updateProfile({
      variables: {
        input: {
          name: account.name.trim(),
          phone: account.phone.trim() || undefined,
          avatar: account.avatar || undefined,
        },
      },
    });
    toast.success('Profile updated successfully');
    setEditing(false);
    await refetch();
  };

  const savePreferences = async () => {
    await updatePreferences({ variables: { input: preferences } });
    toast.success('Notification preferences saved');
  };

  const submitPassword = async () => {
    if (password.next.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (password.next !== password.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    await changePassword({
      variables: {
        currentPassword: password.current,
        newPassword: password.next,
      },
    });
    toast.success('Password changed successfully');
    setPassword({ current: '', next: '', confirm: '' });
  };

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-6 p-3 pb-28 sm:p-6 lg:pb-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm">
          Citizen account
        </p>
        <h1 className="mt-2 flex items-center gap-3 text-2xl font-bold sm:text-3xl">
          <Shield className="h-7 w-7 text-primary" />
          Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile, notifications, and account security.
        </p>
      </header>

      <Tabs
        value={section}
        onValueChange={setSection}
        className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start"
      >
        <TabsList className="flex h-auto w-full flex-wrap items-center justify-start gap-2 rounded-xl border border-border bg-card p-3 shadow-sm lg:hidden">
          <TabsTrigger value="profile" className="h-10 gap-2 rounded-lg px-3">
            <UserRound className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="h-10 gap-2 rounded-lg px-3"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="h-10 gap-2 rounded-lg px-3">
            <KeyRound className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        <TabsList className="sticky top-6 hidden h-auto w-full flex-col items-stretch gap-2 rounded-xl border border-border bg-card p-3 shadow-sm lg:flex">
          <TabsTrigger
            value="profile"
            className="min-h-12 justify-start gap-3 rounded-lg px-4 py-3"
          >
            <UserRound className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="min-h-12 justify-start gap-3 rounded-lg px-4 py-3"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="min-h-12 justify-start gap-3 rounded-lg px-4 py-3"
          >
            <KeyRound className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <div className="min-w-0 space-y-6">
          <TabsContent value="profile" className="mt-0">
            {user && (
              <Section
                title="Personal information"
                description="Keep your contact details up to date."
                icon={UserRound}
                action={
                  <Button
                    variant={editing ? 'default' : 'outline'}
                    onClick={() =>
                      editing ? void saveProfile() : setEditing(true)
                    }
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <SquarePen className="mr-2 h-4 w-4" />
                    )}
                    {editing ? 'Save changes' : 'Edit profile'}
                  </Button>
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                    <Avatar className="h-20 w-20 border-2 border-border">
                      {account.avatar && (
                        <AvatarImage src={account.avatar} alt={account.name} />
                      )}
                      <AvatarFallback>
                        {account.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <Label>Profile image</Label>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3">
                        <MediaUploader
                          mediaType="CITIZEN_PROFILE_IMAGE"
                          accept="image/jpeg,image/png,image/webp"
                          label={
                            account.avatar ? 'Change image' : 'Upload image'
                          }
                          disabled={!editing}
                          onUploaded={(media) => {
                            if (media.secureUrl)
                              setAccount((current) => ({
                                ...current,
                                avatar: media.secureUrl || '',
                              }));
                            toast.success('Profile image uploaded');
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          JPG, PNG, or WebP up to 5 MB.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Full name</Label>
                    <Input
                      className="mt-1.5"
                      value={account.name}
                      disabled={!editing}
                      onChange={(event) =>
                        setAccount({ ...account, name: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Phone number</Label>
                    <Input
                      className="mt-1.5"
                      value={account.phone}
                      disabled={!editing}
                      onChange={(event) =>
                        setAccount({ ...account, phone: event.target.value })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Email address</Label>
                    <Input className="mt-1.5" value={user.email} disabled />
                  </div>
                </div>
                <div className="mt-6 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Role</span>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-success">
                      {user.status}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      Email verified
                    </span>
                    <span className="font-medium">
                      {user.emailVerified ? 'Yes' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Section>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Section
              title="Notification preferences"
              description="Choose how you receive rescue updates."
              icon={Bell}
              action={
                <Button
                  onClick={() => void savePreferences()}
                  disabled={savingPreferences}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save preferences
                </Button>
              }
            >
              <div>
                <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Alert types
                </p>
                <PreferenceToggle
                  label="High-priority rescue alerts"
                  description="Receive urgent updates about your rescue requests."
                  checked={preferences.highPriorityRescueAlerts}
                  onChange={(value) =>
                    setPreferences({
                      ...preferences,
                      highPriorityRescueAlerts: value,
                    })
                  }
                />
                <PreferenceToggle
                  label="Rescue status updates"
                  description="Know when your request is assigned, accepted, or completed."
                  checked={preferences.rescueCompletionNotifications}
                  onChange={(value) =>
                    setPreferences({
                      ...preferences,
                      rescueCompletionNotifications: value,
                    })
                  }
                />
                <PreferenceToggle
                  label="System alerts"
                  description="Receive important service and account updates."
                  checked={preferences.systemAlerts}
                  onChange={(value) =>
                    setPreferences({ ...preferences, systemAlerts: value })
                  }
                />
              </div>
              <div className="mt-6">
                <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Delivery channels
                </p>
                <PreferenceToggle
                  label="In-app notifications"
                  description="Show updates in your dashboard notification center."
                  checked={preferences.enableApp}
                  onChange={(value) =>
                    setPreferences({ ...preferences, enableApp: value })
                  }
                />
                <PreferenceToggle
                  label="Email notifications"
                  description="Receive rescue updates by email."
                  checked={preferences.enableEmail}
                  onChange={(value) =>
                    setPreferences({ ...preferences, enableEmail: value })
                  }
                />
                <PreferenceToggle
                  label="SMS notifications"
                  description="Receive rescue updates by text message."
                  checked={preferences.enableSMS}
                  onChange={(value) =>
                    setPreferences({ ...preferences, enableSMS: value })
                  }
                />
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Section
              title="Change password"
              description="Use a strong password to protect your account."
              icon={KeyRound}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {(['current', 'next', 'confirm'] as const).map((field) => (
                  <div
                    key={field}
                    className={field === 'current' ? 'sm:col-span-2' : ''}
                  >
                    <Label>
                      {field === 'current'
                        ? 'Current password'
                        : field === 'next'
                          ? 'New password'
                          : 'Confirm new password'}
                    </Label>
                    <div className="relative mt-1.5">
                      <Input
                        type={visible[field] ? 'text' : 'password'}
                        value={password[field]}
                        onChange={(event) =>
                          setPassword({
                            ...password,
                            [field]: event.target.value,
                          })
                        }
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() =>
                          setVisible({ ...visible, [field]: !visible[field] })
                        }
                      >
                        {visible[field] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="mt-5"
                onClick={() => void submitPassword()}
                disabled={changingPassword}
              >
                {changingPassword && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change password
              </Button>
            </Section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
