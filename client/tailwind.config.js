/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#1b365d',
          navy: '#0b1f3a',
          saffron: '#ff9933',
          green: '#138808',
          accent: '#0d9488'
        }
      }
    },
  },
  plugins: [],
}
