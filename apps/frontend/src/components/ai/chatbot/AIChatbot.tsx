'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { AnimatePresence } from 'framer-motion';
import { AIFloatingButton } from './AIFloatingButton';
import { AIChatWindow } from './AIChatWindow';
import { AIChatHeader } from './AIChatHeader';
import { AIWelcome } from './AIWelcome';
import { AIMessageList } from './AIMessageList';
import { AIComposer } from './AIComposer';
import type { Message, UserContext } from './types';

const AI_CHAT_MUTATION = gql`
  mutation AiChat($input: AiChatInput!) {
    aiChat(input: $input) {
      conversationId
      messageId
      response
      toolsUsed
      responseTime
    }
  }
`;

interface AIChatMutationData {
  aiChat: {
    conversationId: string;
    messageId: string;
    response: string;
    toolsUsed: string[];
    responseTime: number;
  };
}

interface AIChatMutationVariables {
  input: {
    message: string;
    conversationId?: string;
    context: {
      metadata: Record<string, unknown>;
    };
  };
}

interface AIChatbotProps {
  userContext?: UserContext;
}

export function AIChatbot({ userContext }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [aiChatMutation, { loading }] = useMutation<
    AIChatMutationData,
    AIChatMutationVariables
  >(AI_CHAT_MUTATION);
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

    try {
      // Convert image to base64 if provided (for future enhancement)
      let imageBase64: string | undefined;
      if (imageFile) {
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            // Remove data URL prefix
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(imageFile);
        });
      }

      // Call AI mutation
      const { data } = await aiChatMutation({
        variables: {
          input: {
            message: content,
            conversationId: conversationId, // Track conversation across messages
            context: {
              metadata: {
                userRole: userContext?.role || 'public',
                userName: userContext?.name,
                userId: userContext?.id,
                hasImage: !!imageBase64,
              },
            },
          },
        },
      });

      // Save conversation ID for future messages
      if (data?.aiChat?.conversationId) {
        setConversationId(data.aiChat.conversationId);
      }

      // Parse AI response
      const aiResponse =
        data?.aiChat?.response || 'Sorry, I could not generate a response.';

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      // Try to parse structured blocks from response
      try {
        const parsed = JSON.parse(aiResponse);
        if (parsed.text) {
          assistantMessage.content = parsed.text;
        }
        if (parsed.blocks) {
          assistantMessage.blocks = parsed.blocks;
        }
      } catch {
        // Response is plain text, keep as is
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);

      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
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
