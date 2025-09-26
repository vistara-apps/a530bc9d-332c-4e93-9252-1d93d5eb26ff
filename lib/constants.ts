export const LEGAL_CATEGORIES = [
  { id: 'consumer-rights', name: 'Consumer Rights', icon: '🛒' },
  { id: 'employment', name: 'Employment', icon: '💼' },
  { id: 'landlord-tenant', name: 'Landlord-Tenant', icon: '🏠' },
  { id: 'general', name: 'General Rights', icon: '⚖️' },
] as const;

export const CRYPTO_MODULES = [
  {
    id: 'solidity-basics',
    title: 'Solidity Basics',
    description: 'Learn the fundamentals of Solidity programming',
    estimatedTime: '2 hours',
    isPremium: false,
    order: 1,
  },
  {
    id: 'smart-contract-security',
    title: 'Smart Contract Security',
    description: 'Best practices for secure smart contract development',
    estimatedTime: '3 hours',
    isPremium: true,
    order: 2,
  },
  {
    id: 'defi-protocols',
    title: 'DeFi Protocol Development',
    description: 'Build decentralized finance applications',
    estimatedTime: '4 hours',
    isPremium: true,
    order: 3,
  },
] as const;

export const SAMPLE_GUIDES = [
  {
    guideId: 'tenant-rights-101',
    title: 'Tenant Rights 101',
    category: 'landlord-tenant' as const,
    content: 'Essential rights every tenant should know...',
    createdAt: new Date(),
    isPremium: false,
  },
  {
    guideId: 'workplace-harassment',
    title: 'Dealing with Workplace Harassment',
    category: 'employment' as const,
    content: 'Steps to take when facing workplace harassment...',
    createdAt: new Date(),
    isPremium: false,
  },
  {
    guideId: 'consumer-fraud-protection',
    title: 'Consumer Fraud Protection',
    category: 'consumer-rights' as const,
    content: 'How to protect yourself from consumer fraud...',
    createdAt: new Date(),
    isPremium: true,
  },
] as const;
