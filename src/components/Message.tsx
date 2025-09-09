'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Message as MessageType, User } from '@/types';

interface MessageProps {
  message: MessageType;
  user?: User;
  showAvatar: boolean;
  onAddReaction: (messageId: string, emoji: string) => void;
  isCurrentUser: boolean;
}

export default function Message({ 
  message, 
  user, 
  showAvatar, 
  onAddReaction
}: MessageProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🎉'];

  const handleReactionClick = (emoji: string) => {
    onAddReaction(message.id, emoji);
    setShowReactions(false);
  };

  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map(attachment => (
          <div key={attachment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {attachment.type === 'image' ? '🖼️' : 
                 attachment.type === 'video' ? '🎥' : 
                 attachment.type === 'audio' ? '🎵' : '📄'}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(attachment.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {message.reactions.map(reaction => (
          <Button
            key={reaction.emoji}
            variant="ghost"
            size="sm"
            className={`h-6 px-2 py-0 text-xs border rounded-full ${
              reaction.users.includes('1') // Current user ID
                ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleReactionClick(reaction.emoji)}
          >
            <span className="mr-1">{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-dashed border-gray-300 dark:border-gray-600 rounded-full"
          onClick={() => setShowReactions(!showReactions)}
        >
          +
        </Button>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-500 dark:text-gray-400">
        <span>User not found</span>
      </div>
    );
  }

  return (
    <div 
      className={`group flex gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded ${
        !showAvatar ? 'hover:ml-12' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-10">
        {showAvatar && (
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white">
              {user.name}
            </span>
            {user.title && (
              <Badge variant="secondary" className="text-xs">
                {user.title}
              </Badge>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            {message.edited && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                (edited)
              </span>
            )}
          </div>
        )}

        {/* Message Text */}
        <div className="text-gray-900 dark:text-white">
          {message.content}
        </div>

        {/* Attachments */}
        {renderAttachments()}

        {/* Reactions */}
        {renderReactions()}

        {/* Quick reaction picker */}
        {showReactions && (
          <div className="mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg flex flex-wrap gap-1">
            {commonEmojis.map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleReactionClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      {isHovered && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setShowReactions(!showReactions)}
          >
            😊
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            💬
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ⋯
          </Button>
        </div>
      )}
    </div>
  );
}