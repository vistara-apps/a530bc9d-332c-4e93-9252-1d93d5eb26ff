'use client';

import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { CtaButton } from '../components/CtaButton';
import { SecurityChecklist } from '../components/SecurityChecklist';
import { SecurityGuide } from '../components/SecurityGuide';
import { Shield, CheckCircle, AlertTriangle, Lock, Eye, Smartphone } from 'lucide-react';

const SECURITY_SECTIONS = [
  {
    id: 'wallet-security',
    title: 'Wallet Security',
    icon: Lock,
    description: 'Protect your crypto assets with best practices',
    content: `
# Wallet Security Best Practices

## 1. Use Hardware Wallets
Hardware wallets provide the highest level of security by keeping your private keys offline.

**Recommended hardware wallets:**
- Ledger Nano S/X
- Trezor Model T
- KeepKey

## 2. Enable Two-Factor Authentication (2FA)
Always enable 2FA on exchanges and wallet services.

## 3. Backup Your Seed Phrase
- Write down your 12-24 word seed phrase
- Store it in a secure, offline location
- Never share it with anyone
- Test your backup to ensure it works

## 4. Use Strong, Unique Passwords
- Use a password manager
- Never reuse passwords across services
- Enable biometric authentication when available
    `,
  },
  {
    id: 'scam-prevention',
    title: 'Scam Prevention',
    icon: AlertTriangle,
    description: 'Identify and avoid common crypto scams',
    content: `
# Common Crypto Scams & How to Avoid Them

## Phishing Attacks
**Red flags:**
- Unsolicited emails or messages
- Urgent requests for action
- Links to fake websites
- Requests for seed phrases or private keys

**Protection:**
- Never click suspicious links
- Verify URLs carefully
- Use bookmarks for official sites
- Enable browser security extensions

## Fake Giveaways
**Warning signs:**
- "Free crypto" promises
- Requests to send crypto first
- Pressure to act quickly
- Unknown social media accounts

**Safety measures:**
- Research project legitimacy
- Check official announcements
- Never send crypto to unverified addresses
- Use reputable exchanges only

## Ponzi Schemes
**Characteristics:**
- Guaranteed high returns
- Promises of passive income
- Referral bonuses
- Lack of transparent operations

**Due diligence:**
- Research project fundamentals
- Check team background
- Read smart contract audits
- Understand the business model
    `,
  },
  {
    id: 'safe-browsing',
    title: 'Safe Browsing Habits',
    icon: Eye,
    description: 'Navigate the crypto space securely online',
    content: `
# Safe Crypto Browsing Practices

## Browser Security
- Use HTTPS-only websites
- Install ad blockers and anti-malware extensions
- Keep browser and extensions updated
- Use privacy-focused browsers like Brave

## Extension Safety
- Only install from official stores
- Check permissions carefully
- Remove unused extensions
- Monitor for suspicious behavior

## Public Wi-Fi Risks
- Avoid crypto transactions on public networks
- Use VPN for additional security
- Prefer mobile data for sensitive operations
- Verify connection security

## Social Engineering Defense
- Verify information from multiple sources
- Be skeptical of "hot tips" and "insider information"
- Don't share sensitive information publicly
- Use encrypted communication channels
    `,
  },
  {
    id: 'mobile-security',
    title: 'Mobile Wallet Security',
    icon: Smartphone,
    description: 'Secure your mobile crypto experience',
    content: `
# Mobile Wallet Best Practices

## App Selection
- Download from official app stores
- Check developer reputation
- Read user reviews carefully
- Verify app permissions

## Device Security
- Use device PIN/password
- Enable biometric authentication
- Keep device OS updated
- Install reputable security apps

## Backup & Recovery
- Backup wallet regularly
- Store backups securely offline
- Test recovery process
- Never store backups in cloud services

## Transaction Verification
- Always verify addresses before sending
- Double-check amounts and fees
- Use hardware wallet integration when possible
- Enable transaction notifications
    `,
  },
];

export default function SecurityPage() {
  const [activeSection, setActiveSection] = useState(SECURITY_SECTIONS[0].id);

  const currentSection = SECURITY_SECTIONS.find(s => s.id === activeSection) || SECURITY_SECTIONS[0];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-12 w-12 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold text-fg">
              Crypto Security Hub
            </h1>
          </div>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Protect your digital assets with expert security guidance and best practices
          </p>
        </div>

        {/* Security Checklist */}
        <SecurityChecklist />

        {/* Security Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4 space-y-2">
              <h3 className="font-semibold text-fg mb-4">Security Topics</h3>
              {SECURITY_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-accent text-white'
                        : 'text-muted hover:text-fg hover:bg-surface'
                    }`}
                  >
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className={`text-xs mt-1 ${
                        activeSection === section.id ? 'text-white/80' : 'text-muted'
                      }`}>
                        {section.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <SecurityGuide
              title={currentSection.title}
              content={currentSection.content}
              sectionId={currentSection.id}
            />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-fg mb-4">Quick Security Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-fg">Never share your seed phrase</div>
                <div className="text-sm text-muted">Your seed phrase is the master key to your crypto</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-fg">Verify addresses twice</div>
                <div className="text-sm text-muted">One wrong character can lose your funds forever</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-fg">Use hardware wallets for large amounts</div>
                <div className="text-sm text-muted">Keep most of your crypto offline and secure</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-fg">Stay informed about scams</div>
                <div className="text-sm text-muted">New scams emerge regularly - stay vigilant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Resources */}
        <div className="glass-card p-6 border-l-4 border-accent">
          <h3 className="text-xl font-bold text-fg mb-4">🚨 Security Emergency?</h3>
          <p className="text-muted mb-4">
            If you suspect your crypto has been compromised or you've been scammed:
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted">
              • Stop all transactions immediately
            </p>
            <p className="text-sm text-muted">
              • Contact your wallet provider or exchange support
            </p>
            <p className="text-sm text-muted">
              • Report to local authorities if significant amounts are involved
            </p>
            <p className="text-sm text-muted">
              • Document everything for potential recovery attempts
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

