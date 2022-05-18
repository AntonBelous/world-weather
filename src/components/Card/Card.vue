<template>
  <div
    class="card"
    :class="{'card--loading': isLoading}"
  >

    <div class="card__head-row">
      <h3 v-if="cardInfo.name" class="card__title">
        {{ cardInfo.name }}
      </h3>
      <div v-if="cardInfo.sys.country" class="card__subtitle">
        {{ getName(cardInfo.sys.country) }}
      </div>
    </div>

    <div class="card__body-row">
      <div class="card__list">
        <div v-if="cardInfo.weather[0].main" class="card__list-block">
          <div class="card__list-col">
            Weather
          </div>
          <div class="card__list-col">
            {{ cardInfo.weather[0].main }}
          </div>
        </div>
        <div v-if="cardInfo.main.temp" class="card__list-block">
          <div class="card__list-col">
            Temperature
          </div>
          <div class="card__list-col">
            {{ tempString }} °C
          </div>
        </div>
        <div v-if="cardInfo.main.humidity" class="card__list-block">
          <div class="card__list-col">
            Humidity
          </div>
          <div class="card__list-col">
            {{ cardInfo.main.humidity }} %
          </div>
        </div>
      </div>
      <div class="card__timer">
        {{ timeString }}
      </div>
    </div>

    <div class="card__foot-row">
      <button
        v-if="!hideRemoveButton"
        class="card__btn"
        @click="$emit('removeItem', cardInfo.id)"
      >Remove</button>
      <button
        class="card__btn card__btn--reload"
        @click="$emit('updateItem', {city: cardInfo.name, country: cardInfo.sys.country})"
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
    cardInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    isLoading: Boolean,
    hideRemoveButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['updateItem', 'removeItem'],
  setup (props) {
    const timeString = ref('')
    let interval
    const tempString = computed(() => {
      const string = props.cardInfo.main.temp.toString()
      return string.includes('.') ? string.split('.')[0] : string
    })

    const updateTimeString = () => {
      timeString.value = moment(props.cardInfo.time).fromNow()
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
  },
  methods: {
    getName
  }
}
</script>

<style lang="scss">
@import "card";
</style>
