<template>
  <div
    v-show="isOpened"
    class="modal"
  >
    <div class="modal__container">
      <div
        class="modal__card"
        :class="{'modal__card--loading': isLoading}"
      >
        <svg
          v-show="isLoading"
          class="modal__spinner"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>

        <h3 class="modal__title">
          Choose a city
        </h3>

        <h4 class="modal__subtitle">
          To find city start typing and pick one from the suggestions
        </h4>

        <div
          class="modal__search"
        >
          <input
            v-model="search"
            type="text"
            name="search"
            class="modal__search-input"
            placeholder="Search city"
            :class="{'border-red': isCityAlreadyAdded}"
          >
          <span
            class="modal__search-error"
            :class="{'block': isCityAlreadyAdded}"
          >
            Choose another city. This city has already been added.
          </span>
          <div
            v-if="filteredResults.length && !selectedCity.value"
            class="modal__search-results"
            @scroll="renderMoreResults"
          >
            <button
              v-for="(result, index) in filteredResults"
              :key="index"
              class="modal__search-item"
              @click="updateSearch(result)"
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
import cities from 'cities.json/cities.json'
import { ref, toRefs, watch } from 'vue'
import { getName } from 'country-list'
import storage from '../../helpers/storageEmitter'

export default {
  name: 'ModalComponent',
  props: {
    isOpened: Boolean,
    isLoading: Boolean
  },
  emits: ['closeModal', 'addItem'],
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
          if (isCityAlreadyAdded.value) isCityAlreadyAdded.value = false
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
      const selectedCities = !citiesStorage?.length
        ? []
        : citiesStorage.filter((el) => {
          const isEqName = el.name.toLowerCase() === selectedCity.value.name.toLowerCase()
          const isEqCountry = el.sys.country.toLowerCase() === selectedCity.value.country.toLowerCase()
          return isEqName && isEqCountry
        })

      if (!selectedCities?.length) {
        emit('addItem', selectedCity.value)
        clearSearch()
      } else {
        clearSearch()
        isCityAlreadyAdded.value = true
      }
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
  },
  methods: {
    getName
  }
}
</script>

<style>
@import "modal.css";
</style>
