const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6be585',
          dark: '#58cb73',
        },
        background: '#f0f0f0',
        blue: colors.blue,
        gray: colors.gray,
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'fiberglass': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'checkerboard-white-black': 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%) 50% / 8px 8px',
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'fiberglass-start': '#f0f0f0',
        'fiberglass-middle': '#e0e0e0',
        'fiberglass-end': '#f0f0f0',
      }),
      boxShadow: {
        'neon': '0 0 5px theme("colors.primary.DEFAULT"), 0 0 20px theme("colors.primary.DEFAULT")',
        '3d': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  variants: {
    extend: {
      scale: ['hover', 'focus', 'active'],
      boxShadow: ['hover', 'focus'],
      opacity: ['disabled'],
      backgroundColor: ['active'],
      textColor: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}