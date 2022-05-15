<template>
  <div
    class="card"
    :class="{'card--loading': isLoading}"
  >

    <div class="card__head-row">
      <h3 class="card__title" v-if="data.name">{{ data.name }}</h3>
      <div class="card__subtitle" v-if="data.sys.country">
        {{ getName(data.sys.country) }}
      </div>
    </div>

    <div class="card__body-row">
      <div class="card__list">
        <div class="card__list-block" v-if="data.weather[0].main">
          <div class="card__list-col">
            Weather
          </div>
          <div class="card__list-col">
            {{ data.weather[0].main }}
          </div>
        </div>
        <div class="card__list-block" v-if="data.main.temp">
          <div class="card__list-col">
            Temperature
          </div>
          <div class="card__list-col">
            {{ tempString }} °C
          </div>
        </div>
        <div class="card__list-block" v-if="data.main.humidity">
          <div class="card__list-col">
            Humidity
          </div>
          <div class="card__list-col">
            {{ data.main.humidity }} %
          </div>
        </div>
      </div>
      <div class="card__timer">
        {{ timeString }}
      </div>
    </div>

    <div class="card__foot-row">
      <button
        class="card__btn"
        v-if="!hideRemoveButton"
        @click="$emit('removeItem', data.id)"
      >Remove</button>
      <button
        class="card__btn card__btn--reload"
        @click="$emit('updateItem', {city: data.name, country: data.sys.country})"
      >Reload</button>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { getName } from 'country-list'
import moment from 'moment'

export default {
  name: 'CardComponent',
  props: {
    data: Object,
    isLoading: Boolean,
    hideRemoveButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['updateItem', 'removeItem'],
  methods: {
    getName
  },
  setup (props) {
    const timeString = ref('')
    let interval
    const tempString = computed(() => {
      const string = props.data.main.temp.toString()
      return string.includes('.') ? string.split('.')[0] : string
    })

    const updateTimeString = () => {
      timeString.value = moment(props.data.time).fromNow()
    }

    onMounted(() => {
      updateTimeString()
      interval = setInterval(() => {
        updateTimeString()
      }, 1000)
    })

    onBeforeUnmount(() => {
      clearInterval(interval)
    })

    return {
      timeString,
      tempString
    }
  }
}
</script>

<style lang="scss">
@import "card";
</style>
