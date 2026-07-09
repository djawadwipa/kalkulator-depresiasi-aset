/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brandNavy: '#061B3A',
        brandNavy2: '#082A5A',
        brandTeal: '#008D84',
        brandGold: '#F5A623'
      }
    }
  },
  plugins: []
};
