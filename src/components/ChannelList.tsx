'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Channel, DirectMessage, ChatHook, UserHook, ChannelHook } from '@/types';

interface ChannelListProps {
  chatHook: ChatHook;
  userHook: UserHook;
  channelHook: ChannelHook;
  onCreateChannel: () => void;
}

export default function ChannelList({ 
  chatHook, 
  userHook, 
  channelHook,
  onCreateChannel 
}: ChannelListProps) {
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);

  const { getUserChannels, directMessages } = channelHook;
  const { setCurrentChannel, setCurrentDM, chatState } = chatHook;
  const { getUserById, getOtherUsers } = userHook;

  const userChannels = getUserChannels();
  const publicChannels = userChannels.filter(c => !c.isPrivate);
  const privateChannels = userChannels.filter(c => c.isPrivate);

  const handleChannelClick = (channel: Channel) => {
    setCurrentChannel(channel);
  };

  const handleDMClick = (dm: DirectMessage) => {
    setCurrentDM(dm);
  };

  const getChannelIcon = (channel: Channel) => {
    return channel.isPrivate ? '🔒' : '#';
  };

  const getDMPartnerName = (dm: DirectMessage) => {
    const partnerId = dm.participants.find(id => id !== userHook.currentUser.id);
    const partner = getUserById(partnerId!);
    return partner?.name || 'Unknown';
  };

  const getDMPartner = (dm: DirectMessage) => {
    const partnerId = dm.participants.find(id => id !== userHook.currentUser.id);
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

  return (
    <div className="space-y-4">
      {/* Channels Section */}
      <Collapsible open={channelsOpen} onOpenChange={setChannelsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white p-2"
          >
            <span className={`mr-2 transition-transform ${channelsOpen ? 'rotate-90' : ''}`}>
              ▶
            </span>
            Channels
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {/* Public Channels */}
          {publicChannels.map(channel => (
            <Button
              key={channel.id}
              variant="ghost"
              className={`w-full justify-start text-sm py-1 px-6 ${
                chatState.currentChannel?.id === channel.id
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              onClick={() => handleChannelClick(channel)}
            >
              <span className="mr-2">{getChannelIcon(channel)}</span>
              <span className="flex-1 text-left truncate">{channel.name}</span>
              {channel.unreadCount && channel.unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-5 text-xs px-1.5">
                  {channel.unreadCount}
                </Badge>
              )}
            </Button>
          ))}
          
          {/* Private Channels */}
          {privateChannels.map(channel => (
            <Button
              key={channel.id}
              variant="ghost"
              className={`w-full justify-start text-sm py-1 px-6 ${
                chatState.currentChannel?.id === channel.id
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              onClick={() => handleChannelClick(channel)}
            >
              <span className="mr-2">{getChannelIcon(channel)}</span>
              <span className="flex-1 text-left truncate">{channel.name}</span>
              {channel.unreadCount && channel.unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 min-w-5 text-xs px-1.5">
                  {channel.unreadCount}
                </Badge>
              )}
            </Button>
          ))}
          
          {/* Add Channel */}
          <Button
            variant="ghost"
            className="w-full justify-start text-sm py-1 px-6 text-slate-400 hover:bg-slate-700 hover:text-white"
            onClick={onCreateChannel}
          >
            <span className="mr-2">+</span>
            Add channels
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Direct Messages Section */}
      <Collapsible open={dmsOpen} onOpenChange={setDmsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white p-2"
          >
            <span className={`mr-2 transition-transform ${dmsOpen ? 'rotate-90' : ''}`}>
              ▶
            </span>
            Direct messages
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {directMessages.map(dm => {
            const partner = getDMPartner(dm);
            const partnerName = getDMPartnerName(dm);
            
            return (
              <Button
                key={dm.id}
                variant="ghost"
                className={`w-full justify-start text-sm py-1 px-6 ${
                  chatState.currentDM?.id === dm.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => handleDMClick(dm)}
              >
                <Avatar className="h-4 w-4 mr-2">
                  <AvatarImage src={partner?.avatar} />
                  <AvatarFallback className="text-xs bg-gray-600">
                    {partnerName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left truncate">{partnerName}</span>
                <span className="text-xs">
                  {partner && getStatusIcon(partner.status)}
                </span>
                {dm.unreadCount && dm.unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 text-xs px-1.5 ml-1">
                    {dm.unreadCount}
                  </Badge>
                )}
              </Button>
            );
          })}
          
          {/* Other team members for new DMs */}
          {getOtherUsers().slice(0, 3).map(user => {
            const existingDM = directMessages.find(dm => 
              dm.participants.includes(user.id)
            );
            
            if (existingDM) return null;
            
            return (
              <Button
                key={`new-dm-${user.id}`}
                variant="ghost"
                className="w-full justify-start text-sm py-1 px-6 text-slate-400 hover:bg-slate-700 hover:text-white"
              >
                <Avatar className="h-4 w-4 mr-2">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs bg-gray-600">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left truncate">{user.name}</span>
                <span className="text-xs">
                  {getStatusIcon(user.status)}
                </span>
              </Button>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}