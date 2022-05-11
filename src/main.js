import { createApp } from 'vue'
import App from './App.vue'

import Card from '@/components/Card/Card'
import Modal from '@/components/Modal/Modal'
import SearchField from '@/components/SearchField/SearchField'

import '@/scss/main.scss'

const app = createApp(App)

app.component('CardComponent', Card)
app.component('ModalComponent', Modal)
app.component('SearchFieldComponent', SearchField)

app.mount('#app')
