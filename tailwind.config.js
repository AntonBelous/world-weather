module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      body: '#1b1b1b',
      subtitle: '#767676',
      divider: '#c4c4c4',
      grayText: '#a8a8a8',
      modalShadow: '#c1c1c1',
    },
    backgroundColor: theme => ({
      ...theme('colors'),
    }),
    fontSize: {
      xs: ['14px', '20px'],
      sm: ['16px', '22px'],
      md: ['18px', '24px'],
    },
    container: {
      center: true,
    },
    screens: {
      xl: { max: '1550px' },
      lg: { max: '1200px' },
      md: { max: '900px' },
      sm: { max: '600px' },
      xs: { max: '480px' },
    },
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}
