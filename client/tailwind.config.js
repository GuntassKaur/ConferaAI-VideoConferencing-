/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        card: "rgba(255, 255, 255, 0.05)",
        accent: {
          light: "#818cf8",
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
