'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Shield } from 'lucide-react';

const SECURITY_CHECKLIST_ITEMS = [
  {
    id: 'backup-seed',
    title: 'Backup your seed phrase',
    description: 'Write down your 12-24 word recovery phrase and store it securely offline',
    category: 'wallet',
  },
  {
    id: 'enable-2fa',
    title: 'Enable two-factor authentication',
    description: 'Add 2FA to all crypto-related accounts and services',
    category: 'account',
  },
  {
    id: 'use-hardware-wallet',
    title: 'Use a hardware wallet',
    description: 'Store large amounts of crypto on hardware wallets like Ledger or Trezor',
    category: 'wallet',
  },
  {
    id: 'verify-addresses',
    title: 'Always verify addresses',
    description: 'Double-check recipient addresses before sending crypto',
    category: 'transaction',
  },
  {
    id: 'avoid-phishing',
    title: 'Avoid phishing attempts',
    description: 'Never click suspicious links or provide info to unsolicited requests',
    category: 'browsing',
  },
  {
    id: 'use-strong-passwords',
    title: 'Use strong, unique passwords',
    description: 'Use a password manager and never reuse passwords',
    category: 'account',
  },
  {
    id: 'keep-software-updated',
    title: 'Keep software updated',
    description: 'Regularly update wallets, browsers, and security software',
    category: 'maintenance',
  },
  {
    id: 'beware-scams',
    title: 'Be aware of common scams',
    description: 'Learn to identify fake giveaways, Ponzi schemes, and other scams',
    category: 'awareness',
  },
];

export function SecurityChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const completedCount = checkedItems.size;
  const totalCount = SECURITY_CHECKLIST_ITEMS.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const getCategoryColor = (category: string) => {
    const colors = {
      wallet: 'text-blue-400',
      account: 'text-green-400',
      transaction: 'text-yellow-400',
      browsing: 'text-red-400',
      maintenance: 'text-purple-400',
      awareness: 'text-orange-400',
    };
    return colors[category as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-8 w-8 text-accent" />
        <div>
          <h2 className="text-2xl font-bold text-fg">Security Checklist</h2>
          <p className="text-muted">Complete these essential security practices</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-fg">Progress</span>
          <span className="text-sm text-muted">{completedCount}/{totalCount} completed</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-lg font-bold text-accent">{progressPercentage}%</span>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {SECURITY_CHECKLIST_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
              checkedItems.has(item.id)
                ? 'bg-accent/10 border-accent/30'
                : 'bg-surface/50 border-white/10 hover:border-white/20'
            }`}
            onClick={() => toggleItem(item.id)}
          >
            <div className="mt-0.5">
              {checkedItems.has(item.id) ? (
                <CheckCircle className="h-5 w-5 text-accent" />
              ) : (
                <Circle className="h-5 w-5 text-muted" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`font-medium ${checkedItems.has(item.id) ? 'text-fg' : 'text-muted'}`}>
                  {item.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)} bg-current bg-opacity-10`}>
                  {item.category}
                </span>
              </div>
              <p className={`text-sm ${checkedItems.has(item.id) ? 'text-muted' : 'text-muted/80'}`}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedCount === totalCount && (
        <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg text-center">
          <CheckCircle className="h-8 w-8 text-accent mx-auto mb-2" />
          <h3 className="font-bold text-fg mb-1">Excellent! 🎉</h3>
          <p className="text-sm text-muted">
            You've completed all security best practices. Keep up the great work!
          </p>
        </div>
      )}
    </div>
  );
}

