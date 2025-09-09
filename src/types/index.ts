export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  title?: string;
  timezone?: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: string[];
  createdBy: string;
  createdAt: Date;
  topic?: string;
  unreadCount?: number;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId?: string;
  dmId?: string;
  parentId?: string; // for threads
  timestamp: Date;
  reactions: Reaction[];
  attachments?: Attachment[];
  edited?: boolean;
  editedAt?: Date;
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  size: number;
  thumbnail?: string;
}

export interface Thread {
  parentMessageId: string;
  messages: Message[];
  replyCount: number;
  lastReply?: Date;
}

export interface Workspace {
  id: string;
  name: string;
  domain: string;
  avatar?: string;
  members: string[];
}

export interface ChatState {
  currentChannel?: Channel;
  currentDM?: DirectMessage;
  currentThread?: Thread;
  searchQuery?: string;
  sidebarCollapsed: boolean;
}

export interface NotificationSettings {
  desktop: boolean;
  mobile: boolean;
  email: boolean;
  keywords: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  timezone: string;
  language: string;
}

// Hook interfaces
export interface ChatHook {
  chatState: ChatState;
  messages: Message[];
  isLoading: boolean;
  setCurrentChannel: (channel: Channel) => void;
  setCurrentDM: (dm: DirectMessage) => void;
  toggleSidebar: () => void;
  sendMessage: (content: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => void;
  searchMessages: (query: string) => void;
}

export interface UserHook {
  users: User[];
  currentUser: User;
  getUserById: (id: string) => User | undefined;
  getOtherUsers: () => User[];
  getUsersById: (ids: string[]) => User[];
  getOnlineUsers: () => User[];
}

export interface ChannelHook {
  channels: Channel[];
  directMessages: DirectMessage[];
  getPublicChannels: () => Channel[];
  getPrivateChannels: () => Channel[];
  getUserChannels: () => Channel[];
  getChannelById: (id: string) => Channel | undefined;
  getDMByParticipants: (userId1: string, userId2: string) => DirectMessage | undefined;
  createChannel: (name: string, description: string, isPrivate: boolean) => Promise<Channel>;
  joinChannel: (channelId: string) => Promise<void>;
  leaveChannel: (channelId: string) => Promise<void>;
}