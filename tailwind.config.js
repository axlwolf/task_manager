
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          950: '#1E0A3C',
          900: '#2D1657',
          800: '#3B1F73',
          700: '#4C2A8F',
          600: '#5D35AB',
          500: '#6E40C7',
          400: '#8F6AD3',
          300: '#B095DF',
          200: '#D1BFEB',
          100: '#F2EAF7',
        }
      }
    },
  },
  plugins: [],
}

