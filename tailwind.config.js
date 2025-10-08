/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dolmenwood: {
          card: '#f7f5f0',
          border: '#8b7355',
          text: '#2d4a1a',
          accent: '#8b7355',
          moss: '#7a8471',
          bark: '#654321',
          gold: '#d4af37',
        }
      }
    },
  },
  plugins: [],
}
