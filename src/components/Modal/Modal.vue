<template>
  <div
    class="modal"
    :class="{'modal--loading': isLoading}"
    v-show="isOpened"
  >
    <div class="modal__container">
      <div class="modal__card">

        <h3 class="modal__title">
          Choose a city
        </h3>

        <h4 class="modal__subtitle">
          To find city start typing and pick one from the suggestions
        </h4>

        <div
          class="modal__search"
          :class="{'modal__search--has-error': isCityAlreadyAdded}"
        >
          <input
            type="text"
            name="search"
            class="modal__search-input"
            placeholder="Search city"
            v-model="search"
          >
          <span class="modal__search-error">
            Choose another city. This city has already been added.
          </span>
          <div
            class="modal__search-results"
            v-if="filteredResults.length && !selectedCity.value"
            @scroll="renderMoreResults"
          >
            <button
              class="modal__search-item"
              @click="updateSearch(result)"
              v-for="(result, index) in filteredResults"
              :key="index"
            >{{ result.name }} ({{ getName(result.country) }})</button>
          </div>
        </div>

        <div class="modal__foot-row">
          <div class="modal__foot-col">
            <button class="modal__btn" @click="clearSearch">Clear</button>
          </div>
          <div class="modal__foot-col">
            <button
              class="modal__btn"
              @click="$emit('closeModal')"
            >Cancel</button>
            <button
              class="modal__btn"
              :disabled="!selectedCity.name"
              @click="addItem"
            >Add</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import cities from '../../../../world-weather/node_modules/cities.json/cities'
import { ref, toRefs, watch } from 'vue'
import { getName } from 'country-list'
import storage from '@/helpers/storageEmitter'

export default {
  name: 'ModalComponent',
  props: {
    isOpened: Boolean,
    isLoading: Boolean
  },
  emits: ['closeModal', 'addItem'],
  methods: {
    getName
  },
  setup (props, { emit }) {
    const { isOpened } = toRefs(props)
    const search = ref('')
    const lastSearch = ref('')
    const results = ref([])
    const selectedCity = ref({})
    const filteredResults = ref([])
    const isCityAlreadyAdded = ref(false)

    // Updating the search value, clearing the results and filtered results, updating the last search value and
    // assigning the selected city.
    const updateSearch = (result) => {
      search.value = result.name
      results.value = []
      filteredResults.value = []
      lastSearch.value = result.name
      selectedCity.value = { ...result }
    }

    // It clears the search, results, filtered results, last search and selected city.
    const clearSearch = () => {
      search.value = ''
      results.value = []
      filteredResults.value = []
      lastSearch.value = ''
      isCityAlreadyAdded.value = false
      Object.keys(selectedCity.value).forEach(key => delete selectedCity.value[key])
    }

    // A function that renders more results when the user scrolls to the end of the list.
    const renderMoreResults = ($event) => {
      const target = $event.target
      const length = results.value.length
      const filteredLength = filteredResults.value.length
      const isScrollEnd = target.scrollTop + target.offsetHeight >= target.scrollHeight

      if (isScrollEnd && filteredLength < length) {
        filteredResults.value = filteredResults.value.concat(results.value.slice(filteredLength, filteredLength + 10))
      }
    }

    // Watching the isOpened prop and if it is false it clears the search.
    watch(isOpened, () => {
      if (!isOpened.value) {
        setTimeout(() => {
          clearSearch()
        }, 1000)
      }
    })

    // Watching the search value and if it is not empty and not equal to the last search value it filters the cities array
    // and assigns the filtered results to the filteredResults array.
    watch(search, () => {
      results.value = []
      filteredResults.value = []

      if (search.value && search.value !== lastSearch.value) {
        const currentCity = storage.get('currentCity')
        const currentName = currentCity?.name.toLowerCase()
        const currentCountry = currentCity?.sys?.country.toLowerCase()

        isCityAlreadyAdded.value = false

        results.value = cities.filter((el) => {
          const elName = el.name.toLowerCase()
          const elCountry = el.country.toLowerCase()
          const isNameEqual = elName.includes(search.value.toLowerCase())
          const isCurrent = currentName && currentCountry && elName === currentName && elCountry === currentCountry

          return isNameEqual && !isCurrent
        })

        filteredResults.value = results.value.slice(0, 10)
      }
    })

    // A function that is called when the user clicks on the Add button. It gets the cities from the local storage,
    // filters them and checks if the selected city is already added. If it is not added it emits the addItem event and
    // passes the selected city as a payload. If it is added it clears the search and sets the isCityAlreadyAdded to true.
    const addItem = () => {
      const citiesStorage = storage.get('cities')
      const selectedCities = !citiesStorage
        ? []
        : citiesStorage.filter((el) => {
          const isEqName = el.name.toLowerCase() === selectedCity.value.name.toLowerCase()
          const isEqCountry = el.sys.country.toLowerCase() === selectedCity.value.country.toLowerCase()
          return isEqName && isEqCountry
        })

      if (!selectedCities.length) {
        emit('addItem', selectedCity.value)
      } else {
        isCityAlreadyAdded.value = true
      }

      clearSearch()
    }

    return {
      search,
      filteredResults,
      selectedCity,
      isCityAlreadyAdded,
      updateSearch,
      clearSearch,
      renderMoreResults,
      addItem
    }
  }
}
</script>

<style lang="scss">
@import "modal";
</style>
