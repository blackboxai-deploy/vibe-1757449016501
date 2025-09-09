'use client';

import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Message from './Message';
import { Message as MessageType, UserHook } from '@/types';

interface MessageListProps {
  messages: MessageType[];
  userHook: UserHook;
  onAddReaction: (messageId: string, emoji: string) => void;
}

export default function MessageList({ messages, userHook, onAddReaction }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups: { [key: string]: MessageType[] }, message) => {
    const date = message.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const shouldShowAvatar = (message: MessageType, index: number, dayMessages: MessageType[]) => {
    if (index === 0) return true;
    
    const previousMessage = dayMessages[index - 1];
    const timeDiff = message.timestamp.getTime() - previousMessage.timestamp.getTime();
    const isDifferentAuthor = message.authorId !== previousMessage.authorId;
    const hasTimeLap = timeDiff > 5 * 60 * 1000; // 5 minutes
    
    return isDifferentAuthor || hasTimeLap;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-lg font-medium mb-2">No messages yet</p>
          <p className="text-sm">Be the first to send a message in this conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 space-y-6">
        {Object.entries(groupedMessages).map(([dateString, dayMessages]) => (
          <div key={dateString}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-6">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              <div className="mx-4 px-3 py-1 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full">
                {formatDate(dateString)}
              </div>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {dayMessages.map((message, index) => (
                <Message
                  key={message.id}
                  message={message}
                  user={userHook.getUserById(message.authorId)}
                  showAvatar={shouldShowAvatar(message, index, dayMessages)}
                  onAddReaction={onAddReaction}
                  isCurrentUser={message.authorId === userHook.currentUser.id}
                />
              ))}
            </div>
          </div>
        ))}
        
        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}