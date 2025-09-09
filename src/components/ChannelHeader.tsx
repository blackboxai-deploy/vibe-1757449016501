'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Channel, DirectMessage, UserHook, ChannelHook } from '@/types';

interface ChannelHeaderProps {
  currentChannel?: Channel;
  currentDM?: DirectMessage;
  userHook: UserHook;
  channelHook: ChannelHook;
}

export default function ChannelHeader({ 
  currentChannel, 
  currentDM, 
  userHook
}: ChannelHeaderProps) {
  const { getUserById, getUsersById } = userHook;

  const getDMPartner = () => {
    if (!currentDM) return null;
    const partnerId = currentDM.participants.find(id => id !== userHook.currentUser.id);
    return getUserById(partnerId!);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      case 'busy': return '🔴';
      default: return '⚫';
    }
  };

  const formatMemberCount = (count: number) => {
    return count === 1 ? '1 member' : `${count} members`;
  };

  if (currentDM) {
    const partner = getDMPartner();
    if (!partner) return null;

    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={partner.avatar} alt={partner.name} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
              {partner.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg text-gray-900 dark:text-white">
              {partner.name}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{getStatusIcon(partner.status)}</span>
              <span className="capitalize">{partner.status}</span>
              {partner.title && (
                <>
                  <span>•</span>
                  <span>{partner.title}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
            📞
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
            📹
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
            ℹ️
          </Button>
        </div>
      </div>
    );
  }

  if (currentChannel) {
    const channelMembers = getUsersById(currentChannel.members);
    const channelIcon = currentChannel.isPrivate ? '🔒' : '#';

    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{channelIcon}</span>
            <h1 className="font-semibold text-lg text-gray-900 dark:text-white">
              {currentChannel.name}
            </h1>
            {currentChannel.isPrivate && (
              <Badge variant="secondary" className="text-xs">
                Private
              </Badge>
            )}
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ⭐ {formatMemberCount(currentChannel.members.length)}
              </Button>
              {currentChannel.topic && (
                <>
                  <span>|</span>
                  <span className="truncate max-w-xs">{currentChannel.topic}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Member avatars preview */}
          <div className="hidden md:flex items-center -space-x-2 mr-4">
            {channelMembers.slice(0, 3).map(member => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-white dark:border-gray-900">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs bg-gray-600 text-white">
                  {member.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {currentChannel.members.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-900">
                +{currentChannel.members.length - 3}
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
            📞
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
            🧵
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
            ℹ️
          </Button>
        </div>
      </div>
    );
  }

  return null;
}