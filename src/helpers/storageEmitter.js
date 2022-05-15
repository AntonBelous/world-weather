export default {
  get (prop) {
    return JSON.parse(localStorage.getItem(prop))
  },

  set (prop, value) {
    return localStorage.setItem(prop, JSON.stringify(value))
  },

  remove (prop) {
    return localStorage.removeItem(prop)
  }
}
