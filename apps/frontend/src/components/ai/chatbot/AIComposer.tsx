'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface AIComposerProps {
  onSend: (message: string, imageFile?: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AIComposer({
  onSend,
  disabled = false,
  placeholder = 'Ask about snake safety, rescues, or get help...',
}: AIComposerProps) {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage && !imageFile) return;
    if (disabled) return;

    onSend(trimmedMessage, imageFile || undefined);
    setMessage('');
    removeImage();

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const canSend = (message.trim() || imageFile) && !disabled;

  return (
    <div className="border-t border-border bg-muted/30 backdrop-blur-md p-4">
      {/* Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 relative inline-block"
          >
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 rounded-lg border border-border"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Image Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-background/50 hover:bg-muted border border-border flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach image"
        >
          <ImageIcon className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              maxHeight: '120px',
              minHeight: '44px',
            }}
          />
        </div>

        {/* Send Button */}
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          whileHover={canSend ? { scale: 1.05 } : {}}
          whileTap={canSend ? { scale: 0.95 } : {}}
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            canSend
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
              : 'bg-muted border border-border text-muted-foreground cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Hint */}
      <div className="mt-2 text-[10px] text-muted-foreground text-center">
        Press Enter to send • Shift+Enter for new line
      </div>
    </div>
  );
}
