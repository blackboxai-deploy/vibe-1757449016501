'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockMessages } from '@/lib/mockData';
import { ChatHook, UserHook, ChannelHook, User, Channel, Message } from '@/types';

interface SearchResult {
  type: 'channel' | 'user' | 'message';
  data: Channel | User | Message;
  title: string;
  subtitle: string;
  icon: string;
  timestamp?: Date;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHook: ChatHook;
  userHook: UserHook;
  channelHook: ChannelHook;
}

export default function SearchModal({
  isOpen,
  onClose,
  chatHook,
  userHook,
  channelHook
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { setCurrentChannel, setCurrentDM } = chatHook;
  const { getUserById } = userHook;
  const { getUserChannels, directMessages, getChannelById, getDMByParticipants } = channelHook;

  // Search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const searchTimeout = setTimeout(() => {
      const searchResults: SearchResult[] = [];

      // Search channels
      const channels = getUserChannels();
      channels.forEach(channel => {
        if (channel.name.toLowerCase().includes(query.toLowerCase()) ||
            channel.description?.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            type: 'channel',
            data: channel,
            title: channel.name,
            subtitle: channel.description || 'Channel',
            icon: channel.isPrivate ? '🔒' : '#'
          });
        }
      });

      // Search users
      userHook.getOtherUsers().forEach((user: User) => {
        if (user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.title?.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            type: 'user',
            data: user,
            title: user.name,
            subtitle: user.title || user.email,
            icon: user.avatar
          });
        }
      });

      // Search messages
      mockMessages.forEach(message => {
        if (message.content.toLowerCase().includes(query.toLowerCase())) {
          const author = getUserById(message.authorId);
          const channel = message.channelId ? getChannelById(message.channelId) : null;
          
          searchResults.push({
            type: 'message',
            data: message,
            title: message.content.substring(0, 60) + (message.content.length > 60 ? '...' : ''),
            subtitle: `From ${author?.name} in ${channel?.name ? '#' + channel.name : 'Direct Message'}`,
            icon: '💬',
            timestamp: message.timestamp
          });
        }
      });

      // Sort results by relevance and recency
      searchResults.sort((a, b) => {
        if (a.type === 'channel' && b.type !== 'channel') return -1;
        if (a.type !== 'channel' && b.type === 'channel') return 1;
        if (a.timestamp && b.timestamp) {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        return a.title.localeCompare(b.title);
      });

      setResults(searchResults.slice(0, 20)); // Limit to 20 results
      setSelectedIndex(0);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, getUserChannels, userHook, getUserById, getChannelById]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'channel') {
      setCurrentChannel(result.data as Channel);
      onClose();
    } else if (result.type === 'user') {
      // Find or create DM with this user
      const user = result.data as User;
      const dm = getDMByParticipants(userHook.currentUser.id, user.id);
      if (dm) {
        setCurrentDM(dm);
      }
      onClose();
    } else if (result.type === 'message') {
      // Navigate to the channel/DM containing this message
      const message = result.data as Message;
      if (message.channelId) {
        const channel = getChannelById(message.channelId);
        if (channel) {
          setCurrentChannel(channel);
        }
      } else if (message.dmId) {
        const dm = directMessages.find(d => d.id === message.dmId);
        if (dm) {
          setCurrentDM(dm);
        }
      }
      onClose();
    }
    setQuery('');
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
    onClose();
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return timestamp.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] p-0">
        <div className="flex flex-col">
          {/* Search header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for channels, people, and messages"
              className="text-lg border-0 focus-visible:ring-0 p-0"
              autoFocus
            />
          </div>

          {/* Search results */}
          <ScrollArea className="flex-1 max-h-96">
            {isLoading && (
              <div className="p-8 text-center">
                <span className="animate-spin text-2xl">⏳</span>
                <p className="text-sm text-gray-500 mt-2">Searching...</p>
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No results found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="p-2">
                {results.map((result, index) => (
                  <Button
                    key={`${result.type}-${index}`}
                    variant="ghost"
                    className={`w-full justify-start p-3 h-auto ${
                      index === selectedIndex 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      {/* Icon/Avatar */}
                      <div className="flex-shrink-0">
                        {result.type === 'user' ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={result.icon} />
                            <AvatarFallback className="text-sm bg-gray-600 text-white">
                              {result.title.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-sm">
                            {result.icon}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="flex-shrink-0 flex items-center space-x-2">
                        {result.type === 'channel' && (
                          <Badge variant="secondary" className="text-xs">
                            Channel
                          </Badge>
                        )}
                        {result.type === 'user' && (
                          <Badge variant="secondary" className="text-xs">
                            Person
                          </Badge>
                        )}
                        {result.type === 'message' && result.timestamp && (
                          <span className="text-xs text-gray-400">
                            {formatTimestamp(result.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {!query && (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Search your workspace
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Find channels, people, and messages quickly
                </p>
                <div className="mt-4 space-y-1 text-xs text-gray-400">
                  <p>↑↓ to navigate</p>
                  <p>↵ to select</p>
                  <p>ESC to close</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}