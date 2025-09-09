'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useUsers } from '@/hooks/useUsers';
import { useChannels } from '@/hooks/useChannels';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import CreateChannelModal from '@/components/CreateChannelModal';
import SearchModal from '@/components/SearchModal';

export default function Home() {
  const chatHook = useChat();
  const userHook = useUsers();
  const channelHook = useChannels();
  
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    // Cmd/Ctrl + K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setShowSearch(true);
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
      setShowSearch(false);
      setShowCreateChannel(false);
    }
  };

  // Add keyboard event listeners
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyboardShortcuts);
      return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
    }
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div className={`${
        chatHook.chatState.sidebarCollapsed 
          ? 'w-0 md:w-64' 
          : 'w-64'
      } transition-all duration-300 ease-in-out overflow-hidden`}>
        <Sidebar
          chatHook={chatHook}
          userHook={userHook}
          channelHook={channelHook}
          onCreateChannel={() => setShowCreateChannel(true)}
          onSearch={() => setShowSearch(true)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea
          chatHook={chatHook}
          userHook={userHook}
          channelHook={channelHook}
        />
      </div>

      {/* Modals */}
      {showCreateChannel && (
        <CreateChannelModal
          isOpen={showCreateChannel}
          onClose={() => setShowCreateChannel(false)}
          onCreateChannel={channelHook.createChannel}
        />
      )}

      {showSearch && (
        <SearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          chatHook={chatHook}
          userHook={userHook}
          channelHook={channelHook}
        />
      )}

      {/* Mobile overlay */}
      {!chatHook.chatState.sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={chatHook.toggleSidebar}
        />
      )}
    </>
  );
}