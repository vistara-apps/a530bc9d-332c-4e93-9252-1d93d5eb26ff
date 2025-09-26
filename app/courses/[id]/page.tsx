'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '../../components/AppShell';
import { CtaButton } from '../../components/CtaButton';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { CourseModule, UserProgress } from '@/lib/types';
import { ArrowLeft, CheckCircle, Clock, Code, Play, ChevronRight } from 'lucide-react';

export default function CourseModulePage() {
  const params = useParams();
  const moduleId = params.id as string;
  const [module, setModule] = useState<CourseModule | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const { wallet } = useMiniKit();

  useEffect(() => {
    fetchModule();
  }, [moduleId, wallet?.address]);

  const fetchModule = async () => {
    try {
      const params = new URLSearchParams();
      params.set('courseId', 'solidity-course');
      if (wallet?.address) {
        params.set('walletAddress', wallet.address);
      }

      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();

      const foundModule = data.modules?.find((m: CourseModule) => m.moduleId === moduleId);
      if (foundModule) {
        setModule(foundModule);
      }

      if (data.progress) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Failed to fetch module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteModule = async () => {
    if (!wallet?.address || !module) return;

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete_module',
          moduleId: module.moduleId,
          courseId: 'solidity-course',
          walletAddress: wallet.address,
        }),
      });

      if (response.ok) {
        await fetchModule(); // Refresh progress
      }
    } catch (error) {
      console.error('Failed to complete module:', error);
    }
  };

  const handleUpdateProgress = async () => {
    if (!wallet?.address || !module) return;

    try {
      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_progress',
          courseId: 'solidity-course',
          moduleId: module.moduleId,
          walletAddress: wallet.address,
        }),
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
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

  if (!module) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-fg mb-4">Module Not Found</h1>
          <CtaButton onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </CtaButton>
        </div>
      </AppShell>
    );
  }

  const isCompleted = progress?.completedModules.includes(module.moduleId);
  const isCurrent = progress?.currentModule === module.moduleId;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <CtaButton
            variant="secondary"
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </CtaButton>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted">
              <Clock className="h-4 w-4" />
              <span>{module.estimatedTime}</span>
            </div>
            {isCompleted && (
              <div className="flex items-center space-x-2 text-sm text-accent">
                <CheckCircle className="h-4 w-4" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Module Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-fg">
                {module.title}
              </h1>
              <p className="text-lg text-muted">
                {module.description}
              </p>
            </div>
            {!isCompleted && wallet?.address && (
              <CtaButton
                variant="primary"
                onClick={handleCompleteModule}
                disabled={!isCurrent}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </CtaButton>
            )}
          </div>

          {/* Learning Objectives */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-fg mb-4">Learning Objectives</h3>
            <ul className="space-y-2">
              {module.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Module Content */}
        <div className="glass-card p-6">
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: module.content.replace(/\n/g, '<br />') }} />
          </div>
        </div>

        {/* Code Examples */}
        {module.codeExamples && module.codeExamples.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-fg">Code Examples</h3>
            {module.codeExamples.map((example, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Code className="h-5 w-5 text-accent" />
                  <h4 className="font-semibold text-fg">{example.title}</h4>
                </div>
                <p className="text-muted mb-4">{example.explanation}</p>
                <pre className="bg-surface p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-fg">{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Quiz Section */}
        {module.quiz && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-fg mb-4">Knowledge Check</h3>
            <QuizComponent
              quiz={module.quiz}
              moduleId={module.moduleId}
              onComplete={handleUpdateProgress}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-white border-opacity-10">
          <CtaButton
            variant="secondary"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </CtaButton>

          {!isCompleted && (
            <CtaButton
              variant="primary"
              onClick={handleCompleteModule}
              disabled={!isCurrent}
            >
              Complete Module
              <ChevronRight className="h-4 w-4 ml-2" />
            </CtaButton>
          )}
        </div>
      </div>
    </AppShell>
  );
}

// Quiz Component
function QuizComponent({
  quiz,
  moduleId,
  onComplete
}: {
  quiz: any;
  moduleId: string;
  onComplete: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { wallet } = useMiniKit();

  const handleSubmit = async () => {
    const correctAnswers = quiz.questions.reduce((count: number, q: any, index: number) => {
      return count + (answers[q.questionId] === q.correctAnswer ? 1 : 0);
    }, 0);

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    // Submit quiz score
    if (wallet?.address) {
      try {
        await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit_quiz',
            moduleId,
            courseId: 'solidity-course',
            walletAddress: wallet.address,
            quizScore: finalScore,
          }),
        });
        onComplete();
      } catch (error) {
        console.error('Failed to submit quiz:', error);
      }
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-accent">{score}%</div>
        <p className="text-muted">
          {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep practicing!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {quiz.questions.map((question: any, qIndex: number) => (
        <div key={question.questionId} className="space-y-3">
          <h4 className="font-medium text-fg">
            {qIndex + 1}. {question.question}
          </h4>
          <div className="space-y-2">
            {question.options.map((option: string, oIndex: number) => (
              <label key={oIndex} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.questionId}
                  value={oIndex}
                  onChange={(e) => setAnswers({
                    ...answers,
                    [question.questionId]: parseInt(e.target.value)
                  })}
                  className="text-accent"
                />
                <span className="text-muted">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <CtaButton
        variant="primary"
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== quiz.questions.length}
        className="w-full"
      >
        Submit Quiz
      </CtaButton>
    </div>
  );
}

