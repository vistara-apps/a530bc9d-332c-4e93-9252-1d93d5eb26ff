'use client';

import { useState } from 'react';
import { CommunityPost as CommunityPostType, Comment } from '@/lib/types';
import { Heart, MessageCircle, Send, MoreVertical, Flag } from 'lucide-react';
import { CtaButton } from './CtaButton';

interface CommunityPostProps {
  post: CommunityPostType;
  onLike: () => void;
  onComment: (content: string) => void;
  currentUserAddress?: string;
}

export function CommunityPost({ post, onLike, onComment, currentUserAddress }: CommunityPostProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment('');
      setShowCommentForm(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'legal-questions': 'bg-blue-500/20 text-blue-400',
      'crypto-discussion': 'bg-orange-500/20 text-orange-400',
      'success-stories': 'bg-green-500/20 text-green-400',
      'general': 'bg-gray-500/20 text-gray-400',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  const isLiked = currentUserAddress ? post.likedBy.includes(currentUserAddress) : false;

  return (
    <div className="glass-card p-6">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <span className="text-accent font-semibold text-sm">
              {post.userId.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-fg">
                {`${post.userId.slice(0, 6)}...${post.userId.slice(-4)}`}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                {post.category.replace('-', ' ')}
              </span>
            </div>
            <div className="text-sm text-muted">
              {formatTimeAgo(post.timestamp)}
            </div>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-surface transition-colors duration-200">
          <MoreVertical className="h-4 w-4 text-muted" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-fg mb-2">{post.title}</h3>
        <p className="text-muted leading-relaxed">{post.content}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface/50 rounded-full text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={onLike}
            disabled={!currentUserAddress}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              isLiked
                ? 'text-red-400 bg-red-400/10'
                : 'text-muted hover:text-red-400 hover:bg-red-400/10'
            } ${!currentUserAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>
        </div>

        <button className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors duration-200">
          <Flag className="h-4 w-4" />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white border-opacity-10">
          {/* Existing Comments */}
          {post.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {post.comments.map((comment) => (
                <div key={comment.commentId} className="flex space-x-3">
                  <div className="w-8 h-8 bg-surface/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-muted font-semibold text-xs">
                      {comment.userId.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-fg text-sm">
                        {`${comment.userId.slice(0, 6)}...${comment.userId.slice(-4)}`}
                      </span>
                      <span className="text-xs text-muted">
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{comment.content}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <button className="text-xs text-muted hover:text-accent transition-colors duration-200">
                        Like ({comment.likes})
                      </button>
                      <button className="text-xs text-muted hover:text-accent transition-colors duration-200">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          {currentUserAddress && (
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-semibold text-xs">
                  {currentUserAddress.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                {showCommentForm ? (
                  <div className="space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full px-3 py-2 bg-surface border border-white border-opacity-20 rounded-lg text-fg placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm"
                    />
                    <div className="flex space-x-2">
                      <CtaButton
                        variant="primary"
                        size="sm"
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Comment
                      </CtaButton>
                      <CtaButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setShowCommentForm(false);
                          setNewComment('');
                        }}
                      >
                        Cancel
                      </CtaButton>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCommentForm(true)}
                    className="text-muted hover:text-accent transition-colors duration-200 text-sm"
                  >
                    Write a comment...
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

