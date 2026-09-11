/**
 * AI Chat Page
 * Public page for interacting with SnakeSOS AI assistant
 * Now redirects to home with chatbot open
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AIChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home where chatbot is available
    router.push('/?openChat=true');
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AI Chat Assistant</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Redirecting to chatbot...
        </p>
      </div>
    </div>
  );
}
