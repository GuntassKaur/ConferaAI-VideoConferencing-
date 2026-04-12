/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
}
