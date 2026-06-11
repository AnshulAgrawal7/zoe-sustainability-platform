/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ZOE brand green — fresher/lighter retune (Part 1B). Replaces Tailwind's
        // default `green` so every `*-green-*` shifts in one place. The mids
        // (400/500) are brighter/springier; 700 is lightened (the hero gradient
        // and the CTA section read lighter/fresher) while every white-on-green
        // pair stays WCAG AA. Reversible: delete this block.
        // Verified contrast: white-on-600 4.54, white-on-700 5.80 (was 7.29),
        // green-600/700 text on white 4.54/5.80, dark-mode green-400 on
        // gray-900/800 7.55/6.25, green-300 on gray-900 9.94 — all ≥ AA.
        green: {
          50: '#edfbf1',
          100: '#d2f5de',
          200: '#a3e9bd',
          300: '#6bd793',
          400: '#39c06e',
          500: '#1fa654',
          600: '#2d864b',
          700: '#277343',
          800: '#1f5734',
          900: '#18472a',
          950: '#0e2d1a',
        },
        zoe: {
          green: '#2d864b',
          teal: '#0d9488',
          blue: '#1d4ed8',
          olive: '#65a30d',
          sand: '#d97706',
          sky: '#0284c7',
        },
      },
      // Headline scale one step smaller with tighter leading (Part 1A) — the
      // page felt oversized. Only the large steps are overridden; body text,
      // buttons and touch targets are untouched. Reversible: delete this block.
      fontSize: {
        '3xl': ['1.625rem', { lineHeight: '2rem' }],
        '4xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '5xl': ['2.5rem', { lineHeight: '1.1' }],
        '6xl': ['3rem', { lineHeight: '1.05' }],
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

