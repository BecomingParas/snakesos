'use client';

import React from 'react';
import { AIChatbot } from './AIChatbot';

/**
 * Public AI Chatbot Wrapper
 * For use on public pages without authentication
 */
export function PublicAIChatbot() {
  return (
    <AIChatbot
      userContext={{
        role: 'public',
      }}
    />
  );
}
