/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 24px 60px rgba(15, 23, 42, 0.16)',
        soft: '0 18px 38px rgba(15, 23, 42, 0.12)',
        medium: '0 24px 50px rgba(15, 23, 42, 0.18)',
        strong: '0 30px 70px rgba(15, 23, 42, 0.24)',
      },
      colors: {
        canvas: '#f5f1e8',
        ink: '#172033',
        accent: '#0f766e',
        muted: '#6b7280',
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        sans: ['"Manrope"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
