import { createApp } from 'vue'
import App from './App.vue'
import { VuesticPlugin } from 'vuestic-ui'
import { registerGrid } from '@grapecity/wijmo.vue2.grid'
import 'vuestic-ui/dist/vuestic-ui.css'
import '@grapecity/wijmo.styles/wijmo.css'

const app = createApp(App)

registerGrid(app)

app.use(VuesticPlugin)
app.mount('#app')
