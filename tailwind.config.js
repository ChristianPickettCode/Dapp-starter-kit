const colors = require('tailwindcss/colors')
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{ts,tsx,js,jsx,css}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: colors.green,
      secondary: colors.emerald,
      gray: colors.coolGray,
      white: colors.white,
      transparent: 'transparent',
      current: 'currentColor'
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
