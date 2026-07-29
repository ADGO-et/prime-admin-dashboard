/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#01016F',
          mid: '#2014FF',
          light: '#3B82F6'
        },
        prime: {
          dark: '#01016F',
          light: '#2014FF',
          accent: '#3B82F6'
        }
      }
    },
  },
  plugins: [],
}
