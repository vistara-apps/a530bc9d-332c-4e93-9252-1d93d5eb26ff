// Core data types for KRYCE Navigator

export interface User {
  userId: string;
  walletAddress: string;
  createdAt: Date;
  lastActive: Date;
  totalQueries: number;
  savedGuides: string[];
  completedCourses: string[];
  balance: number; // In wei or smallest unit
  subscriptionTier?: 'free' | 'premium';
}

export interface Query {
  queryId: string;
  userId: string;
  question: string;
  answer: string;
  timestamp: Date;
  category?: string;
  isPremium: boolean;
  cost?: number; // Cost in wei if premium
}

export interface Guide {
  guideId: string;
  title: string;
  category: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPremium: boolean;
  tags: string[];
  readCount: number;
  author: string;
}

export interface CourseModule {
  moduleId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  isPremium: boolean;
  estimatedTime: string; // e.g., "2 hours"
  prerequisites: string[]; // module IDs
  learningObjectives: string[];
  quiz?: Quiz;
  codeExamples?: CodeExample[];
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  modules: CourseModule[];
  isPremium: boolean;
  totalEstimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface CommunityPost {
  postId: string;
  userId: string;
  title: string;
  content: string;
  timestamp: Date;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  tags: string[];
  category: string;
}

export interface Comment {
  commentId: string;
  userId: string;
  content: string;
  timestamp: Date;
  likes: number;
  likedBy: string[];
  replies?: Comment[];
}

export interface AnalyticsEvent {
  eventId: string;
  userId?: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
  sessionId: string;
}

export interface PaymentTransaction {
  transactionId: string;
  userId: string;
  amount: number; // In wei
  currency: string; // 'ETH' or token symbol
  type: 'query' | 'guide' | 'course' | 'subscription';
  itemId: string; // ID of the purchased item
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
  timestamp: Date;
}

// UI State Types
export interface UserProgress {
  userId: string;
  courseId: string;
  completedModules: string[];
  currentModule: string;
  quizScores: Record<string, number>; // moduleId -> score
  lastAccessed: Date;
}

export interface SearchFilters {
  category?: string;
  isPremium?: boolean;
  difficulty?: string;
  tags?: string[];
}

export interface NotificationData {
  id: string;
  type: 'course_completion' | 'new_guide' | 'payment_success' | 'community_reply';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

