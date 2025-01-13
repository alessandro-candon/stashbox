import { createApp } from 'vue';
import App from './App.vue';
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'
import {Quasar, ClosePopup, Dialog, Loading, Notify} from "quasar";
import router from "./ui/router";
import { createPinia } from 'pinia'

const app = createApp(App);
app.use(router)
app.use(createPinia())

app.use(Quasar, {
    plugins: {
        Notify,
        Loading,
        Dialog,
    },
    config: {},
    directives: { ClosePopup },
})
app.mount('#app');