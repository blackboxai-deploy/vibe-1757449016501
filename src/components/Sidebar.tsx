'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ChannelList from './ChannelList';
import UserProfile from './UserProfile';
import { ChatHook, UserHook, ChannelHook } from '@/types';

interface SidebarProps {
  chatHook: ChatHook;
  userHook: UserHook;
  channelHook: ChannelHook;
  onCreateChannel: () => void;
  onSearch: () => void;
}

export default function Sidebar({ 
  chatHook, 
  userHook, 
  channelHook, 
  onCreateChannel,
  onSearch 
}: SidebarProps) {
  const { currentUser } = userHook;

  return (
    <div className="bg-slate-800 text-white h-full flex flex-col">
      {/* Workspace Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/efa875d5-e8a9-486b-a141-30f08b608154.png" />
              <AvatarFallback className="bg-purple-600 text-white text-sm font-bold">
                AC
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-lg">Awesome Company</h1>
              <p className="text-slate-300 text-xs">awesome-company.slack.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
          onClick={onSearch}
        >
          <span className="mr-2">🔍</span>
          Search messages
          <Badge variant="secondary" className="ml-auto text-xs bg-slate-600 text-slate-300">
            ⌘K
          </Badge>
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="px-4 space-y-1">
          {/* Quick Actions */}
          <div className="space-y-1 mb-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <span className="mr-3">🧵</span>
              Threads
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <span className="mr-3">📩</span>
              All DMs
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <span className="mr-3">📌</span>
              Saved items
            </Button>
          </div>

          {/* Channels */}
          <ChannelList 
            chatHook={chatHook}
            userHook={userHook}
            channelHook={channelHook}
            onCreateChannel={onCreateChannel}
          />
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t border-slate-700">
        <UserProfile 
          user={currentUser}
          onToggleSidebar={chatHook.toggleSidebar}
        />
      </div>
    </div>
  );
}