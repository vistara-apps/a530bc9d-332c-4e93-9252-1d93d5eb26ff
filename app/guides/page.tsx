'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { GuideCard } from '../components/GuideCard';
import { CtaButton } from '../components/CtaButton';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Guide } from '@/lib/types';
import { BookOpen, Search, Filter, Bookmark, BookmarkCheck } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Guides', icon: '📚' },
  { id: 'consumer-rights', name: 'Consumer Rights', icon: '🛒' },
  { id: 'employment', name: 'Employment', icon: '💼' },
  { id: 'landlord-tenant', name: 'Landlord-Tenant', icon: '🏠' },
  { id: 'general', name: 'General Rights', icon: '⚖️' },
];

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const { wallet } = useMiniKit();

  useEffect(() => {
    fetchGuides();
  }, [wallet?.address]);

  useEffect(() => {
    filterGuides();
  }, [guides, searchQuery, selectedCategory, showSavedOnly]);

  const fetchGuides = async () => {
    try {
      const params = new URLSearchParams();
      if (wallet?.address) {
        params.set('walletAddress', wallet.address);
      }

      const response = await fetch(`/api/guides?${params}`);
      const data = await response.json();

      if (data.guides) {
        setGuides(data.guides);
      }
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGuides = () => {
    let filtered = guides;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guide => guide.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(guide =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by saved status
    if (showSavedOnly) {
      filtered = filtered.filter(guide => guide.isSaved);
    }

    setFilteredGuides(filtered);
  };

  const handleSaveGuide = async (guideId: string, isCurrentlySaved: boolean) => {
    if (!wallet?.address) return;

    try {
      const response = await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId,
          walletAddress: wallet.address,
          action: isCurrentlySaved ? 'unsave' : 'save',
        }),
      });

      if (response.ok) {
        await fetchGuides(); // Refresh guides with updated saved status
      }
    } catch (error) {
      console.error('Failed to save/unsave guide:', error);
    }
  };

  const handleReadGuide = async (guideId: string) => {
    if (!wallet?.address) return;

    try {
      await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId,
          walletAddress: wallet.address,
          action: 'read',
        }),
      });
    } catch (error) {
      console.error('Failed to track guide read:', error);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <BookOpen className="h-12 w-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold text-fg">
              Know Your Rights Library
            </h1>
          </div>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Comprehensive legal guides and resources to help you understand and exercise your rights
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-white border-opacity-20 rounded-lg text-fg placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-accent text-white'
                    : 'bg-surface text-muted hover:text-fg hover:bg-opacity-80'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Additional Filters */}
          {wallet?.address && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showSavedOnly
                    ? 'bg-accent text-white'
                    : 'bg-surface text-muted hover:text-fg hover:bg-opacity-80'
                }`}
              >
                {showSavedOnly ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                <span>Saved Guides Only</span>
              </button>
            </div>
          )}
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <GuideCard
                key={guide.guideId}
                guide={guide}
                onClick={() => {
                  handleReadGuide(guide.guideId);
                  // In a real app, this would navigate to a detailed guide page
                  console.log('Navigate to guide:', guide.guideId);
                }}
                onSave={() => handleSaveGuide(guide.guideId, guide.isSaved || false)}
                showSaveButton={!!wallet?.address}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-fg mb-2">No guides found</h3>
            <p className="text-muted">
              {searchQuery || selectedCategory !== 'all' || showSavedOnly
                ? 'Try adjusting your search or filters'
                : 'Check back later for new guides'}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="glass-card p-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-accent">{guides.length}</div>
              <div className="text-sm text-muted">Total Guides</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {guides.filter(g => g.isPremium).length}
              </div>
              <div className="text-sm text-muted">Premium Guides</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {guides.reduce((sum, g) => sum + g.readCount, 0)}
              </div>
              <div className="text-sm text-muted">Total Reads</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

