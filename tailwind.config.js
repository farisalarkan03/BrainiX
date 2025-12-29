/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-dark': '#0f172a',
        'game-accent': '#8b5cf6', // Violet
        'game-success': '#10b981', // Emerald
        'game-error': '#ef4444', // Red
        'neon-blue': '#00f3ff',
        'neon-pink': '#ff00ff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'], // We'll need to import this font
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #8b5cf6, 0 0 10px #8b5cf6' },
          '100%': { boxShadow: '0 0 20px #8b5cf6, 0 0 30px #8b5cf6' },
        }
      }
    },
  },
  plugins: [],
}
