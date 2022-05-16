<template>
  <transition>
    <div
      class="main"
      v-if="isAppReady"
    >
      <h2 class="main__title">World Weather</h2>

      <template v-if="currentCity.id && isGeoEnabled">
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

      <h4 class="main__subtitle" v-else>
        Please give this site access to your geolocation to see the weather in your city
      </h4>

      <transition>
        <div class="main__body-row" ref="bodyRow" v-if="cities.length">
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
      </transition>

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
import { ref, watch } from 'vue'
import getWeatherData from './helpers/getWeatherData'
import storage from '@/helpers/storageEmitter'
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
    const isGeoEnabled = ref(false)
    const bodyRow = ref(null)
    const isNewItemAdded = ref(false)

    const notFoundErrorHandler = (err) => {
      if (err.message.includes('code 404')) {
        alert('City not found in database')
        isModalLoading.value = false
      }
    }

    // This is a function that is called when the user clicks the add button on the modal. It will get the weather data
    // for the city that the user entered and then add it to the cities array.
    const addItem = async ($event) => {
      isModalLoading.value = true

      try {
        const weather = await getWeatherData($event.name, $event.country)
        weather.time = moment().format()
        cities.value.push(weather)
        storage.set('cities', cities.value)
        isNewItemAdded.value = true
        isModalOpened.value = false
        isModalLoading.value = false
      } catch (e) {
        notFoundErrorHandler(e)
        throw new Error(e)
      }
    }

    // This is a function that is called when the user clicks the update button on a card. It will get the weather data
    // for the city that the user clicked on and then update the card with the new data.
    const updateItem = async ($event) => {
      isLoading.value = true

      try {
        const weather = await getWeatherData($event.city, $event.country)
        const cityStorage = storage.get('currentCity')
        const formatData = { ...weather }

        formatData.time = moment().format()

        if (cityStorage?.id !== formatData?.id) {
          const result = []

          storage.get('cities').forEach((el, i) => {
            if (el.id === formatData.id) {
              cities.value[i] = formatData
              result.push(formatData)
              return
            }

            result.push(el)
          })

          storage.set('cities', result)
        } else {
          currentCity.value = formatData
          storage.set('currentCity', formatData)
        }

        isLoading.value = false
      } catch (e) {
        notFoundErrorHandler(e)
        throw new Error(e)
      }
    }

    // This is a function that is called when the user clicks the remove button on a card. It will filter the cities array
    // and remove the city that the user clicked on.
    const removeItem = ($event) => {
      const filteredCities = storage.get('cities').filter((el) => el.id !== $event)

      cities.value = filteredCities
      storage.set('cities', filteredCities)
    }

    // Filtering the cities array and removing the current city from it.
    const setDefaultCitiesStorage = () => {
      const cityStorage = storage.get('currentCity')
      const citiesStorage = storage.get('cities')
      const filteredCities = citiesStorage?.filter((el) => currentCity.value.id !== el.id)

      if (!isGeoEnabled.value && cityStorage) storage.remove('currentCity')

      if (filteredCities?.length) {
        storage.set('cities', filteredCities)
        cities.value = filteredCities
      } else {
        storage.remove('cities')
      }
    }

    // This is a function that is called when the user clicks the add button on the modal. It will get the weather data
    // for the city that the user entered and then add it to the cities array.
    navigator.geolocation.getCurrentPosition(
      async (data) => {
        try {
          const weather = await getWeatherData([data.coords.latitude, data.coords.longitude])
          const cityStorage = storage.get('currentCity')
          const formatData = { ...weather }

          formatData.time = moment().format()

          if (cityStorage && cityStorage.id === formatData.id) {
            currentCity.value = cityStorage
          } else {
            currentCity.value = formatData
            storage.set('currentCity', formatData)
          }

          isGeoEnabled.value = true
          isAppReady.value = true

          setDefaultCitiesStorage()
        } catch (e) {
          notFoundErrorHandler(e)
          throw new Error(e)
        }
      },
      (e) => {
        if (e.PERMISSION_DENIED) isGeoEnabled.value = false
        setDefaultCitiesStorage()

        isAppReady.value = true
      }
    )

    watch(isNewItemAdded, () => {
      if (bodyRow.value) {
        setTimeout(() => {
          bodyRow.value.lastElementChild.scrollIntoView()
        }, 400)
      }

      isNewItemAdded.value = false
    })

    return {
      isGeoEnabled,
      currentCity,
      isModalOpened,
      cities,
      isLoading,
      isModalLoading,
      isAppReady,
      bodyRow,
      addItem,
      updateItem,
      removeItem
    }
  }
}
</script>
