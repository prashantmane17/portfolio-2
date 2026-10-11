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
          900: '#0a1628',
          800: '#10223b',
          700: '#1a3254',
        },
        primary: {
          500: '#d4a24c',
          400: '#f0c878',
        },
        accent: {
          500: '#e9d5a1',
          400: '#f6e7c1',
        }
      },
      backgroundImage: {
        'scene-red':
          'radial-gradient(ellipse at 25% 15%, #d42a33, transparent 60%), radial-gradient(ellipse at 90% 95%, #7a0d14, transparent 60%), linear-gradient(135deg,#b8141c,#9a1018)',
        'scene-about':
          'radial-gradient(ellipse at 18% 12%, rgba(212,162,76,.16), transparent 55%), radial-gradient(ellipse at 88% 90%, rgba(70,110,170,.28), transparent 55%), linear-gradient(135deg,#10223b,#0a1628)',
        'scene-skills':
          'radial-gradient(ellipse at 82% 12%, rgba(70,110,170,.28), transparent 55%), radial-gradient(ellipse at 14% 92%, rgba(212,162,76,.14), transparent 55%), linear-gradient(135deg,#0a1628,#10223b)',
      },
      fontFamily: {
        // Tech Startup pairing (ui-ux-pro-max): Space Grotesk for display, DM Sans for reading.
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
