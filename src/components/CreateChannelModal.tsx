'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Channel } from '@/types';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (name: string, description: string, isPrivate: boolean) => Promise<Channel>;
}

export default function CreateChannelModal({
  isOpen,
  onClose,
  onCreateChannel
}: CreateChannelModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Channel name is required');
      return;
    }

    if (name.length < 2 || name.length > 21) {
      setError('Channel name must be between 2 and 21 characters');
      return;
    }

    if (!/^[a-z0-9-_]+$/.test(name.toLowerCase().replace(/\s+/g, '-'))) {
      setError('Channel name can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    setIsLoading(true);
    try {
      await onCreateChannel(name, description, isPrivate);
      handleClose();
    } catch {
      setError('Failed to create channel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIsPrivate(false);
    setError('');
    setIsLoading(false);
    onClose();
  };

  const formatChannelName = (input: string) => {
    return input.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a channel</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Channels are where your team communicates. They&apos;re best when organized around a topic — #marketing, for example.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">Name</Label>
            <div className="relative">
              <Input
                id="channel-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. plan-budget"
                className="pl-6"
                maxLength={21}
                autoFocus
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                #
              </span>
            </div>
            {name && (
              <p className="text-xs text-gray-500">
                Channel name will be: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                  #{formatChannelName(name)}
                </code>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-description">Description (optional)</Label>
            <Textarea
              id="channel-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              className="resize-none"
              rows={3}
              maxLength={250}
            />
            <p className="text-xs text-gray-500">
              {description.length}/250 characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="private-channel"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <div className="space-y-0.5">
              <Label htmlFor="private-channel" className="text-sm font-medium">
                Make private
              </Label>
              <p className="text-xs text-gray-500">
                {isPrivate 
                  ? 'Only specific people can access this channel'
                  : 'Anyone in your workspace can join this channel'
                }
              </p>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
              {error}
            </div>
          )}
        </form>

        <DialogFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Creating...
              </>
            ) : (
              'Create Channel'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}