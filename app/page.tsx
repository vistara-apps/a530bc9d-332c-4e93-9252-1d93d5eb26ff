'use client';

import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { QueryInput } from './components/QueryInput';
import { AnswerDisplay } from './components/AnswerDisplay';
import { GuideCard } from './components/GuideCard';
import { CourseModuleCard } from './components/CourseModuleCard';
import { CtaButton } from './components/CtaButton';
import { Shield, BookOpen, GraduationCap, Zap } from 'lucide-react';
import { SAMPLE_GUIDES, CRYPTO_MODULES } from '@/lib/constants';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

export default function HomePage() {
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleQuery = async (question: string) => {
    // Simulate AI response - in production, this would call an AI service
    const sampleAnswers = [
      "Based on general tenant rights principles, you typically have the right to a habitable living space, privacy, and proper notice before landlord entry. However, specific rights vary by jurisdiction. Key protections usually include: 1) Right to essential services (heat, water, electricity), 2) Right to reasonable notice (usually 24-48 hours) before landlord visits, 3) Right to withhold rent in some cases if major repairs aren't made. Always check your local tenant protection laws for specific details.",
      "In most employment situations, you have several fundamental rights: 1) Right to a safe workplace free from discrimination and harassment, 2) Right to fair wages and overtime pay as per labor laws, 3) Right to reasonable accommodations for disabilities, 4) Right to take legally protected leave (FMLA, etc.). If you're experiencing workplace issues, document everything and consider contacting your HR department or local labor board.",
      "Consumer protection laws generally give you rights including: 1) Right to accurate product information and fair pricing, 2) Right to return defective products within reasonable timeframes, 3) Protection against fraudulent or deceptive practices, 4) Right to dispute charges and seek refunds for unauthorized transactions. Keep receipts and document all communications with businesses."
    ];
    
    const randomAnswer = sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCurrentAnswer(randomAnswer);
    setShowAnswer(true);
  };

  const handleSaveAnswer = () => {
    // In production, this would save to user's account
    console.log('Answer saved for user');
  };

  return (
    <AppShell>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-12 w-12 text-accent" />
            <h1 className="text-4xl md:text-6xl font-bold text-fg">
              KRYCE
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto">
            Know-Your-Rights & Crypto Education
          </p>
          <p className="text-lg text-muted max-w-xl mx-auto">
            Your rights, your crypto, your knowledge. Empowered.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CtaButton 
            variant="primary" 
            size="lg"
            onClick={() => document.getElementById('query-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Zap className="h-5 w-5" />
            Ask Legal Question
          </CtaButton>
          <CtaButton 
            variant="secondary" 
            size="lg"
            onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <GraduationCap className="h-5 w-5" />
            Start Learning
          </CtaButton>
        </div>

        {/* Legal Rights Query Section */}
        <section id="query-section" className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-fg mb-2">Ask About Your Rights</h2>
            <p className="text-muted">Get instant, clear guidance on legal situations</p>
          </div>
          
          <QueryInput onSubmit={handleQuery} />
          
          {showAnswer && (
            <AnswerDisplay 
              answer={currentAnswer} 
              onSave={handleSaveAnswer}
            />
          )}
        </section>

        {/* Featured Guides Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-fg mb-2">Know Your Rights Library</h2>
              <p className="text-muted">Essential legal knowledge at your fingertips</p>
            </div>
            <CtaButton variant="secondary">
              <BookOpen className="h-4 w-4" />
              View All Guides
            </CtaButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_GUIDES.map((guide) => (
              <GuideCard 
                key={guide.guideId} 
                guide={guide}
                onClick={() => console.log('Navigate to guide:', guide.guideId)}
              />
            ))}
          </div>
        </section>

        {/* Crypto Education Section */}
        <section id="courses-section" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-fg mb-2">Crypto Education</h2>
              <p className="text-muted">Master smart contracts and blockchain development</p>
            </div>
            <CtaButton variant="secondary">
              <GraduationCap className="h-4 w-4" />
              View All Courses
            </CtaButton>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {CRYPTO_MODULES.map((module) => (
              <CourseModuleCard 
                key={module.id}
                module={{
                  moduleId: module.id,
                  title: module.title,
                  description: module.description,
                  content: '',
                  isPremium: module.isPremium,
                  order: module.order,
                  estimatedTime: module.estimatedTime,
                }}
                variant={module.isPremium ? 'locked' : 'unlocked'}
                onClick={() => console.log('Navigate to module:', module.id)}
              />
            ))}
          </div>
        </section>

        {/* Features Overview */}
        <section className="glass-card p-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-fg">Why Choose KRYCE?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <Shield className="h-8 w-8 text-accent mx-auto" />
              <h3 className="font-semibold text-fg">Legal Rights</h3>
              <p className="text-sm text-muted">Instant access to your fundamental rights</p>
            </div>
            <div className="space-y-3">
              <GraduationCap className="h-8 w-8 text-accent mx-auto" />
              <h3 className="font-semibold text-fg">Crypto Education</h3>
              <p className="text-sm text-muted">Learn blockchain development hands-on</p>
            </div>
            <div className="space-y-3">
              <Zap className="h-8 w-8 text-accent mx-auto" />
              <h3 className="font-semibold text-fg">Instant Answers</h3>
              <p className="text-sm text-muted">Get immediate guidance when you need it</p>
            </div>
            <div className="space-y-3">
              <BookOpen className="h-8 w-8 text-accent mx-auto" />
              <h3 className="font-semibold text-fg">Curated Content</h3>
              <p className="text-sm text-muted">Expert-reviewed guides and courses</p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
