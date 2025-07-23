/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D1FF',
        accent: '#FF008C',
        background: '#0A0A0A',
        surface: '#121212',
        'surface-light': '#1A1A1A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#AAAAAA',
        border: '#222222',
        'border-light': '#333333',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'low': '0px 1px 2px rgba(0,0,0,0.2)',
        'medium': '0px 4px 8px rgba(0,0,0,0.3)',
        'high': '0px 10px 20px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'button-hover': 'buttonHover 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        buttonHover: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}