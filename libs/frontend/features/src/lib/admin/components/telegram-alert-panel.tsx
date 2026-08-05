'use client';

import type { TelegramStatus } from '../types';

interface TelegramAlertPanelProps {
  status: TelegramStatus | null;
  testing: boolean;
  result: string | null;
  onTest: () => void;
}

export function TelegramAlertPanel({
  status,
  testing,
  result,
  onTest,
}: TelegramAlertPanelProps) {
  return (
    <div className="glass-card rounded-2xl border border-white/10 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-white font-bold">Telegram Alerts</h3>
          <p className="text-gray-400 text-sm">
            Verify Telegram integration and send a quick test alert from admin.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              status?.enabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {status?.enabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            onClick={onTest}
            disabled={testing}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            {testing ? 'Sending...' : 'Send test alert'}
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-300">
        {result ??
          (status
            ? `Bot token: ${status.botTokenSet ? 'set' : 'missing'}, Chat ID: ${
                status.chatIdSet ? 'set' : 'missing'
              }`
            : 'Checking Telegram status...')}
      </div>
    </div>
  );
}
