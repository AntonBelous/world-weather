module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {

    boxShadow: {
      trigger: '0 4px 5px rgba(0, 0, 0, .14), 0 1px 10px rgba(0, 0, 0, .12), 0 2px 4px rgba(0, 0, 0, .2)',
      card: '0 2px 10px rgba(10, 10, 10, .25)',
    },

    backgroundColor: theme => ({
      ...theme('colors'),
    }),

    fontSize: {
      xs: ['14px', '20px'],
      sm: ['16px', '22px'],
      md: ['18px', '24px'],
      'card-title': ['32px', '38px'],
      'card-title-xl': ['24px', '28px'],
      'card-title-md': ['22px', '26px'],
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

      colors: {
        body: '#1b1b1b',
        subtitle: '#767676',
        divider: '#c4c4c4',
        gray: '#a8a8a8',
        purple: '#9b51e0',
        white: '#fff',
        red: '#ff0101',
        'modal-overlay': 'rgba(11, 11, 11, .5)',
        'modal-shadow': '#c1c1c1',
      },
    },

  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar'),
  ],
}
