// Database integration using Upstash Redis
import { Redis } from '@upstash/redis';
import {
  User,
  Query,
  Guide,
  CourseModule,
  CommunityPost,
  AnalyticsEvent,
  PaymentTransaction,
  UserProgress
} from './types';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Key prefixes for different data types
const KEYS = {
  USER: 'user:',
  QUERY: 'query:',
  GUIDE: 'guide:',
  COURSE_MODULE: 'course_module:',
  COMMUNITY_POST: 'community_post:',
  ANALYTICS: 'analytics:',
  PAYMENT: 'payment:',
  USER_PROGRESS: 'user_progress:',
  INDEX: 'index:',
} as const;

// User operations
export const userDb = {
  async get(userId: string): Promise<User | null> {
    const data = await redis.get(`${KEYS.USER}${userId}`);
    return data ? JSON.parse(data as string) : null;
  },

  async set(user: User): Promise<void> {
    await redis.set(`${KEYS.USER}${user.userId}`, JSON.stringify(user));
    // Update user index
    await redis.sadd(`${KEYS.INDEX}users`, user.userId);
  },

  async update(userId: string, updates: Partial<User>): Promise<User | null> {
    const existing = await this.get(userId);
    if (!existing) return null;

    const updated = { ...existing, ...updates, lastActive: new Date() };
    await this.set(updated);
    return updated;
  },

  async getAll(): Promise<User[]> {
    const userIds = await redis.smembers(`${KEYS.INDEX}users`);
    const users = await Promise.all(
      userIds.map(id => this.get(id))
    );
    return users.filter(Boolean) as User[];
  },

  async create(walletAddress: string): Promise<User> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: User = {
      userId,
      walletAddress,
      createdAt: new Date(),
      lastActive: new Date(),
      totalQueries: 0,
      savedGuides: [],
      completedCourses: [],
      balance: 0,
    };
    await this.set(user);
    return user;
  },
};

// Query operations
export const queryDb = {
  async get(queryId: string): Promise<Query | null> {
    const data = await redis.get(`${KEYS.QUERY}${queryId}`);
    return data ? JSON.parse(data as string) : null;
  },

  async set(query: Query): Promise<void> {
    await redis.set(`${KEYS.QUERY}${query.queryId}`, JSON.stringify(query));
    // Update user's query index
    await redis.sadd(`${KEYS.INDEX}user_queries:${query.userId}`, query.queryId);
  },

  async getByUser(userId: string, limit = 50): Promise<Query[]> {
    const queryIds = await redis.smembers(`${KEYS.INDEX}user_queries:${userId}`);
    const queries = await Promise.all(
      queryIds.slice(0, limit).map(id => this.get(id))
    );
    return queries.filter(Boolean) as Query[];
  },

  async create(userId: string, question: string, answer: string, isPremium = false, cost?: number): Promise<Query> {
    const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const query: Query = {
      queryId,
      userId,
      question,
      answer,
      timestamp: new Date(),
      isPremium,
      cost,
    };
    await this.set(query);
    return query;
  },
};

