/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: { 
          base: '#08080a', 
          sub: '#0f0f13', 
          elevated: '#17171d', 
          border: '#1e1e27', 
          deep: '#050507' 
        },
        accent: { 
          DEFAULT: '#6366f1', 
          light: '#818cf8', 
          dark: '#4f46e5', 
          muted: '#312e81', 
          glow: 'rgba(99,102,241,0.15)' 
        },
        text: { 
          primary: '#f8fafc', 
          secondary: '#94a3b8', 
          muted: '#475569', 
          hint: '#334155' 
        },
        success: '#10b981', 
        warning: '#f59e0b', 
        danger: '#ef4444'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
}
