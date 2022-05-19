module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-easy-import': { prefix: '_', extensions: '.css' },
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  },
}
