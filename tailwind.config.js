/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Graphite base with deep navy shadows.
        dark: {
          900: '#0a0b0f',
          800: '#12141a',
          700: '#1b1e26',
        },
        // Red highlights.
        primary: {
          500: '#e11d2e',
          400: '#ff4b57',
        },
        // Restrained yellow, matching the model's trim.
        accent: {
          500: '#e8c21a',
          400: '#f5d84a',
        },
      },
      fontFamily: {
        // Space Grotesk 600-700 for headlines and numbers; Inter 400-600 for copy, buttons and labels.
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.28em',
      },
    },
  },
  plugins: [],
}
