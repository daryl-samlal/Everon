/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102a43',
        coral: '#f26b5e',
        mist: '#eef4f2',
        sun: '#f2c94c',
      },
      fontFamily: { display: ['"Space Grotesk"', 'sans-serif'], sans: ['"DM Sans"', 'sans-serif'] },
    },
  },
  plugins: [],
}
