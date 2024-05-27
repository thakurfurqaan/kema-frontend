import HomePage from "@/views/HomePage.vue";
import PaymentPage from "@/views/PaymentPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/payment/:id",
    name: "Payment",
    component: PaymentPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
