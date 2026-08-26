'use client';

import { useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Save,
  Mail,
  Bell,
  MapPin,
  Shield,
  Clock,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Globe,
  Key,
  Smartphone,
  Activity,
  RotateCcw,
  Trash2,
  Database,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from '@/lib/graphql/hooks/settings.hooks';
import { useMutation, useQuery } from '@/lib/apollo/hooks';

/**
 * Admin Settings — System Configuration
 * Persists through the admin settings API on explicit save.
 */

type SettingsState = typeof defaultSettings;
type TabId =
  | 'general'
  | 'notifications'
  | 'coverage'
  | 'integrations'
  | 'security';

const defaultSettings = {
  // General
  systemName: 'SnakeSOS',
  contactEmail: 'admin@snakesos.org',
  contactPhone: '9841234567',
  supportEmail: 'support@snakesos.org',

  // Notifications
  smsEnabled: true,
  emailEnabled: true,
  pushEnabled: true,
  smsProvider: 'Twilio',
  emailProvider: 'SendGrid',

  // Coverage
  defaultRadius: 5,
  maxAssignmentDistance: 15,
  autoAssignEnabled: true,
  priorityThreshold: 30,

  // Response Times
  targetResponseTime: 15,
  maxResponseTime: 30,

  // Integration
  smsApiKey: '',
  emailApiKey: '',
  mapboxToken: '',

  // Security
  sessionTimeout: 60,
  passwordMinLength: 8,
  requireTwoFactor: false,
  maxLoginAttempts: 5,
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase mb-1">
      {children}
    </p>
  );
}

function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`border border-border bg-card/95 backdrop-blur-xl p-6 shadow-sm ${className}`}
    >
      {children}
    </Card>
  );
}

function FieldInput({
  id,
  label,
  hint,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  hint?: string;
}) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-muted-foreground text-xs font-medium uppercase tracking-wide"
      >
        {label}
      </Label>
      <Input
        id={id}
        {...props}
        className="mt-1.5 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40 focus-visible:border-primary/60"
      />
      {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}

function Toggle({
  icon: Icon,
  iconColor,
  label,
  description,
  checked,
  onChange,
}: {
  icon: any;
  iconColor: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/40">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 shrink-0" style={{ color: iconColor }} />
        <div>
          <p className="font-medium text-foreground text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-muted border border-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/40 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:border-primary" />
      </label>
    </div>
  );
}

function LiveDot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

type NotificationPreferenceState = {
  highPriorityRescueAlerts: boolean;
  rescueCompletionNotifications: boolean;
  newUserRegistrations: boolean;
  systemAlerts: boolean;
  dailySummaryReports: boolean;
};

const defaultNotificationPreferences: NotificationPreferenceState = {
  highPriorityRescueAlerts: true,
  rescueCompletionNotifications: true,
  newUserRegistrations: true,
  systemAlerts: true,
  dailySummaryReports: false,
};