// Guide operations
export const guideDb = {
  async get(guideId: string): Promise<Guide | null> {
    const data = await redis.get(`${KEYS.GUIDE}${guideId}`);
    return data ? JSON.parse(data as string) : null;
  },

  async set(guide: Guide): Promise<void> {
    await redis.set(`${KEYS.GUIDE}${guide.guideId}`, JSON.stringify(guide));
    // Update category index
    await redis.sadd(`${KEYS.INDEX}guides_category:${guide.category}`, guide.guideId);
    // Update premium index
    if (guide.isPremium) {
      await redis.sadd(`${KEYS.INDEX}guides_premium`, guide.guideId);
    }
  },

  async getByCategory(category: string): Promise<Guide[]> {
    const guideIds = await redis.smembers(`${KEYS.INDEX}guides_category:${category}`);
    const guides = await Promise.all(
      guideIds.map(id => this.get(id))
    );
    return guides.filter(Boolean) as Guide[];
  },

  async getPremium(): Promise<Guide[]> {
    const guideIds = await redis.smembers(`${KEYS.INDEX}guides_premium`);
    const guides = await Promise.all(
      guideIds.map(id => this.get(id))
    );
    return guides.filter(Boolean) as Guide[];
  },

  async search(query: string, category?: string): Promise<Guide[]> {
    // Simple search implementation - in production, consider using Redisearch
    const allGuides = category ? await this.getByCategory(category) : await this.getAll();
    return allGuides.filter(guide =>
      guide.title.toLowerCase().includes(query.toLowerCase()) ||
      guide.content.toLowerCase().includes(query.toLowerCase()) ||
      guide.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  },

  async getAll(): Promise<Guide[]> {
    // Get all guide IDs from category indices
    const categories = ['consumer-rights', 'employment', 'landlord-tenant', 'general'];
    const allGuideIds = new Set<string>();

    for (const category of categories) {
      const ids = await redis.smembers(`${KEYS.INDEX}guides_category:${category}`);
      ids.forEach(id => allGuideIds.add(id));
    }

    const guides = await Promise.all(
      Array.from(allGuideIds).map(id => this.get(id))
    );
    return guides.filter(Boolean) as Guide[];
  },
};

// Course operations
export const courseDb = {
  async getModule(moduleId: string): Promise<CourseModule | null> {
    const data = await redis.get(`${KEYS.COURSE_MODULE}${moduleId}`);
    return data ? JSON.parse(data as string) : null;
  },

  async setModule(module: CourseModule): Promise<void> {
    await redis.set(`${KEYS.COURSE_MODULE}${module.moduleId}`, JSON.stringify(module));
  },

  async getCourseModules(courseId: string): Promise<CourseModule[]> {
    const moduleIds = await redis.smembers(`${KEYS.INDEX}course_modules:${courseId}`);
    const modules = await Promise.all(
      moduleIds.map(id => this.getModule(id))
    );
    return (modules.filter(Boolean) as CourseModule[]).sort((a, b) => a.order - b.order);
  },

  async getAllModules(): Promise<CourseModule[]> {
    const moduleIds = await redis.smembers(`${KEYS.INDEX}all_course_modules`);
    const modules = await Promise.all(
      moduleIds.map(id => this.getModule(id))
    );
    return modules.filter(Boolean) as CourseModule[];
  },
};

// Community operations
export const communityDb = {
  async getPost(postId: string): Promise<CommunityPost | null> {
    const data = await redis.get(`${KEYS.COMMUNITY_POST}${postId}`);
    return data ? JSON.parse(data as string) : null;
  },

  async setPost(post: CommunityPost): Promise<void> {
    await redis.set(`${KEYS.COMMUNITY_POST}${post.postId}`, JSON.stringify(post));
    // Update category index
    await redis.sadd(`${KEYS.INDEX}community_category:${post.category}`, post.postId);
    // Update recent posts
    await redis.zadd(`${KEYS.INDEX}community_recent`, {
      score: post.timestamp.getTime(),
      member: post.postId,
    });
  },

  async getPostsByCategory(category: string, limit = 20): Promise<CommunityPost[]> {
    const postIds = await redis.smembers(`${KEYS.INDEX}community_category:${category}`);
    const posts = await Promise.all(
      postIds.slice(0, limit).map(id => this.getPost(id))
    );
    return posts.filter(Boolean) as CommunityPost[];
  },

  async getRecentPosts(limit = 20): Promise<CommunityPost[]> {
    const postIds = await redis.zrevrange(`${KEYS.INDEX}community_recent`, 0, limit - 1);
    const posts = await Promise.all(
      postIds.map(id => this.getPost(id))
    );
    return posts.filter(Boolean) as CommunityPost[];
  },

  async createPost(userId: string, title: string, content: string, category: string, tags: string[] = []): Promise<CommunityPost> {
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const post: CommunityPost = {
      postId,
      userId,
      title,
      content,
      timestamp: new Date(),
      likes: 0,
      likedBy: [],
      comments: [],
      tags,
      category,
    };
    await this.setPost(post);
    return post;
  },
};

// Analytics operations
export const analyticsDb = {
  async logEvent(event: AnalyticsEvent): Promise<void> {
    const eventKey = `${KEYS.ANALYTICS}${event.eventId}`;
    await redis.set(eventKey, JSON.stringify(event));
    // Add to user events index
    if (event.userId) {
      await redis.sadd(`${KEYS.INDEX}user_events:${event.userId}`, event.eventId);
    }
    // Add to event type index
    await redis.sadd(`${KEYS.INDEX}events_type:${event.eventType}`, event.eventId);
    // Add to time-based index (for analytics queries)
    await redis.zadd(`${KEYS.INDEX}events_time`, {
      score: event.timestamp.getTime(),
      member: event.eventId,
    });
  },

  async getUserEvents(userId: string, limit = 100): Promise<AnalyticsEvent[]> {
    const eventIds = await redis.smembers(`${KEYS.INDEX}user_events:${userId}`);
    const events = await Promise.all(
      eventIds.slice(0, limit).map(async (id) => {
        const data = await redis.get(`${KEYS.ANALYTICS}${id}`);
        return data ? JSON.parse(data as string) : null;
      })
    );
    return events.filter(Boolean) as AnalyticsEvent[];
  },
};

// Payment operations
export const paymentDb = {
  async createTransaction(transaction: PaymentTransaction): Promise<void> {
    await redis.set(`${KEYS.PAYMENT}${transaction.transactionId}`, JSON.stringify(transaction));
    // Update user transactions index
    await redis.sadd(`${KEYS.INDEX}user_transactions:${transaction.userId}`, transaction.transactionId);
  },

  async getTransaction(transactionId: string): Promise<PaymentTransaction | null> {
    const data = await redis.get(`${KEYS.PAYMENT}${transactionId}`);
    return data ? JSON.parse(data as string) : null;
  },

  async getUserTransactions(userId: string, limit = 50): Promise<PaymentTransaction[]> {
    const transactionIds = await redis.smembers(`${KEYS.INDEX}user_transactions:${userId}`);
    const transactions = await Promise.all(
      transactionIds.slice(0, limit).map(id => this.getTransaction(id))
    );
    return transactions.filter(Boolean) as PaymentTransaction[];
  },

  async updateTransactionStatus(transactionId: string, status: PaymentTransaction['status'], transactionHash?: string): Promise<void> {
    const existing = await this.getTransaction(transactionId);
    if (!existing) return;

    const updated = { ...existing, status, transactionHash };
    await redis.set(`${KEYS.PAYMENT}${transactionId}`, JSON.stringify(updated));
  },
};

// User progress operations
export const progressDb = {
  async get(userId: string, courseId: string): Promise<UserProgress | null> {
    const data = await redis.get(`${KEYS.USER_PROGRESS}${userId}:${courseId}`);
    return data ? JSON.parse(data as string) : null;
  },

  async set(progress: UserProgress): Promise<void> {
    await redis.set(`${KEYS.USER_PROGRESS}${progress.userId}:${progress.courseId}`, JSON.stringify(progress));
  },

  async update(userId: string, courseId: string, updates: Partial<UserProgress>): Promise<UserProgress | null> {
    const existing = await this.get(userId, courseId);
    if (!existing) return null;

    const updated = { ...existing, ...updates, lastAccessed: new Date() };
    await this.set(updated);
    return updated;
  },

  async create(userId: string, courseId: string): Promise<UserProgress> {
    const progress: UserProgress = {
      userId,
      courseId,
      completedModules: [],
      currentModule: '',
      quizScores: {},
      lastAccessed: new Date(),
    };
    await this.set(progress);
    return progress;
  },
};

// Utility functions
export const dbUtils = {
  async initializeData(): Promise<void> {
    // Initialize course modules
    const solidityBasics: CourseModule = {
      moduleId: 'solidity-basics',
      title: 'Solidity Basics',
      description: 'Learn the fundamentals of Solidity programming language',
      content: `# Solidity Basics

Solidity is a high-level programming language designed for implementing smart contracts on Ethereum-compatible blockchains like Base.

## Key Concepts

### Variables and Types
\`\`\`solidity
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public storedData;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
\`\`\`

### Functions
- **public**: Can be called externally
- **private**: Only callable within the contract
- **view**: Read-only, doesn't modify state
- **pure**: Doesn't read or modify state

### Modifiers
\`\`\`solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
}
\`\`\`
`,
      order: 1,
      isPremium: false,
      estimatedTime: '2 hours',
      prerequisites: [],
      learningObjectives: [
        'Understand Solidity syntax and structure',
        'Work with variables and data types',
        'Create and use functions',
        'Implement modifiers for access control'
      ],
      codeExamples: [
        {
          title: 'Simple Storage Contract',
          language: 'solidity',
          code: `pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}`,
          explanation: 'A basic contract that stores and retrieves a number'
        }
      ]
    };

    await courseDb.setModule(solidityBasics);
    await redis.sadd(`${KEYS.INDEX}course_modules:solidity-course`, solidityBasics.moduleId);
    await redis.sadd(`${KEYS.INDEX}all_course_modules`, solidityBasics.moduleId);

    // Initialize sample guides
    const tenantRightsGuide: Guide = {
      guideId: 'tenant-rights-101',
      title: 'Tenant Rights 101',
      category: 'landlord-tenant',
      content: `# Tenant Rights 101

Understanding your rights as a tenant is crucial for maintaining a positive landlord-tenant relationship and protecting yourself from unfair practices.

## Key Rights

### 1. Right to Habitable Living Conditions
Your landlord must maintain the property in a habitable condition, including:
- Working plumbing and heating
- Safe electrical systems
- Clean and sanitary common areas
- Structural components in good repair

### 2. Right to Privacy
Landlords generally cannot enter your rental unit without proper notice, typically 24-48 hours, except in emergencies.

### 3. Right to Withhold Rent (with Caution)
In some jurisdictions, you may withhold rent if the landlord fails to make necessary repairs, but this should be a last resort and requires following specific legal procedures.

### 4. Protection from Retaliation
Landlords cannot retaliate against you for exercising your rights, such as by increasing rent or terminating your lease.

## Important Notes
- Laws vary by jurisdiction
- Always document communications and issues
- Consider consulting local tenant rights organizations
- Keep records of all rent payments and maintenance requests`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPremium: false,
      tags: ['tenant', 'rights', 'housing', 'landlord'],
      readCount: 0,
      author: 'KRYCE Legal Team'
    };

    await guideDb.set(guideId: tenantRightsGuide.guideId, tenantRightsGuide);

    console.log('Database initialized with sample data');
  },

  async clearAll(): Promise<void> {
    // Clear all data - use with caution
    const keys = await redis.keys('*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};

