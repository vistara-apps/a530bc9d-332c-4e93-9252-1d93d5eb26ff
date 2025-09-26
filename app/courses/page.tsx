'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { CourseModuleCard } from '../components/CourseModuleCard';
import { CtaButton } from '../components/CtaButton';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { CourseModule, UserProgress } from '@/lib/types';
import { GraduationCap, Clock, CheckCircle, Play } from 'lucide-react';

export default function CoursesPage() {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { wallet } = useMiniKit();

  useEffect(() => {
    fetchCourses();
  }, [wallet?.address]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams();
      if (wallet?.address) {
        params.set('walletAddress', wallet.address);
      }

      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();

      if (data.modules) {
        setModules(data.modules);
      }
      if (data.progress) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = async () => {
    if (!wallet?.address) return;

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_course',
          courseId: 'solidity-course',
          walletAddress: wallet.address,
        }),
      });

      if (response.ok) {
        await fetchCourses(); // Refresh progress
      }
    } catch (error) {
      console.error('Failed to start course:', error);
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
            <GraduationCap className="h-12 w-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold text-fg">
              Smart Contract Development
            </h1>
          </div>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Master Solidity programming and build secure smart contracts on Base
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>8 hours total</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>{modules.length} modules</span>
            </div>
            <div className="px-3 py-1 bg-accent/10 rounded-full text-accent text-xs font-medium">
              Beginner Friendly
            </div>
          </div>
        </div>

        {/* Course Overview */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-fg mb-4">Course Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-fg mb-2">What You'll Learn</h3>
              <ul className="space-y-2 text-muted">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Solidity syntax and data types</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Smart contract architecture</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Security best practices</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Deployment to Base network</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-fg mb-2">Prerequisites</h3>
              <ul className="space-y-2 text-muted">
                <li>• Basic programming knowledge</li>
                <li>• Understanding of blockchain concepts</li>
                <li>• Web3 wallet (MetaMask, Coinbase Wallet)</li>
              </ul>
              {!progress && wallet?.address && (
                <div className="mt-4">
                  <CtaButton
                    variant="primary"
                    size="sm"
                    onClick={handleStartCourse}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Course
                  </CtaButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Course Modules</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modules.map((module) => (
              <CourseModuleCard
                key={module.moduleId}
                module={module}
                variant={module.isPremium ? 'locked' : 'unlocked'}
                progress={progress ? {
                  isCompleted: progress.completedModules.includes(module.moduleId),
                  isCurrent: progress.currentModule === module.moduleId,
                } : undefined}
                onClick={() => {
                  // Navigate to module
                  window.location.href = `/courses/${module.moduleId}`;
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        {progress && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-fg mb-4">Your Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {progress.completedModules.length}
                </div>
                <div className="text-sm text-muted">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round((progress.completedModules.length / modules.length) * 100)}%
                </div>
                <div className="text-sm text-muted">Course Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Object.keys(progress.quizScores).length}
                </div>
                <div className="text-sm text-muted">Quizzes Taken</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

