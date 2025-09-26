// User Data Model
export interface User {
  userId: string;
  walletAddress?: string;
  createdAt: Date;
  lastActive: Date;
}

// Query Data Model
export interface Query {
  queryId: string;
  userId: string;
  question: string;
  timestamp: Date;
  answer: string;
}

// Guide Data Model
export interface Guide {
  guideId: string;
  title: string;
  category: 'consumer-rights' | 'employment' | 'landlord-tenant' | 'general';
  content: string;
  createdAt: Date;
  isPremium?: boolean;
}

// Course Module Data Model
export interface CourseModule {
  moduleId: string;
  title: string;
  description: string;
  content: string;
  isPremium: boolean;
  order: number;
  estimatedTime: string;
}

// Community Post Data Model
export interface CommunityPost {
  postId: string;
  userId: string;
  content: string;
  timestamp: Date;
  likes: number;
}

// Saved Guide Relationship
export interface SavedGuide {
  userId: string;
  guideId: string;
  savedAt: Date;
}

// Completed Course Relationship
export interface CompletedCourse {
  userId: string;
  moduleId: string;
  completedAt: Date;
  progress: number;
}
