/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    options: {
      whitelist: [
        'text-red-500', 'text-green-500', 'text-gray-500',
        'text-red-800', 'text-green-800', 'text-gray-800',
        'text-red-100', 'text-green-100', 'text-gray-100',
      ], // Add your dynamic class names here
    },
  },
}