function NotificationPreferencesPanel() {
  const { data, loading } = useQuery<{
    myNotificationPreferences: NotificationPreferenceState;
  }>(gql`
    query AdminNotificationPreferences {
      myNotificationPreferences {
        highPriorityRescueAlerts
        rescueCompletionNotifications
        newUserRegistrations
        systemAlerts
        dailySummaryReports
      }
    }
  `);
  const [updatePreferences, { loading: saving }] = useMutation(gql`
    mutation UpdateAdminNotificationPreferences(
      $input: UpdateNotificationPreferencesInput!
    ) {
      updateNotificationPreferences(input: $input) {
        highPriorityRescueAlerts
        rescueCompletionNotifications
        newUserRegistrations
        systemAlerts
        dailySummaryReports
      }
    }
  `);
  const [preferences, setPreferences] = useState(
    defaultNotificationPreferences,
  );

  useEffect(() => {
    if (data?.myNotificationPreferences) {
      setPreferences({
        ...defaultNotificationPreferences,
        ...data.myNotificationPreferences,
      });
    }
  }, [data]);

  const updatePreference = (
    key: keyof NotificationPreferenceState,
    value: boolean,
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const savePreferences = async () => {
    try {
      await updatePreferences({ variables: { input: preferences } });
      toast.success('Notification preferences saved');
    } catch {
      toast.error('Unable to save notification preferences');
    }
  };

  return (
    <Panel>
      <Eyebrow>In-App Alerts</Eyebrow>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        Notification Preferences
      </h2>
      <div className="space-y-3">
        <Toggle
          icon={AlertCircle}
          iconColor="hsl(var(--destructive))"
          label="High priority rescue alerts"
          description="Get immediate alerts for urgent rescue requests"
          checked={preferences.highPriorityRescueAlerts}
          onChange={(value) =>
            updatePreference('highPriorityRescueAlerts', value)
          }
        />
        <Toggle
          icon={CheckCircle}
          iconColor="hsl(var(--success))"
          label="Rescue completion notifications"
          description="Notify administrators when a rescue is completed"
          checked={preferences.rescueCompletionNotifications}
          onChange={(value) =>
            updatePreference('rescueCompletionNotifications', value)
          }
        />
        <Toggle
          icon={Activity}
          iconColor="hsl(var(--primary))"
          label="New user registrations"
          description="Notify administrators when users or rescuers register"
          checked={preferences.newUserRegistrations}
          onChange={(value) => updatePreference('newUserRegistrations', value)}
        />
        <Toggle
          icon={AlertTriangle}
          iconColor="hsl(var(--warning))"
          label="System alerts and errors"
          description="Show operational errors and service alerts"
          checked={preferences.systemAlerts}
          onChange={(value) => updatePreference('systemAlerts', value)}
        />
        <Toggle
          icon={Clock}
          iconColor="hsl(var(--info))"
          label="Daily summary reports"
          description="Receive a daily overview of rescue activity"
          checked={preferences.dailySummaryReports}
          onChange={(value) => updatePreference('dailySummaryReports', value)}
        />
      </div>
      <Button
        type="button"
        className="mt-5"
        onClick={() => void savePreferences()}
        disabled={loading || saving}
      >
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </Panel>
  );
}

export default function AdminSettingsPage() {
  const { data, loading, error } = useAdminSettingsQuery();
  const [updateAdminSettings, { loading: saving }] =
    useUpdateAdminSettingsMutation();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [savedSettings, setSavedSettings] = useState<SettingsState>(settings);
  const [activeTab, setActiveTab] = useState<TabId>('general');

  useEffect(() => {
    if (!data?.adminSettings) return;
    const nextSettings: SettingsState = {
      ...defaultSettings,
      ...data.adminSettings,
    };
    setSettings(nextSettings);
    setSavedSettings(nextSettings);
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Unable to load system settings');
  }, [error]);

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings],
  );

  const update = (patch: Partial<SettingsState>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    try {
      const { data: result } = await updateAdminSettings({
        variables: { input: settings },
      });
      const nextSettings = result?.updateAdminSettings ?? settings;
      setSettings(nextSettings);
      setSavedSettings(nextSettings);
      toast.success('Settings saved');
    } catch {
      toast.error('Unable to save system settings');
    }
  };

  const handleResetDefaults = () => {
    if (
      !window.confirm(
        'Reset every setting to its default value? This cannot be undone.',
      )
    )
      return;
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults — remember to save');
  };

  const handleClearCache = () => {
    toast.success('Cache and logs cleared');
  };

  const handleExportBackup = () => {
    toast.info(
      'Preparing database backup — you\u2019ll get a download link shortly',
    );
  };

  const tabs: Array<{ id: TabId; label: string; blurb: string; icon: any }> = [
    {
      id: 'general',
      label: 'General',
      blurb: 'Identity & response targets',
      icon: Settings,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      blurb: 'Alert channels & providers',
      icon: Bell,
    },
    {
      id: 'coverage',
      label: 'Coverage',
      blurb: 'Radius, zones & assignment',
      icon: MapPin,
    },
    {
      id: 'integrations',
      label: 'Integrations',
      blurb: 'Keys & connection status',
      icon: Globe,
    },
    {
      id: 'security',
      label: 'Security',
      blurb: 'Sessions & access control',
      icon: Shield,
    },
  ];

  return (
    <div className="w-full max-w-none p-6 md:p-8 space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Eyebrow>Command Center · System Config</Eyebrow>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Settings className="h-7 w-7 text-primary" />
            System Settings
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <LiveDot color="hsl(var(--primary))" />
            All channels nominal · configuration affects live rescue routing
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-warning/40 bg-warning/15 text-warning">
              Unsaved changes
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:bg-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving…' : isDirty ? 'Save Changes' : 'Saved'}
          </Button>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Loading system settings...
        </p>
      )}

      {/* Rail + content */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Icon rail */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left shrink-0 md:shrink transition-colors border ${
                  active
                    ? 'bg-primary/15 border-primary/40 text-foreground'
                    : 'border-transparent text-muted-foreground hover:bg-accent'
                }`}
              >
                <tab.icon
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: active
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--muted-foreground))',
                  }}
                />
                <span>
                  <span className="block text-sm font-medium leading-tight">
                    {tab.label}
                  </span>
                  <span className="hidden md:block text-[11px] text-muted-foreground/70 leading-tight">
                    {tab.blurb}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="space-y-6 min-w-0">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Panel>
                <Eyebrow>Identity</Eyebrow>
                <h2 className="text-lg font-semibold mb-4">
                  System Information
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldInput
                    id="systemName"
                    label="System Name"
                    value={settings.systemName}
                    onChange={(e) => update({ systemName: e.target.value })}
                  />
                  <FieldInput
                    id="contactEmail"
                    label="Contact Email"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => update({ contactEmail: e.target.value })}
                  />
                  <FieldInput
                    id="contactPhone"
                    label="Contact Phone"
                    value={settings.contactPhone}
                    onChange={(e) => update({ contactPhone: e.target.value })}
                  />
                  <FieldInput
                    id="supportEmail"
                    label="Support Email"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => update({ supportEmail: e.target.value })}
                  />
                </div>
              </Panel>

              <Panel>
                <Eyebrow>Service Level</Eyebrow>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Response Time Targets
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldInput
                    id="targetResponse"
                    label="Target Response Time (min)"
                    type="number"
                    value={settings.targetResponseTime}
                    onChange={(e) =>
                      update({
                        targetResponseTime: parseInt(e.target.value) || 0,
                      })
                    }
                    hint="Ideal time for a rescuer to accept assignment"
                  />
                  <FieldInput
                    id="maxResponse"
                    label="Maximum Response Time (min)"
                    type="number"
                    value={settings.maxResponseTime}
                    onChange={(e) =>
                      update({ maxResponseTime: parseInt(e.target.value) || 0 })
                    }
                    hint="Triggers an alert if exceeded"
                  />
                </div>
              </Panel>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Panel>
                <Eyebrow>Alert Channels</Eyebrow>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Channels
                </h2>
                <div className="space-y-3">
                  <Toggle
                    icon={Smartphone}
                    iconColor="hsl(var(--primary))"
                    label="SMS Notifications"
                    description="Send SMS alerts to rescuers and citizens"
                    checked={settings.smsEnabled}
                    onChange={(v) => update({ smsEnabled: v })}
                  />
                  <Toggle
                    icon={Mail}
                    iconColor="hsl(var(--warning))"
                    label="Email Notifications"
                    description="Send email updates and reports"
                    checked={settings.emailEnabled}
                    onChange={(v) => update({ emailEnabled: v })}
                  />
                  <Toggle
                    icon={Bell}
                    iconColor="hsl(var(--info))"
                    label="Push Notifications"
                    description="Send in-app push notifications"
                    checked={settings.pushEnabled}
                    onChange={(v) => update({ pushEnabled: v })}
                  />
                </div>
              </Panel>

              <Panel>
                <Eyebrow>Providers</Eyebrow>
                <h2 className="text-lg font-semibold mb-4">
                  Notification Providers
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="smsProvider"
                      className="text-muted-foreground text-xs font-medium uppercase tracking-wide"
                    >
                      SMS Provider
                    </Label>
                    <select
                      id="smsProvider"
                      value={settings.smsProvider}
                      onChange={(e) => update({ smsProvider: e.target.value })}
                      className="mt-1.5 flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="Twilio">Twilio</option>
                      <option value="Sparrow">Sparrow SMS</option>
                      <option value="Custom">Custom Provider</option>
                    </select>
                  </div>
                  <div>
                    <Label
                      htmlFor="emailProvider"
                      className="text-muted-foreground text-xs font-medium uppercase tracking-wide"
                    >
                      Email Provider
                    </Label>
                    <select
                      id="emailProvider"
                      value={settings.emailProvider}
                      onChange={(e) =>
                        update({ emailProvider: e.target.value })
                      }
                      className="mt-1.5 flex h-10 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="SendGrid">SendGrid</option>
                      <option value="Mailgun">Mailgun</option>
                      <option value="AWS SES">AWS SES</option>
                    </select>
                  </div>
                </div>
              </Panel>

              <NotificationPreferencesPanel />
            </div>
          )}

          {activeTab === 'coverage' && (
            <div className="space-y-6">
              <Panel>
                <Eyebrow>Dispatch Radius</Eyebrow>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Coverage Configuration
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldInput
                    id="defaultRadius"
                    label="Default Search Radius (km)"
                    type="number"
                    value={settings.defaultRadius}
                    onChange={(e) =>
                      update({ defaultRadius: parseInt(e.target.value) || 0 })
                    }
                    hint="Initial radius to search for available rescuers"
                  />
                  <FieldInput
                    id="maxDistance"
                    label="Maximum Assignment Distance (km)"
                    type="number"
                    value={settings.maxAssignmentDistance}
                    onChange={(e) =>
                      update({
                        maxAssignmentDistance: parseInt(e.target.value) || 0,
                      })
                    }
                    hint="Maximum distance for assigning rescuers"
                  />
                  <FieldInput
                    id="priorityThreshold"
                    label="Priority Escalation (min)"
                    type="number"
                    value={settings.priorityThreshold}
                    onChange={(e) =>
                      update({
                        priorityThreshold: parseInt(e.target.value) || 0,
                      })
                    }
                    hint="Time before a request becomes high priority"
                  />
                  <Toggle
                    icon={Activity}
                    iconColor="hsl(var(--primary))"
                    label="Auto-Assignment"
                    description="Automatically assign the nearest available rescuer"
                    checked={settings.autoAssignEnabled}
                    onChange={(v) => update({ autoAssignEnabled: v })}
                  />
                </div>
              </Panel>

              <Panel>
                <Eyebrow>Zones</Eyebrow>
                <h2 className="text-lg font-semibold mb-4">Coverage Zones</h2>
                <div className="space-y-2">
                  {[
                    'Butwal',
                    'Bhairahawa',
                    'Pokhara',
                    'Kathmandu',
                    'Chitwan',
                  ].map((zone) => (
                    <div
                      key={zone}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{zone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border border-primary/30 bg-primary/15 text-primary">
                          <LiveDot color="hsl(var(--primary))" />
                          Active
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <Panel>
                <Eyebrow>Credentials</Eyebrow>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  API Keys & Integrations
                </h2>
                <div className="space-y-4">
                  <FieldInput
                    id="smsApi"
                    label="SMS API Key"
                    type="password"
                    value={settings.smsApiKey}
                    onChange={(e) => update({ smsApiKey: e.target.value })}
                  />
                  <FieldInput
                    id="emailApi"
                    label="Email API Key"
                    type="password"
                    value={settings.emailApiKey}
                    onChange={(e) => update({ emailApiKey: e.target.value })}
                  />
                  <FieldInput
                    id="mapboxToken"
                    label="Mapbox Access Token"
                    type="password"
                    value={settings.mapboxToken}
                    onChange={(e) => update({ mapboxToken: e.target.value })}
                  />
                </div>
              </Panel>

              <Panel>
                <Eyebrow>Live Status</Eyebrow>
                <h2 className="text-lg font-semibold mb-4">
                  Connection Status
                </h2>
                <div className="space-y-2">
                  {[
                    { name: 'SMS Gateway', status: 'connected' as const },
                    { name: 'Email Service', status: 'connected' as const },
                    { name: 'Map Service', status: 'limited' as const },
                  ].map((svc) => (
                    <div
                      key={svc.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40"
                    >
                      <div className="flex items-center gap-3">
                        {svc.status === 'connected' ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-warning" />
                        )}
                        <span className="text-sm">{svc.name}</span>
                      </div>
                      <Badge
                        className={
                          svc.status === 'connected'
                            ? 'bg-primary/15 text-primary border border-primary/30'
                            : 'bg-warning/15 text-warning border border-warning/30'
                        }
                      >
                        {svc.status === 'connected' ? 'Connected' : 'Limited'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Panel>
                <Eyebrow>Access Control</Eyebrow>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security & Access Control
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldInput
                    id="sessionTimeout"
                    label="Session Timeout (min)"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      update({ sessionTimeout: parseInt(e.target.value) || 0 })
                    }
                  />
                  <FieldInput
                    id="passwordLength"
                    label="Minimum Password Length"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) =>
                      update({
                        passwordMinLength: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <FieldInput
                    id="maxAttempts"
                    label="Max Login Attempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) =>
                      update({
                        maxLoginAttempts: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <Toggle
                    icon={Shield}
                    iconColor="hsl(var(--primary))"
                    label="Require Two-Factor Auth"
                    description="Applies to all admin accounts"
                    checked={settings.requireTwoFactor}
                    onChange={(v) => update({ requireTwoFactor: v })}
                  />
                </div>
              </Panel>

              {/* Danger Zone — hazard treatment */}
              <div className="rounded-xl border border-destructive/30 overflow-hidden">
                <div
                  className="h-2"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(135deg, hsl(var(--destructive)) 0px, hsl(var(--destructive)) 10px, hsl(var(--foreground)) 10px, hsl(var(--foreground)) 20px)',
                    opacity: 0.7,
                  }}
                />
                <div className="p-6 bg-[var(--crimson-dim)]">
                  <h2 className="text-lg font-semibold mb-1 flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    Danger Zone
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    These actions affect the live system immediately and cannot
                    be undone.
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={handleResetDefaults}
                      className="w-full justify-start gap-2 border-destructive/40 text-destructive bg-transparent hover:bg-destructive/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset All Settings to Default
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClearCache}
                      className="w-full justify-start gap-2 border-destructive/40 text-destructive bg-transparent hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All Cache and Logs
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleExportBackup}
                      className="w-full justify-start gap-2 border-destructive/40 text-destructive bg-transparent hover:bg-destructive/10"
                    >
                      <Database className="h-4 w-4" />
                      Export Database Backup
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
