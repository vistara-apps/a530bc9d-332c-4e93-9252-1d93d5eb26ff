'use client';

import { BookOpen, Lock, Clock } from 'lucide-react';
import { Guide } from '@/lib/types';

interface GuideCardProps {
  guide: Guide;
  variant?: 'small' | 'large';
  onClick?: () => void;
}

export function GuideCard({ guide, variant = 'small', onClick }: GuideCardProps) {
  const categoryIcons = {
    'consumer-rights': '🛒',
    'employment': '💼',
    'landlord-tenant': '🏠',
    'general': '⚖️',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card p-4 hover:bg-opacity-15 transition-all duration-200 cursor-pointer group ${
        variant === 'large' ? 'p-6' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{categoryIcons[guide.category]}</span>
          {guide.isPremium && (
            <Lock className="h-4 w-4 text-accent" />
          )}
        </div>
        <BookOpen className="h-5 w-5 text-muted group-hover:text-accent transition-colors duration-200" />
      </div>

      <h3 className={`font-semibold text-fg mb-2 group-hover:text-accent transition-colors duration-200 ${
        variant === 'large' ? 'text-xl' : 'text-lg'
      }`}>
        {guide.title}
      </h3>

      <p className="text-muted text-sm mb-3 line-clamp-2">
        {guide.content.substring(0, 120)}...
      </p>

      <div className="flex items-center justify-between text-xs text-muted">
        <span className="capitalize">{guide.category.replace('-', ' ')}</span>
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>5 min read</span>
        </div>
      </div>
    </div>
  );
}
