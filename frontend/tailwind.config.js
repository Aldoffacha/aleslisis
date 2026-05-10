/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './adapters/**/*.{js,ts,jsx,tsx,mdx}',
    './domain/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        rose: {
          blush: '#F9E8E8',
          soft: '#F0C4C4',
          medium: '#D4847A',
          deep: '#B05C5C',
          dark: '#7A3535',
        },
        cream: '#FAF6F0',
        petal: '#FDF0F0',
        leaf: '#4A6741',
        gold: '#C9A96E',
      },
      keyframes: {
        'envelope-open': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh) scale(1)', opacity: '0' },
        },
        'petal-bloom': {
          '0%': { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '60%': { transform: 'scale(1.1) rotate(5deg)', opacity: '0.9' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'carousel-slide': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-25%)' },
        },
      },
      animation: {
        'envelope-open': 'envelope-open 1s ease-in-out forwards',
        'petal-bloom': 'petal-bloom 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
