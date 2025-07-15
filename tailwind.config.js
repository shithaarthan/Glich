/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        background: '#121212',
        surface: '#1A1A1A',
        primary: '#8A2BE2', // Electric Purple
        'primary-hover': '#9945E8',
        secondary: '#00F5D4', // Bright Teal
        text: {
          DEFAULT: '#F5F5F5',
          muted: '#A3A3A3',
        },
        border: '#2D2D2D',
      },
      maxWidth: {
        '8xl': '1400px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
