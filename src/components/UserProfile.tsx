'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User } from '@/types';

interface UserProfileProps {
  user: User;
  onToggleSidebar: () => void;
}

export default function UserProfile({ user, onToggleSidebar }: UserProfileProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      case 'busy': return '🔴';
      default: return '⚫';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Active';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  return (
    <div className="p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white p-2 h-auto"
          >
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <div className="flex items-center">
                <span className="text-sm font-medium truncate">{user.name}</span>
                <span className="ml-2 text-xs">
                  {getStatusIcon(user.status)}
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate">
                {getStatusText(user.status)}
              </div>
            </div>
            <span className="text-slate-400">⋯</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-3 py-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{getStatusText(user.status)}</p>
                {user.title && (
                  <p className="text-xs text-gray-400">{user.title}</p>
                )}
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span className="mr-2">🏠</span>
            Set yourself as active
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">⏰</span>
            Pause notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span className="mr-2">👤</span>
            Profile & account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">⚙️</span>
            Preferences
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span className="mr-2">❓</span>
            Help
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <span className="mr-2">🚪</span>
            Sign out of Awesome Company
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden mt-2 w-full text-slate-300 hover:bg-slate-700 hover:text-white"
        onClick={onToggleSidebar}
      >
        ☰ Toggle Menu
      </Button>
    </div>
  );
}