'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface SecurityGuideProps {
  title: string;
  content: string;
  sectionId: string;
}

export function SecurityGuide({ title, content, sectionId }: SecurityGuideProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return `<h2 class="text-xl font-bold text-fg mt-6 mb-3">${line.substring(2)}</h2>`;
        }
        if (line.startsWith('## ')) {
          return `<h3 class="text-lg font-semibold text-fg mt-4 mb-2">${line.substring(3)}</h3>`;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return `<p class="font-semibold text-fg mt-3">${line.slice(2, -2)}</p>`;
        }
        if (line.startsWith('- ')) {
          return `<li class="text-muted ml-4">${line.substring(2)}</li>`;
        }
        if (line.startsWith('**Red flags:**') || line.startsWith('**Protection:**') ||
            line.startsWith('**Warning signs:**') || line.startsWith('**Safety measures:**') ||
            line.startsWith('**Characteristics:**') || line.startsWith('**Due diligence:**')) {
          return `<p class="font-medium text-accent mt-3">${line}</p>`;
        }
        if (line.trim() === '') {
          return '<br />';
        }
        if (line.startsWith('**') && line.includes(':**')) {
          return `<p class="font-medium text-fg mt-3">${line}</p>`;
        }
        return `<p class="text-muted leading-relaxed">${line}</p>`;
      })
      .join('');
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-fg">{title}</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg bg-surface hover:bg-opacity-80 transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />

          {/* Additional Resources */}
          <div className="mt-8 pt-6 border-t border-white border-opacity-10">
            <h3 className="text-lg font-semibold text-fg mb-3">Additional Resources</h3>
            <div className="space-y-2">
              {sectionId === 'wallet-security' && (
                <>
                  <a
                    href="https://www.ledger.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Ledger Hardware Wallets</span>
                  </a>
                  <a
                    href="https://trezor.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Trezor Hardware Wallets</span>
                  </a>
                </>
              )}

              {sectionId === 'scam-prevention' && (
                <>
                  <a
                    href="https://www.ftc.gov/news-events/topics/consumer-protection/scams"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>FTC Scam Information</span>
                  </a>
                  <a
                    href="https://www.consumerfinance.gov/scams/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>CFPB Scam Resources</span>
                  </a>
                </>
              )}

              {sectionId === 'safe-browsing' && (
                <>
                  <a
                    href="https://brave.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Brave Browser</span>
                  </a>
                  <a
                    href="https://www.eff.org/privacybadger"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Privacy Badger Extension</span>
                  </a>
                </>
              )}

              {sectionId === 'mobile-security' && (
                <>
                  <a
                    href="https://trustwallet.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Trust Wallet</span>
                  </a>
                  <a
                    href="https://metamask.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>MetaMask Mobile</span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-surface/50 rounded-lg border border-yellow-500/20">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-400 mt-0.5">⚠️</div>
              <div>
                <p className="text-sm text-muted">
                  <strong>Important:</strong> This guide provides general security information and best practices.
                  Always do your own research and consider consulting with security professionals for specific situations.
                  Crypto security is an evolving field, and new threats emerge regularly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

