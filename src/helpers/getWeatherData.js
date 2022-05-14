import axios from 'axios'

export default (coords, country) => {
  let url

  if (!Array.isArray(coords) && country) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${coords},${country.toLowerCase()}&appid=${process.env.VUE_APP_KEY}&units=metric`
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${process.env.VUE_APP_KEY}&units=metric`
  }

  return axios.get(url).then((response) => response.data)
}
