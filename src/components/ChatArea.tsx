'use client';

import React from 'react';
import ChannelHeader from './ChannelHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatHook, UserHook, ChannelHook } from '@/types';

interface ChatAreaProps {
  chatHook: ChatHook;
  userHook: UserHook;
  channelHook: ChannelHook;
}

export default function ChatArea({ chatHook, userHook, channelHook }: ChatAreaProps) {
  const { chatState, messages } = chatHook;
  const { currentChannel, currentDM } = chatState;

  // Show welcome screen if no channel or DM is selected
  if (!currentChannel && !currentDM) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Awesome Company
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Select a channel or start a conversation to begin chatting
          </p>
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>💡 Use <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">⌘ + K</kbd> to quickly search</p>
            <p>📝 Click on any channel to join the conversation</p>
            <p>💬 Start a direct message by clicking on a team member</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <ChannelHeader 
        currentChannel={currentChannel}
        currentDM={currentDM}
        userHook={userHook}
        channelHook={channelHook}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          userHook={userHook}
          onAddReaction={chatHook.addReaction}
        />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <MessageInput 
          onSendMessage={chatHook.sendMessage}
          isLoading={chatHook.isLoading}
          currentChannel={currentChannel}
          currentDM={currentDM}
          userHook={userHook}
        />
      </div>
    </div>
  );
}