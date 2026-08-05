'use client';

import { useState, useEffect } from 'react';
import type { TelegramStatus } from '../types';

interface UseTelegramStatusReturn {
  status: TelegramStatus | null;
  testing: boolean;
  result: string | null;
  testTelegram: () => Promise<void>;
}

export function useTelegramStatus(): UseTelegramStatusReturn {
  const [status, setStatus] = useState<TelegramStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/telegram/status');
        const json = await response.json();
        if (json.success) {
          setStatus(json.data);
        }
      } catch (error) {
        console.error('Failed to load Telegram status:', error);
      }
    };

    fetchStatus();
  }, []);

  const testTelegram = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('/api/telegram/test', { method: 'POST' });
      const json = await response.json();

      if (json.success) {
        setResult('Telegram test alert sent successfully.');
      } else {
        setResult(`Telegram test failed: ${json.error || 'unknown error'}`);
      }

      if (response.ok && json.success) {
        setStatus((prev) => prev ?? { enabled: true, botTokenSet: true, chatIdSet: true });
      }
    } catch (error) {
      setResult(`Telegram test failed: ${(error as Error).message}`);
    } finally {
      setTesting(false);
    }
  };

  return { status, testing, result, testTelegram };
}
