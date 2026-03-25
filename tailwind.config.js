/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#748b6f',
        'brand-beige': '#f9f8f6',
        'brand-gold': '#d4af37',
        'brand-dark': '#1a1a1a',
        'brand-gray': '#e5e5e5',
        'brand-text': '#333333',
        'brand-text-light': '#666666',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'lift': '0 10px 30px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
