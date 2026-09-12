/**
 * AI Chat Component
 *
 * Main chat interface for interacting with SnakeSOS AI agent.
 * Supports text messages, tool execution, and structured responses.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, MessageSquare, AlertCircle } from 'lucide-react';
import { AIChatMessage } from './AIChatMessage';
import { AIConfirmationDialog } from './AIConfirmationDialog';

// GraphQL Queries
const AI_CHAT_MUTATION = gql`
  mutation AiChat($input: AiChatInput!) {
    aiChat(input: $input) {
      conversationId
      messageId
      response
      toolsUsed
      responseTime
      requiresConfirmation
      confirmationRequest {
        toolName
        action
        description
        arguments
        risks
        reversible
      }
    }
  }
`;

const MY_CONVERSATIONS_QUERY = gql`
  query MyAiConversations($limit: Int) {
    myAiConversations(limit: $limit) {
      id
      title
      context
      updatedAt
    }
  }
`;

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolsUsed?: string[];
  timestamp: Date;
  requiresConfirmation?: boolean;
  confirmationRequest?: {
    toolName: string;
    action: string;
    description: string;
    arguments: Record<string, any>;
    risks?: string[];
    reversible: boolean;
  };
}

interface AIChatProps {
  conversationId?: string;
  context?: 'public' | 'rescuer' | 'admin';
  location?: { latitude: number; longitude: number };
  onConversationChange?: (conversationId: string) => void;
}

interface AIChatMutationData {
  aiChat: {
    conversationId: string;
    messageId: string;
    response: string;
    toolsUsed: string[];
    responseTime: number;
    requiresConfirmation?: boolean | null;
    confirmationRequest?: {
      toolName: string;
      action: string;
      description: string;
      arguments: Record<string, any>;
      risks: string[];
      reversible: boolean;
    } | null;
  };
}

interface AIChatMutationVariables {
  input: {
    message: string;
    conversationId?: string;
    context?: {
      location: { latitude: number; longitude: number };
    };
  };
}

/**
 * AI Chat Component
 */
export function AIChat({
  conversationId: initialConversationId,
  context = 'public',
  location,
  onConversationChange,
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId,
  );
  const [pendingConfirmation, setPendingConfirmation] =
    useState<Message | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // GraphQL mutation
  const [sendMessage, { loading, error }] = useMutation<
    AIChatMutationData,
    AIChatMutationVariables
  >(AI_CHAT_MUTATION, {
    onCompleted: (data) => {
      const response = data.aiChat;

      // Update conversation ID
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
        onConversationChange?.(response.conversationId);
      }

      // Check if confirmation is required
      if (response.requiresConfirmation && response.confirmationRequest) {
        const confirmationMessage: Message = {
          id: response.messageId,
          role: 'assistant',
          content: response.response,
          toolsUsed: response.toolsUsed,
          timestamp: new Date(),
          requiresConfirmation: true,
          confirmationRequest: response.confirmationRequest,
        };
        setPendingConfirmation(confirmationMessage);
        setMessages((prev) => [...prev, confirmationMessage]);
      } else {
        // Add assistant response
        setMessages((prev) => [
          ...prev,
          {
            id: response.messageId,
            role: 'assistant',
            content: response.response,
            toolsUsed: response.toolsUsed,
            timestamp: new Date(),
          },
        ]);
      }
    },
    onError: (err) => {
      console.error('Chat error:', err);
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Handle send message
   */
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Send to API
    try {
      await sendMessage({
        variables: {
          input: {
            message: userMessage.content,
            conversationId,
            context: location ? { location } : undefined,
          },
        },
      });
    } catch (err) {
      // Error handled by onError
    }
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Handle confirmation approval
   */
  const handleConfirmAction = async () => {
    if (!pendingConfirmation) return;

    // Send confirmation to backend
    await sendMessage({
      variables: {
        input: {
          message: '__CONFIRM__',
          conversationId,
          context: location ? { location } : undefined,
        },
      },
    });

    setPendingConfirmation(null);
  };

  /**
   * Handle confirmation rejection
   */
  const handleCancelAction = () => {
    if (!pendingConfirmation) return;

    // Add cancellation message
    setMessages((prev) => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        role: 'system',
        content: 'Action cancelled by user.',
        timestamp: new Date(),
      },
    ]);

    setPendingConfirmation(null);
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto">
      {/* Confirmation Dialog */}
      {pendingConfirmation && pendingConfirmation.confirmationRequest && (
        <AIConfirmationDialog
          open={!!pendingConfirmation}
          onOpenChange={(open) => !open && handleCancelAction()}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
          toolName={pendingConfirmation.confirmationRequest.toolName}
          action={pendingConfirmation.confirmationRequest.action}
          parameters={pendingConfirmation.confirmationRequest.arguments}
          warning={
            pendingConfirmation.confirmationRequest.risks?.[0] ||
            (!pendingConfirmation.confirmationRequest.reversible
              ? 'This action cannot be undone.'
              : undefined)
          }
        />
      )}
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">SnakeSOS AI Assistant</h3>
        {context === 'rescuer' && (
          <span className="ml-auto text-xs text-muted-foreground">
            Rescuer Mode
          </span>
        )}
        {context === 'admin' && (
          <span className="ml-auto text-xs text-muted-foreground">
            Admin Mode
          </span>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                Ask me anything about snake safety, rescue procedures, or
                emergency assistance.
              </p>
              <div className="mt-4 text-xs space-y-1">
                <p>• "What should I do if I see a snake?"</p>
                <p>• "Find rescuers near me"</p>
                <p>• "Where is the nearest hospital with antivenom?"</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <AIChatMessage key={message.id} message={message} />
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mx-4 mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || 'Failed to send message. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 p-4 border-t">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          size="icon"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}
