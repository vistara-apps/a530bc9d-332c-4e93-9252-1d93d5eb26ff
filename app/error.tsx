'use client';

import { Shield, RefreshCw } from 'lucide-react';
import { CtaButton } from './components/CtaButton';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <Shield className="h-16 w-16 text-accent mx-auto" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-fg">Something went wrong!</h2>
          <p className="text-muted">
            We encountered an error while loading KRYCE Navigator. Please try again.
          </p>
        </div>
        <CtaButton 
          variant="primary" 
          onClick={reset}
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </CtaButton>
      </div>
    </div>
  );
}
