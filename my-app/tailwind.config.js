/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff9eb',
          500: '#ff9500',
          600: '#e67000',
          700: '#bf4c00',
        },
      },
    },
  },
  plugins: [],
}