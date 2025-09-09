'use client';

import { useState, useEffect, useCallback } from 'react';
import { Channel, DirectMessage, Message, ChatState } from '@/types';
import { mockChannels, getChannelMessages, getDMMessages } from '@/lib/mockData';

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>({
    currentChannel: mockChannels[0], // Start with general channel
    sidebarCollapsed: false
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages when current channel or DM changes
  useEffect(() => {
    if (chatState.currentChannel) {
      const channelMessages = getChannelMessages(chatState.currentChannel.id);
      setMessages(channelMessages);
    } else if (chatState.currentDM) {
      const dmMessages = getDMMessages(chatState.currentDM.id);
      setMessages(dmMessages);
    }
  }, [chatState.currentChannel, chatState.currentDM]);

  const setCurrentChannel = useCallback((channel: Channel) => {
    setChatState(prev => ({
      ...prev,
      currentChannel: channel,
      currentDM: undefined,
      currentThread: undefined
    }));
  }, []);

  const setCurrentDM = useCallback((dm: DirectMessage) => {
    setChatState(prev => ({
      ...prev,
      currentChannel: undefined,
      currentDM: dm,
      currentThread: undefined
    }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: content.trim(),
      authorId: '1', // Current user
      channelId: chatState.currentChannel?.id,
      dmId: chatState.currentDM?.id,
      timestamp: new Date(),
      reactions: []
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(false);

    // Simulate receiving a response after a delay
    if (Math.random() > 0.3) { // 70% chance of getting a response
      setTimeout(() => {
        const responseMessages = [
          "Thanks for sharing that!",
          "Interesting point 🤔",
          "I agree with that approach",
          "Let me think about this...",
          "Good idea! 💡",
          "Makes sense to me",
          "I'll look into this",
          "Thanks for the update!"
        ];
        
        const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)];
        const availableUsers = ['2', '3', '4', '5'];
        const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        
        const responseMessage: Message = {
          id: `msg-${Date.now()}-response`,
          content: randomResponse,
          authorId: randomUser,
          channelId: chatState.currentChannel?.id,
          dmId: chatState.currentDM?.id,
          timestamp: new Date(),
          reactions: []
        };

        setMessages(prev => [...prev, responseMessage]);
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
  }, [chatState.currentChannel, chatState.currentDM]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        const currentUserId = '1';
        
        if (existingReaction) {
          if (existingReaction.users.includes(currentUserId)) {
            // Remove reaction
            return {
              ...message,
              reactions: message.reactions.map(r => 
                r.emoji === emoji 
                  ? {
                      ...r,
                      users: r.users.filter(u => u !== currentUserId),
                      count: r.count - 1
                    }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add reaction
            return {
              ...message,
              reactions: message.reactions.map(r => 
                r.emoji === emoji 
                  ? {
                      ...r,
                      users: [...r.users, currentUserId],
                      count: r.count + 1
                    }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...message,
            reactions: [
              ...message.reactions,
              {
                emoji,
                users: [currentUserId],
                count: 1
              }
            ]
          };
        }
      }
      return message;
    }));
  }, []);

  const searchMessages = useCallback((query: string) => {
    setChatState(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);

  return {
    chatState,
    messages,
    isLoading,
    setCurrentChannel,
    setCurrentDM,
    toggleSidebar,
    sendMessage,
    addReaction,
    searchMessages
  };
}