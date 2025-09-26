'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { CommunityPost } from '../components/CommunityPost';
import { CtaButton } from '../components/CtaButton';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { CommunityPost as CommunityPostType } from '@/lib/types';
import { Users, Plus, Filter, TrendingUp } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Posts', icon: '💬' },
  { id: 'legal-questions', name: 'Legal Questions', icon: '⚖️' },
  { id: 'crypto-discussion', name: 'Crypto Discussion', icon: '₿' },
  { id: 'success-stories', name: 'Success Stories', icon: '🎉' },
  { id: 'general', name: 'General Discussion', icon: '💭' },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const { wallet } = useMiniKit();

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }

      const response = await fetch(`/api/community?${params}`);
      const data = await response.json();

      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!wallet?.address || !newPost.title || !newPost.content) return;

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_post',
          walletAddress: wallet.address,
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          tags: [],
        }),
      });

      if (response.ok) {
        setNewPost({ title: '', content: '', category: 'general' });
        setShowCreateForm(false);
        await fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!wallet?.address) return;

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like_post',
          walletAddress: wallet.address,
          postId,
        }),
      });

      if (response.ok) {
        await fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleAddComment = async (postId: string, commentContent: string) => {
    if (!wallet?.address || !commentContent.trim()) return;

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_comment',
          walletAddress: wallet.address,
          postId,
          commentContent: commentContent.trim(),
        }),
      });

      if (response.ok) {
        await fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
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
            <Users className="h-12 w-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold text-fg">
              Community Forum
            </h1>
          </div>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Connect with others, share experiences, and discuss legal rights and crypto topics
          </p>
        </div>

        {/* Create Post Button */}
        {wallet?.address && (
          <div className="flex justify-center">
            <CtaButton
              variant="primary"
              size="lg"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="h-5 w-5 mr-2" />
              {showCreateForm ? 'Cancel' : 'Create Post'}
            </CtaButton>
          </div>
        )}

        {/* Create Post Form */}
        {showCreateForm && wallet?.address && (
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-fg mb-4">Create New Post</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-white border-opacity-20 rounded-lg text-fg placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter post title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-white border-opacity-20 rounded-lg text-fg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {CATEGORIES.slice(1).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-fg mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 bg-surface border border-white border-opacity-20 rounded-lg text-fg placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="Share your thoughts, questions, or experiences..."
                />
              </div>
              <div className="flex space-x-3">
                <CtaButton
                  variant="primary"
                  onClick={handleCreatePost}
                  disabled={!newPost.title || !newPost.content}
                >
                  Post
                </CtaButton>
                <CtaButton
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </CtaButton>
              </div>
            </div>
          </div>
        )}

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

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <CommunityPost
                key={post.postId}
                post={post}
                onLike={() => handleLikePost(post.postId)}
                onComment={(content) => handleAddComment(post.postId, content)}
                currentUserAddress={wallet?.address}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-fg mb-2">No posts yet</h3>
              <p className="text-muted mb-4">
                {selectedCategory === 'all'
                  ? 'Be the first to start a discussion!'
                  : `No posts in ${CATEGORIES.find(c => c.id === selectedCategory)?.name.toLowerCase()}`}
              </p>
              {wallet?.address && !showCreateForm && (
                <CtaButton
                  variant="primary"
                  onClick={() => setShowCreateForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </CtaButton>
              )}
            </div>
          )}
        </div>

        {/* Community Stats */}
        <div className="glass-card p-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-accent">{posts.length}</div>
              <div className="text-sm text-muted">Total Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {posts.reduce((sum, post) => sum + post.likes, 0)}
              </div>
              <div className="text-sm text-muted">Total Likes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {posts.reduce((sum, post) => sum + post.comments.length, 0)}
              </div>
              <div className="text-sm text-muted">Total Comments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {new Set(posts.map(p => p.userId)).size}
              </div>
              <div className="text-sm text-muted">Active Members</div>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="glass-card p-6 border-l-4 border-accent">
          <h3 className="text-xl font-bold text-fg mb-4">Community Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted">
            <div>
              <h4 className="font-semibold text-fg mb-2">✅ Do:</h4>
              <ul className="space-y-1">
                <li>• Ask thoughtful questions</li>
                <li>• Share personal experiences</li>
                <li>• Help others learn</li>
                <li>• Be respectful and supportive</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-fg mb-2">❌ Don't:</h4>
              <ul className="space-y-1">
                <li>• Give specific legal advice</li>
                <li>• Share financial advice</li>
                <li>• Post spam or irrelevant content</li>
                <li>• Be disrespectful or harassing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

