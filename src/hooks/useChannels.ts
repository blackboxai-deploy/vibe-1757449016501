'use client';

import { useState, useCallback } from 'react';
import { Channel, DirectMessage } from '@/types';
import { mockChannels, mockDirectMessages, currentUserId } from '@/lib/mockData';

export function useChannels() {
  const [channels] = useState<Channel[]>(mockChannels);
  const [directMessages] = useState<DirectMessage[]>(mockDirectMessages);

  const getPublicChannels = useCallback((): Channel[] => {
    return channels.filter(channel => !channel.isPrivate);
  }, [channels]);

  const getPrivateChannels = useCallback((): Channel[] => {
    return channels.filter(channel => channel.isPrivate && channel.members.includes(currentUserId));
  }, [channels]);

  const getUserChannels = useCallback((): Channel[] => {
    return channels.filter(channel => channel.members.includes(currentUserId));
  }, [channels]);

  const getChannelById = useCallback((id: string): Channel | undefined => {
    return channels.find(channel => channel.id === id);
  }, [channels]);

  const getDMByParticipants = useCallback((userId1: string, userId2: string): DirectMessage | undefined => {
    return directMessages.find(dm => 
      dm.participants.includes(userId1) && dm.participants.includes(userId2)
    );
  }, [directMessages]);

  const createChannel = useCallback(async (name: string, description: string, isPrivate: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      name: name.toLowerCase().replace(/\s+/g, '-'),
      description,
      isPrivate,
      members: [currentUserId],
      createdBy: currentUserId,
      createdAt: new Date(),
      unreadCount: 0
    };
    
    // In a real app, this would update the channels state
    console.log('Created channel:', newChannel);
    return newChannel;
  }, []);

  const joinChannel = useCallback(async (channelId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would add the user to the channel
    console.log('Joined channel:', channelId);
  }, []);

  const leaveChannel = useCallback(async (channelId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would remove the user from the channel
    console.log('Left channel:', channelId);
  }, []);

  return {
    channels,
    directMessages,
    getPublicChannels,
    getPrivateChannels,
    getUserChannels,
    getChannelById,
    getDMByParticipants,
    createChannel,
    joinChannel,
    leaveChannel
  };
}