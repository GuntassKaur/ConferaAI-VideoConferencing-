/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: { 
          base: '#0F172A', 
          sub: '#111827', 
          elevated: '#1F2937', 
          border: '#374151', 
        },
        accent: { 
          DEFAULT: '#6366F1', 
          light: '#818CF8', 
          dark: '#4F46E5', 
        },
        text: { 
          primary: '#E5E7EB', 
          secondary: '#9CA3AF', 
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
