'use client';

import { useTheme } from '../components/ThemeProvider';
import { AppShell } from '../components/AppShell';
import { CtaButton } from '../components/CtaButton';
import { GuideCard } from '../components/GuideCard';
import { Shield, Palette } from 'lucide-react';

const themes = [
  { id: 'default', name: 'KRYCE (Default)', description: 'Warm social theme with dark teal & coral' },
  { id: 'celo', name: 'Celo', description: 'Black background with yellow accents' },
  { id: 'solana', name: 'Solana', description: 'Dark purple with magenta accents' },
  { id: 'base', name: 'Base', description: 'Dark blue with Base blue accents' },
  { id: 'coinbase', name: 'Coinbase', description: 'Dark navy with Coinbase blue' },
] as const;

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();

  const sampleGuide = {
    guideId: 'sample',
    title: 'Sample Legal Guide',
    category: 'general' as const,
    content: 'This is a sample guide to demonstrate the theme colors and styling.',
    createdAt: new Date(),
    isPremium: false,
  };

  return (
    <AppShell variant="minimal">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Palette className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold text-fg">Theme Preview</h1>
          </div>
          <p className="text-muted">Preview different blockchain themes for KRYCE Navigator</p>
        </div>

        {/* Theme Selector */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold text-fg">Select Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  theme === themeOption.id
                    ? 'border-accent bg-accent bg-opacity-10'
                    : 'border-white border-opacity-20 hover:border-accent hover:border-opacity-50'
                }`}
              >
                <h3 className="font-semibold text-fg">{themeOption.name}</h3>
                <p className="text-sm text-muted mt-1">{themeOption.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Component Previews */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-fg">Component Preview</h2>
          
          {/* Buttons */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-fg">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <CtaButton variant="primary">Primary Button</CtaButton>
              <CtaButton variant="secondary">Secondary Button</CtaButton>
              <CtaButton variant="destructive">Destructive Button</CtaButton>
            </div>
          </div>

          {/* Cards */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-fg">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GuideCard guide={sampleGuide} />
              <GuideCard guide={{ ...sampleGuide, isPremium: true, title: 'Premium Guide' }} />
            </div>
          </div>

          {/* Typography */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-fg">Typography</h3>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-fg">Display Heading</h1>
              <h2 className="text-2xl font-semibold text-fg">Section Heading</h2>
              <p className="text-base text-fg leading-relaxed">
                Body text with normal weight and relaxed line height for comfortable reading.
              </p>
              <p className="text-sm text-muted leading-normal">
                Caption text in muted color for secondary information.
              </p>
            </div>
          </div>

          {/* Color Palette */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-fg">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="w-full h-16 bg-bg rounded-lg border border-white border-opacity-20"></div>
                <p className="text-sm text-muted">Background</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-surface rounded-lg"></div>
                <p className="text-sm text-muted">Surface</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-accent rounded-lg"></div>
                <p className="text-sm text-muted">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-primary rounded-lg"></div>
                <p className="text-sm text-muted">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-fg rounded-lg"></div>
                <p className="text-sm text-muted">Foreground</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <CtaButton 
            variant="secondary"
            onClick={() => window.location.href = '/'}
          >
            <Shield className="h-4 w-4" />
            Back to KRYCE
          </CtaButton>
        </div>
      </div>
    </AppShell>
  );
}
