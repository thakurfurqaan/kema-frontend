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
        <PaymentRequestDetails :paymentDetails="paymentRequest" />
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
              @click="showModal = true"
            />
          </div>
        </div>
      </div>
      <nav class="text-center mt-2">
        <RouterLink to="/">Generate Payment Link</RouterLink>
      </nav>
    </div>

    <Dialog header="Enter Payment Details" v-model:visible="showModal" modal>
      <form @submit.prevent="submitPaymentDetails" class="space-y-4">
        <div>
          <label for="email" class="font-bold block mb-2">Email</label>
          <InputText
            v-model="email"
            id="email"
            type="email"
            required
            class="w-full"
          />
        </div>
        <div>
          <label for="cardNumber" class="font-bold block mb-2"
            >Card Number</label
          >
          <InputText
            v-model="cardNumber"
            id="cardNumber"
            type="text"
            required
            class="w-full"
          />
        </div>
        <div class="text-center">
          <Button type="submit" label="Submit" class="w-full" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import MerchantDetails from "@/components/MerchantDetails.vue";
import PaymentRequestDetails from "@/components/PaymentRequestDetails.vue";
import apiClient from "@/services/api";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const paymentRequestId = ref(route.params.id);
const paymentRequest = ref(null);
const isLoading = ref(false);
const error = ref(null);
const showModal = ref(false);
const email = ref("");
const cardNumber = ref("");

const fetchPaymentRequest = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.get(
      `/v1/payments/requests/${paymentRequestId.value}/`
    );
    paymentRequest.value = response.data;
  } catch (err) {
    console.error("Error retrieving payment:", err);
    error.value = "Invalid payment ID";
  } finally {
    isLoading.value = false;
  }
};

const submitPaymentDetails = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.post(
      `/v1/payments/requests/${paymentRequestId.value}/pay/`,
      {
        email: email.value,
        cardNumber: cardNumber.value,
      }
    );
    console.log("Payment successful:", response.data);
    showModal.value = false;
    await fetchPaymentRequest();
  } catch (err) {
    console.error("Error making payment:", err);
  } finally {
    isLoading.value = false;
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
