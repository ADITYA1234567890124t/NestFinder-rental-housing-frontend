/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12' },
        brand:   { DEFAULT:'#f97316', dark:'#ea580c', light:'#fed7aa' },
      },
      fontFamily: {
        sans:    ['"DM Sans"','sans-serif'],
        display: ['"Playfair Display"','Georgia','serif'],
      },
      boxShadow: {
        card:    '0 2px 16px rgba(0,0,0,0.07)',
        'card-lg':'0 8px 32px rgba(0,0,0,0.12)',
        warm:    '0 4px 24px rgba(249,115,22,0.18)',
      },
      keyframes: {
        fadeUp:  { '0%':{ opacity:0, transform:'translateY(16px)' }, '100%':{ opacity:1, transform:'translateY(0)' } },
        fadeIn:  { '0%':{ opacity:0 }, '100%':{ opacity:1 } },
        slideIn: { '0%':{ transform:'translateX(-100%)' }, '100%':{ transform:'translateX(0)' } },
      },
      animation: {
        'fade-up':'fadeUp 0.4s ease forwards',
        'fade-in':'fadeIn 0.3s ease forwards',
        'slide-in':'slideIn 0.3s ease forwards',
      },
    },
  },
  plugins: [],
}
