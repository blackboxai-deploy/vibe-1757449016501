'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Channel, DirectMessage, UserHook } from '@/types';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  currentChannel?: Channel;
  currentDM?: DirectMessage;
  userHook: UserHook;
}

export default function MessageInput({ 
  onSendMessage, 
  isLoading, 
  currentChannel, 
  currentDM, 
  userHook 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }

    // Simulate typing indicator
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const getPlaceholder = () => {
    if (currentChannel) {
      return `Message #${currentChannel.name}`;
    }
    if (currentDM) {
      const partnerId = currentDM.participants.find(id => id !== userHook.currentUser.id);
      const partner = userHook.getUserById(partnerId!);
      return `Message ${partner?.name || 'User'}`;
    }
    return 'Type a message...';
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main input */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="min-h-[40px] max-h-[120px] resize-none pr-12 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            disabled={isLoading}
            rows={1}
          />
          
          {/* Send button */}
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isLoading}
            className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full"
          >
            {isLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span className="text-sm">➤</span>
            )}
          </Button>
        </div>

        {/* Formatting toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Add emoji"
            >
              😊
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Attach file"
            >
              📎
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Format text"
            >
              𝐀
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Add mention"
            >
              @
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </form>

      {/* Typing indicator */}
      {isTyping && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
          You are typing...
        </div>
      )}
    </div>
  );
}