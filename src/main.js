import PrimeVue from "primevue/config";
import "./index.css";

import "primevue/resources/themes/aura-light-green/theme.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.mount("#app");
