'use client';

import { useState } from 'react';
import { BookOpen, Shield, GraduationCap, Users, Menu, X } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';

interface AppShellProps {
  children: React.ReactNode;
  variant?: 'default' | 'minimal';
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Legal Guides', href: '/guides', icon: BookOpen },
    { name: 'Crypto Courses', href: '/courses', icon: GraduationCap },
    { name: 'Community', href: '/community', icon: Users },
  ];

  if (variant === 'minimal') {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-4xl mx-auto px-4">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="glass-card border-b border-white border-opacity-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-fg">KRYCE</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-muted hover:text-fg transition-colors duration-200"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              <Wallet>
                <ConnectWallet>
                  <div className="flex items-center space-x-2 bg-surface px-3 py-2 rounded-lg border border-white border-opacity-20">
                    <Avatar className="h-6 w-6" />
                    <Name className="text-sm font-medium" />
                  </div>
                </ConnectWallet>
              </Wallet>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-surface border border-white border-opacity-20"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-fg" />
                ) : (
                  <Menu className="h-5 w-5 text-fg" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white border-opacity-10">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted hover:text-fg hover:bg-surface transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
