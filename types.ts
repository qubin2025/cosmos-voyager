
export interface User {
  username: string;
  avatar: string;
  isLoggedIn: boolean;
  isAdmin?: boolean; // Added for admin features
}

export interface CelestialObject {
  id: string;
  name: string;
  type: 'planet' | 'galaxy' | 'star' | 'nebula';
  description: string;
  image: string;
  distance: string;
  details: string[];
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: ForumPost[];
  isPinned?: boolean; // For admin moderation
  metadata?: {
    tags: string[];
    summary: string;
  };
}

export enum Section {
  HERO = 'hero',
  SOLAR_SYSTEM = 'solar-system',
  MILKY_WAY = 'milky-way',
  ANDROMEDA = 'andromeda',
  FORUM = 'forum',
  AI_GUIDE = 'ai-guide',
  ADMIN = 'admin-panel'
}
