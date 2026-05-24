/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zoe: {
          green: '#2d7d46',
          teal: '#0d9488',
          blue: '#1d4ed8',
          olive: '#65a30d',
          sand: '#d97706',
          sky: '#0284c7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

