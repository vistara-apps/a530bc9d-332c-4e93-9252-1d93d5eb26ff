'use client';

import { Play, Lock, Clock, CheckCircle } from 'lucide-react';
import { CourseModule } from '@/lib/types';

interface CourseModuleCardProps {
  module: CourseModule;
  variant?: 'locked' | 'unlocked';
  isCompleted?: boolean;
  onClick?: () => void;
}

export function CourseModuleCard({ 
  module, 
  variant = 'unlocked',
  isCompleted = false,
  onClick 
}: CourseModuleCardProps) {
  const isLocked = variant === 'locked' || (module.isPremium && variant !== 'unlocked');

  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={`glass-card p-6 transition-all duration-200 ${
        isLocked 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:bg-opacity-15 cursor-pointer group'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isCompleted ? (
            <CheckCircle className="h-8 w-8 text-green-400" />
          ) : isLocked ? (
            <Lock className="h-8 w-8 text-muted" />
          ) : (
            <Play className="h-8 w-8 text-accent group-hover:text-white transition-colors duration-200" />
          )}
          <div>
            <h3 className="text-xl font-semibold text-fg group-hover:text-accent transition-colors duration-200">
              {module.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="h-4 w-4 text-muted" />
              <span className="text-sm text-muted">{module.estimatedTime}</span>
              {module.isPremium && (
                <span className="px-2 py-1 bg-accent bg-opacity-20 text-accent text-xs rounded-full">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted mb-4 leading-relaxed">
        {module.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">Module {module.order}</span>
        {!isLocked && (
          <button className="btn-primary text-sm px-4 py-2">
            {isCompleted ? 'Review' : 'Start Module'}
          </button>
        )}
      </div>
    </div>
  );
}
