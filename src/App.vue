<template>
  <transition>
    <div class="main container" v-if="isAppReady">
      <h2 class="main__title">
        World Weather
      </h2>
      <template v-if="currentCity.id">
        <h4 class="main__subtitle" >
          Watch weather in your current location
        </h4>
        <div class="main__head-row">
          <card-component
            :data="currentCity"
            :is-loading="isLoading"
            hide-remove-button
            @update-item="updateItem"
          />
        </div>
      </template>
      <div class="main__body-row" v-if="cities.length">
        <transition-group>
          <div
            class="main__body-col"
            :key="index"
            v-for="(item, index) in cities"
          >
            <card-component
              :data="item"
              :is-loading="isLoading"
              @update-item="updateItem"
              @remove-item="removeItem"
            />
          </div>
        </transition-group>
      </div>
      <button
        class="main__trigger"
        :class="{'main__trigger--hidden': isModalOpened}"
        @click="isModalOpened = true"
      ></button>
      <transition>
        <modal-component
          :is-opened="isModalOpened"
          :is-loading="isModalLoading"
          @close-modal="isModalOpened = false"
          @add-item="addItem"
        />
      </transition>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue'
import getWeatherData from './helpers/getWeatherData'
import moment from 'moment'

export default {
  name: 'App',
  setup: function () {
    const cities = ref([])
    const isModalOpened = ref(false)
    const currentCity = ref({})
    const isAppReady = ref(false)
    const isLoading = ref(false)
    const isModalLoading = ref(false)

    // This is a function that is called when the user clicks the add button on the modal. It will get the weather data
    // for the city that the user entered and then add it to the cities array.
    const addItem = async ($event) => {
      isModalLoading.value = true

      try {
        const weather = await getWeatherData($event.name, $event.country)
        weather.time = moment().format()
        cities.value.push(weather)
        localStorage.setItem('cities', JSON.stringify(cities.value))
        isModalOpened.value = false
        isModalLoading.value = false
      } catch (e) {
        throw new Error(e)
      }
    }

    // This is a function that is called when the user clicks the update button on a card. It will get the weather data
    // for the city that the user clicked on and then update the card with the new data.
    const updateItem = async ($event) => {
      isLoading.value = true

      try {
        const weather = await getWeatherData($event.city, $event.country)
        const cityStorage = JSON.parse(localStorage.getItem('currentCity'))
        const formatData = { ...weather }

        formatData.time = moment().format()

        if (cityStorage.id !== formatData.id) {
          const result = []

          JSON.parse(localStorage.getItem('cities')).forEach((el, i) => {
            if (el.id === formatData.id) {
              cities.value[i] = formatData
              result.push(formatData)
              return
            }

            result.push(el)
          })

          localStorage.setItem('cities', JSON.stringify(result))
        } else {
          currentCity.value = formatData
          localStorage.setItem('currentCity', JSON.stringify(formatData))
        }

        isLoading.value = false
      } catch (e) {
        throw new Error(e)
      }
    }

    // This is a function that is called when the user clicks the remove button on a card. It will filter the cities array
    // and remove the city that the user clicked on.
    const removeItem = ($event) => {
      const filteredCities = JSON.parse(localStorage.getItem('cities')).filter((el) => el.id !== $event)

      cities.value = filteredCities
      localStorage.setItem('cities', JSON.stringify(filteredCities))
    }

    // This is a function that is called when the user grants the site access to their geodata. It will get the weather
    // data for the user's current location and then set the currentCity object to the data that it gets back.
    navigator.geolocation.getCurrentPosition(async (data) => {
      try {
        const weather = await getWeatherData([data.coords.latitude, data.coords.longitude])
        const cityStorage = JSON.parse(localStorage.getItem('currentCity'))
        const formatData = { ...weather }

        formatData.time = moment().format()

        if (cityStorage && cityStorage.id === formatData.id) {
          currentCity.value = cityStorage
        } else {
          currentCity.value = formatData
          localStorage.setItem('currentCity', JSON.stringify(formatData))
        }

        isAppReady.value = true
      } catch (e) {
        throw new Error(e)
      }
    })

    // Checking if there is a localStorage item called cities. If there is, it will set the cities array to the value of
    // the localStorage item.
    if (localStorage.getItem('cities')) {
      cities.value = JSON.parse(localStorage.getItem('cities'))
    }

    return {
      currentCity,
      isModalOpened,
      cities,
      isLoading,
      isModalLoading,
      isAppReady,
      addItem,
      updateItem,
      removeItem
    }
  }
}
</script>
