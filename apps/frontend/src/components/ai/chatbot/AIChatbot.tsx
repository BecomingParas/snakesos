'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AIFloatingButton } from './AIFloatingButton';
import { AIChatWindow } from './AIChatWindow';
import { AIChatHeader } from './AIChatHeader';
import { AIWelcome } from './AIWelcome';
import { AIMessageList } from './AIMessageList';
import { AIComposer } from './AIComposer';
import type { Message, UserContext } from './types';

interface AIChatbotProps {
  userContext?: UserContext;
}

export function AIChatbot({ userContext }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  
  const context =
    userContext?.role === 'rescuer' || userContext?.role === 'admin'
      ? userContext.role
      : 'public';

  const handleSendMessage = async (content: string, imageFile?: File) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // Handle image if provided
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        userMessage.imageUrl = imageUrl;
      };
      reader.readAsDataURL(imageFile);
    }

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call chat API route with RAG
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Chat request failed');
      }

      // Save conversation ID
      if (result.data?.conversationId) {
        setConversationId(result.data.conversationId);
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);

      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error 
          ? error.message 
          : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleClearChat = () => {
    setMessages([]);
    setConversationId(undefined); // Reset conversation
  };

  return (
    <>
      {/* Floating Button */}
      <AIFloatingButton onClick={() => setIsOpen(true)} isOpen={isOpen} />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <AIChatWindow onClose={() => setIsOpen(false)}>
            {/* Header */}
            <AIChatHeader context={context} onClose={() => setIsOpen(false)} />

            {/* Messages or Welcome */}
            {messages.length === 0 ? (
              <AIWelcome
                context={context}
                onSuggestionClick={handleSuggestionClick}
              />
            ) : (
              <AIMessageList messages={messages} isLoading={loading} />
            )}

            {/* Composer */}
            <AIComposer onSend={handleSendMessage} disabled={loading} />
          </AIChatWindow>
        )}
      </AnimatePresence>
    </>
  );
}
