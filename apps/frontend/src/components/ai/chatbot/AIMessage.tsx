'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { AIBlockRenderer } from './AIBlockRenderer';
import type { Message } from './types';

interface AIMessageProps {
  message: Message;
}

export function AIMessage({ message }: AIMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'flex justify-end' : ''}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30'
              : 'bg-white/5 backdrop-blur-sm border border-white/10'
          }`}
        >
          {/* Text content */}
          {message.content && (
            <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}

          {/* Structured blocks */}
          {message.blocks && message.blocks.length > 0 && (
            <div className="mt-3 space-y-3">
              {message.blocks.map((block, index) => (
                <AIBlockRenderer key={index} block={block} />
              ))}
            </div>
          )}

          {/* Image attachment */}
          {message.imageUrl && (
            <div className="mt-3">
              <img
                src={message.imageUrl}
                alt="Uploaded image"
                className="rounded-lg max-w-full h-auto border border-white/10"
              />
            </div>
          )}

          {/* Timestamp */}
          {message.timestamp && (
            <div className={`text-[10px] mt-2 ${isUser ? 'text-right' : 'text-left'} text-white/40`}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
