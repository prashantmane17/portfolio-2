/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#140a2e',
          800: '#1f1147',
          700: '#2e1a66',
        },
        primary: {
          500: '#06b6d4',
          400: '#22d3ee',
        },
        accent: {
          500: '#ec4899',
          400: '#f472b6',
        }
      },
      backgroundImage: {
        'neon-about':
          'radial-gradient(ellipse at 20% 15%, rgba(236,72,153,.35), transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(6,182,212,.35), transparent 55%), linear-gradient(135deg,#1f1147,#140a2e)',
        'neon-skills':
          'radial-gradient(ellipse at 80% 15%, rgba(6,182,212,.35), transparent 55%), radial-gradient(ellipse at 15% 90%, rgba(236,72,153,.3), transparent 55%), linear-gradient(135deg,#140a2e,#1f1147)',
        'hero-cat':
          "linear-gradient(rgba(20,10,46,.55), rgba(20,10,46,.8)), url('/cat-glasses.png')",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
