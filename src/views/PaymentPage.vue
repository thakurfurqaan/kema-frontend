<script setup>
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-green-500">
    <div class="bg-white p-8 shadow-md w-full max-w-md rounded my-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Payment Request</h2>
      <div v-if="paymentRequest?.status === 'PAID'" class="text-red-500">
        <Message severity="success">Your payment was successful!</Message>
      </div>
      <div v-if="error" class="text-red-500">
        <Message severity="error">{{ error }}</Message>
      </div>
      <div v-if="paymentRequest" class="space-y-4">
        <div class="bg-gray-100 p-5 rounded">
          <h3 class="text-lg font-bold mb-2">Merchant Details</h3>
          <p>
            <span class="font-bold">Name:</span>
            {{ paymentRequest.merchant_details.business_name }}
          </p>
          <p>
            <span class="font-bold">Email:</span>
            {{ paymentRequest.merchant_details.email }}
          </p>
        </div>
        <div class="bg-gray-100 p-4 rounded">
          <h3 class="text-lg font-bold mb-2">Payment Details</h3>
          <p>
            <span class="font-bold">Amount:</span>
            {{ paymentRequest.currency_code }} {{ paymentRequest.amount }}
          </p>
          <p>
            <span class="font-bold">Status:</span> {{ paymentRequest.status }}
          </p>
          <p>
            <span class="font-bold">Created At:</span>
            {{ paymentRequest.created_at }}
          </p>
        </div>
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

<script>
import apiClient from "@/services/api";

export default {
  name: "PaymentPage",
  data() {
    return {
      paymentRequest: null,
      paymentRequestId: this.$route.params.id,
      isLoading: false,
      error: null,
    };
  },
  async created() {
    await this.fetchPaymentRequest();
  },
  methods: {
    async fetchPaymentRequest() {
      try {
        this.isLoading = true;
        const response = await apiClient.get(
          `/v1/payments/requests/${this.paymentRequestId}/`
        );
        this.paymentRequest = response.data;
        console.log(response.data);
      } catch (error) {
        console.error("Error retrieving payment:", error);
        this.error = "Invalid payment ID";
      } finally {
        this.isLoading = false;
      }
    },
    async makePayment() {
      try {
        const response = await apiClient.post(
          `/v1/payments/requests/${this.paymentRequestId}/process/`
        );
        console.log("Payment successful:", response.data);
        await this.fetchPaymentRequest();
      } catch (error) {
        console.error("Error making payment:", error);
      }
    },
  },
};
</script>
