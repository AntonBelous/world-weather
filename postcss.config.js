module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-easy-import': { prefix: '_', extensions: ['.css', '.scss'] },
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  },
}
