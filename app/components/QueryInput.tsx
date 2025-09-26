'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (question: string) => Promise<void>;
  placeholder?: string;
  variant?: 'default';
}

export function QueryInput({ 
  onSubmit, 
  placeholder = "Ask about your legal rights...",
  variant = 'default' 
}: QueryInputProps) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onSubmit(question.trim());
      setQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 pr-12 bg-surface border border-white border-opacity-20 rounded-lg text-fg placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
          rows={3}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="absolute bottom-3 right-3 p-2 bg-accent text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  );
}
