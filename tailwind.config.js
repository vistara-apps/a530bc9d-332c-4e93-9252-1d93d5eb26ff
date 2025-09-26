/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--color-bg))',
        fg: 'hsl(var(--color-fg))',
        accent: 'hsl(var(--color-accent))',
        surface: 'hsl(var(--color-surface))',
        muted: 'hsl(var(--color-muted))',
        primary: 'hsl(var(--color-primary))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px hsla(0, 0%, 0%, 0.2)',
      },
    },
  },
  plugins: [],
}
