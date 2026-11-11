/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        diu: {
          blue: '#094B8A',
          darkBlue: '#0A1E3F',
          sidebar: '#0B2246',
          sidebarHover: '#133568',
          lightBlue: '#EBF4FC',
          accentBlue: '#1D68BD',
          primary: '#1B64F2',
          green: '#008751',
          lightGreen: '#E8F7F0',
          darkGreen: '#00663D',
          bg: '#F5F8FC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          textDark: '#1E293B',
          textMuted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}

