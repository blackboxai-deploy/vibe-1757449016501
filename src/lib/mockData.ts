import { User, Channel, DirectMessage, Message, Workspace } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/eade1d9d-cf90-4b1f-8519-e8d87a7d2e1b.png',
    status: 'online',
    title: 'Senior Developer',
    timezone: 'PST'
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah.smith@company.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b3470294-5a6a-4c0c-a690-8729973dc767.png',
    status: 'away',
    title: 'Product Manager',
    timezone: 'EST'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/17f0daf6-b175-457a-b833-58c3419b8cd3.png',
    status: 'online',
    title: 'UX Designer',
    timezone: 'PST'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@company.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/51182e95-a486-4f67-aac9-15fb280b253b.png',
    status: 'busy',
    title: 'DevOps Engineer',
    timezone: 'EST'
  },
  {
    id: '5',
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/29105d47-fb9a-42ad-b62f-210dfb99cc85.png',
    status: 'offline',
    title: 'QA Lead',
    timezone: 'PST'
  }
];

export const mockWorkspace: Workspace = {
  id: 'ws-1',
  name: 'Awesome Company',
  domain: 'awesome-company',
  avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5e24d726-665a-463a-b3ae-8bbb38922748.png',
  members: ['1', '2', '3', '4', '5']
};

export const mockChannels: Channel[] = [
  {
    id: 'general',
    name: 'general',
    description: 'Company-wide announcements and general discussion',
    isPrivate: false,
    members: ['1', '2', '3', '4', '5'],
    createdBy: '1',
    createdAt: new Date('2024-01-01'),
    topic: 'Welcome to the team! 🎉',
    unreadCount: 3
  },
  {
    id: 'dev-team',
    name: 'dev-team',
    description: 'Development team coordination and updates',
    isPrivate: false,
    members: ['1', '3', '4'],
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
    topic: 'Sprint planning and daily standups',
    unreadCount: 7
  },
  {
    id: 'random',
    name: 'random',
    description: 'Non-work banter and random stuff',
    isPrivate: false,
    members: ['1', '2', '3', '4', '5'],
    createdBy: '2',
    createdAt: new Date('2024-01-10'),
    topic: 'Coffee chat and memes ☕',
    unreadCount: 0
  },
  {
    id: 'design',
    name: 'design',
    description: 'Design reviews and creative discussions',
    isPrivate: false,
    members: ['2', '3'],
    createdBy: '3',
    createdAt: new Date('2024-02-01'),
    topic: 'UI/UX feedback and inspiration',
    unreadCount: 2
  },
  {
    id: 'leadership',
    name: 'leadership',
    description: 'Leadership team private discussions',
    isPrivate: true,
    members: ['1', '2'],
    createdBy: '1',
    createdAt: new Date('2024-01-20'),
    topic: 'Strategic planning',
    unreadCount: 1
  }
];

export const mockDirectMessages: DirectMessage[] = [
  {
    id: 'dm-1-2',
    participants: ['1', '2'],
    unreadCount: 2
  },
  {
    id: 'dm-1-3',
    participants: ['1', '3'],
    unreadCount: 0
  },
  {
    id: 'dm-1-4',
    participants: ['1', '4'],
    unreadCount: 1
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    content: 'Welcome everyone to our new Slack workspace! 🎉 Looking forward to great collaboration.',
    authorId: '1',
    channelId: 'general',
    timestamp: new Date('2024-03-15T09:00:00'),
    reactions: [
      { emoji: '👋', users: ['2', '3', '4'], count: 3 },
      { emoji: '🎉', users: ['2', '5'], count: 2 }
    ]
  },
  {
    id: 'msg-2',
    content: 'Thanks John! Excited to be here. Can\'t wait to start working together.',
    authorId: '2',
    channelId: 'general',
    timestamp: new Date('2024-03-15T09:05:00'),
    reactions: [
      { emoji: '🙌', users: ['1', '3'], count: 2 }
    ]
  },
  {
    id: 'msg-3',
    content: 'Hey team, I\'ve uploaded the new design mockups to the shared drive. Let me know your thoughts!',
    authorId: '3',
    channelId: 'design',
    timestamp: new Date('2024-03-15T10:30:00'),
    reactions: [],
    attachments: [
      {
        id: 'att-1',
        name: 'dashboard-mockup.fig',
        type: 'file',
        url: '#',
        size: 2048000
      }
    ]
  },
  {
    id: 'msg-4',
    content: 'Good morning! How is everyone doing today? ☀️',
    authorId: '4',
    channelId: 'random',
    timestamp: new Date('2024-03-15T08:30:00'),
    reactions: [
      { emoji: '☀️', users: ['1', '2', '3'], count: 3 },
      { emoji: '👋', users: ['1', '5'], count: 2 }
    ]
  },
  {
    id: 'msg-5',
    content: 'Sprint planning meeting scheduled for 2 PM today. Please review the backlog items.',
    authorId: '1',
    channelId: 'dev-team',
    timestamp: new Date('2024-03-15T11:00:00'),
    reactions: [
      { emoji: '✅', users: ['3', '4'], count: 2 }
    ]
  },
  {
    id: 'msg-6',
    content: 'I\'ll be late to the meeting, stuck in traffic 🚗',
    authorId: '3',
    channelId: 'dev-team',
    timestamp: new Date('2024-03-15T13:45:00'),
    reactions: []
  },
  {
    id: 'msg-7',
    content: 'No worries Mike, we\'ll start with the other items.',
    authorId: '1',
    channelId: 'dev-team',
    timestamp: new Date('2024-03-15T13:47:00'),
    reactions: [
      { emoji: '👍', users: ['3'], count: 1 }
    ]
  },
  {
    id: 'msg-8',
    content: 'Hey Sarah, do you have a minute to discuss the user feedback from last week?',
    authorId: '1',
    dmId: 'dm-1-2',
    timestamp: new Date('2024-03-15T14:20:00'),
    reactions: []
  },
  {
    id: 'msg-9',
    content: 'Sure! I have the report ready. Let me share it with you.',
    authorId: '2',
    dmId: 'dm-1-2',
    timestamp: new Date('2024-03-15T14:22:00'),
    reactions: []
  },
  {
    id: 'msg-10',
    content: 'Perfect! The insights look really valuable. Thanks for putting this together.',
    authorId: '1',
    dmId: 'dm-1-2',
    timestamp: new Date('2024-03-15T14:35:00'),
    reactions: [
      { emoji: '🙏', users: ['2'], count: 1 }
    ]
  }
];

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get channel by ID
export const getChannelById = (id: string): Channel | undefined => {
  return mockChannels.find(channel => channel.id === id);
};

// Helper function to get messages for a channel
export const getChannelMessages = (channelId: string): Message[] => {
  return mockMessages.filter(message => message.channelId === channelId);
};

// Helper function to get messages for a DM
export const getDMMessages = (dmId: string): Message[] => {
  return mockMessages.filter(message => message.dmId === dmId);
};

// Helper function to get DM by participants
export const getDMByParticipants = (userId1: string, userId2: string): DirectMessage | undefined => {
  return mockDirectMessages.find(dm => 
    dm.participants.includes(userId1) && dm.participants.includes(userId2)
  );
};

export const currentUserId = '1'; // Current user is John Doe