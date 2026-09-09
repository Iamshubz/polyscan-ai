/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        poly: {
          bg: '#F5F7F3',
          card: '#FFFFFF',
          green: '#16803A',
          'dark-green': '#14532D',
          'light-green': '#EAF6E9',
          sage: '#7BA77B',
          text: '#17231C',
          muted: '#66736B',
          border: '#DCE5DD',
          warning: '#D38B2F',
          error: '#B94A48',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(22, 128, 58, 0.04)',
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
