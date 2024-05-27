<template>
  <div class="min-h-screen flex items-center justify-center bg-green-500">
    <div class="bg-white p-8 shadow-md w-full max-w-md rounded my-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Payment Request</h2>
      <div v-if="paymentRequest?.status === 'PAID'" class="text-green-500">
        <Message severity="success">Your payment was successful!</Message>
      </div>
      <div v-if="error" class="text-red-500">
        <Message severity="error">{{ error }}</Message>
      </div>
      <div v-if="paymentRequest" class="space-y-4">
        <MerchantDetails :merchantDetails="paymentRequest.merchant_details" />
        <PaymentDetails :paymentDetails="paymentRequest" />
        <div v-if="paymentRequest?.status === 'PENDING'" class="text-red-500">
          <div v-if="isLoading" class="text-center">
            <ProgressSpinner
              style="width: 40px; height: 40px"
              strokeWidth="3"
            />
          </div>
          <div v-else class="text-center">
            <Button
              type="button"
              label="Pay Now"
              class="w-full"
              @click="makePayment"
            />
          </div>
        </div>
      </div>
      <nav class="text-center mt-2">
        <RouterLink to="/">Generate Payment Link</RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import MerchantDetails from "@/components/MerchantDetails.vue";
import PaymentDetails from "@/components/PaymentRequestDetails.vue";
import apiClient from "@/services/api";
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const paymentRequestId = ref(route.params.id);
const paymentRequest = ref(null);
const isLoading = ref(false);
const error = ref(null);

const fetchPaymentRequest = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.get(
      `/v1/payments/requests/${paymentRequestId.value}/`
    );
    paymentRequest.value = response.data;
    console.log(response.data);
  } catch (err) {
    console.error("Error retrieving payment:", err);
    error.value = "Invalid payment ID";
  } finally {
    isLoading.value = false;
  }
};

const makePayment = async () => {
  try {
    const response = await apiClient.post(
      `/v1/payments/requests/${paymentRequestId.value}/pay/`
    );
    console.log("Payment successful:", response.data);
    await fetchPaymentRequest();
  } catch (err) {
    console.error("Error making payment:", err);
  }
};

onMounted(fetchPaymentRequest);
</script>

<style scoped>
.bg-green-500 {
  background-color: #10b981;
}
.text-red-500 {
  color: #f56565;
}
.text-green-500 {
  color: #48bb78;
}
</style>
