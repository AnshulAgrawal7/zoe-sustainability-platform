/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ZOE brand green scale (Block 6) — anchored on the brand green (#2d7d46
        // at 600). It REPLACES Tailwind's default `green`, so every existing
        // `*-green-*` class shifts to the ZOE identity in one place. Fully
        // reversible: delete this `green` block to fall back to Tailwind green.
        // Contrast verified (WCAG AA): white-on-600 5.08, white-on-700 7.29,
        // green-600/700 text on white 5.08/7.29, dark-mode green-400 on
        // gray-900/800 6.50/5.38 — all ≥ the previous defaults on the key pairs.
        green: {
          50: '#eef8f1',
          100: '#d6efdd',
          200: '#afe0bf',
          300: '#7ecb98',
          400: '#4eaf70',
          500: '#319a56',
          600: '#2d7d46',
          700: '#246239',
          800: '#1e4e2e',
          900: '#193f27',
          950: '#0f2817',
        },
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
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

