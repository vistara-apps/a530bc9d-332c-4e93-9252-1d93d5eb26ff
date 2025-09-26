'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface AnalyticsContextType {
  trackEvent: (eventType: string, eventData?: Record<string, any>) => void;
  trackPageView: (page: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const { wallet } = useMiniKit();

  const trackEvent = async (eventType: string, eventData: Record<string, any> = {}) => {
    try {
      const payload = {
        eventType,
        eventData,
        walletAddress: wallet?.address,
        sessionId: `session_${Date.now()}`,
      };

      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  const trackPageView = (page: string) => {
    trackEvent('page_view', { page, timestamp: new Date().toISOString() });
  };

  // Track page views on route changes
  useEffect(() => {
    trackPageView(window.location.pathname);

    const handleRouteChange = () => {
      trackPageView(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Track user engagement events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('page_hidden');
      } else {
        trackEvent('page_visible');
      }
    };

    const handleBeforeUnload = () => {
      trackEvent('page_unload');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Track wallet connection
  useEffect(() => {
    if (wallet?.address) {
      trackEvent('wallet_connected', {
        walletAddress: wallet.address,
        timestamp: new Date().toISOString(),
      });
    }
  }, [wallet?.address]);

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

