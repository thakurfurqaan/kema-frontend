<template>
  <div class="min-h-screen flex items-center justify-center bg-green-500">
    <div class="bg-white p-8 shadow-md w-full max-w-md rounded my-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Generate Payment Link</h2>
      <PaymentRequestForm
        :merchants="merchants"
        :currencies="currencies"
        :isLoading="isLoading"
        @submit="createPaymentRequest"
      />
      <PaymentRequestLink
        v-if="paymentLink"
        :paymentLink="paymentLink"
        :qrCodeUrl="qrCodeUrl"
      />
    </div>
  </div>
</template>

<script setup>
import PaymentRequestForm from "@/components/PaymentRequestForm.vue";
import PaymentRequestLink from "@/components/PaymentRequestLink.vue";
import apiClient from "@/services/api";
import { getQrCodeUrl } from "@/services/qrcode";
import { onMounted, ref } from "vue";

const paymentLink = ref(null);
const qrCodeUrl = ref(null);
const merchants = ref([]);
const currencies = ref([]);
const isLoading = ref(false);

const fetchMerchants = async () => {
  try {
    const response = await apiClient.get("/v1/merchants/");
    merchants.value = response.data;
  } catch (error) {
    console.error("Error fetching merchants:", error);
  }
};

const fetchCurrencies = async () => {
  try {
    const response = await apiClient.get("/v1/payments/currencies/");
    currencies.value = response.data;
  } catch (error) {
    console.error("Error fetching currencies:", error);
  }
};

const createPaymentRequest = async (paymentData) => {
  try {
    isLoading.value = true;
    const response = await apiClient.post(
      "/v1/payments/requests/",
      paymentData
    );
    paymentLink.value = `${window.location.origin}/payment/${response.data.id}/`;
    qrCodeUrl.value = getQrCodeUrl(paymentLink.value);
  } catch (error) {
    console.error("Error creating payment:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchMerchants();
  await fetchCurrencies();
});
</script>
