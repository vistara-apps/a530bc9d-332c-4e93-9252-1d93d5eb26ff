'use client';

import { CheckCircle, Copy, BookmarkPlus } from 'lucide-react';
import { useState } from 'react';

interface AnswerDisplayProps {
  answer: string;
  variant?: 'text' | 'richContent';
  onSave?: () => void;
}

export function AnswerDisplay({ 
  answer, 
  variant = 'text',
  onSave 
}: AnswerDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-fg">Legal Guidance</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-muted hover:text-fg transition-colors duration-200"
            title="Copy answer"
          >
            {copied ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
          {onSave && (
            <button
              onClick={handleSave}
              className="p-2 text-muted hover:text-fg transition-colors duration-200"
              title="Save answer"
            >
              {saved ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <BookmarkPlus className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        {variant === 'richContent' ? (
          <div dangerouslySetInnerHTML={{ __html: answer }} />
        ) : (
          <p className="text-fg leading-relaxed whitespace-pre-wrap">{answer}</p>
        )}
      </div>

      <div className="pt-4 border-t border-white border-opacity-10">
        <p className="text-sm text-muted">
          ⚠️ This information is for educational purposes only and does not constitute legal advice. 
          Consult with a qualified attorney for specific legal matters.
        </p>
      </div>
    </div>
  );
}
