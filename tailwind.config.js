/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A699',
          dark: '#008F86',
          light: '#E6F7F6',
        },
        secondary: {
          DEFAULT: '#004D40',
        },
        background: {
          DEFAULT: '#F8F9FC',
        }
      },
      borderRadius: {
        'full': '9999px',
      }
    },
  },
  plugins: [],
};