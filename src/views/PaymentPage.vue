<script setup>
import Button from "primevue/button";
</script>

<template>
<div class="min-h-screen flex items-center justify-center bg-green-500">
   <div class="bg-white p-8 shadow-md w-full max-w-md rounded my-10">
    <h2 class="text-2xl font-bold mb-6 text-center">Payment Request</h2>
    <div v-if="paymentRequest" class="space-y-4">
        <div class="bg-gray-100 p-5 rounded">
          <h3 class="text-lg font-bold mb-2">Merchant Details</h3>
          <p><span class="font-bold">Name:</span> {{ paymentRequest.merchant_details.business_name }}</p>
          <p><span class="font-bold">Email:</span> {{ paymentRequest.merchant_details.email }}</p>
        </div>
        <div class="bg-gray-100 p-4 rounded">
          <h3 class="text-lg font-bold mb-2">Payment Details</h3>
          <p><span class="font-bold">Amount:</span> {{ paymentRequest.currency_code }} {{ paymentRequest.amount }} </p>
          <p><span class="font-bold">Status:</span> {{ paymentRequest.status }}</p>
          <p><span class="font-bold">Created At:</span> {{ paymentRequest.created_at }}</p>
        </div>
        <Button type="button" label="Pay Now" class="w-full " @click="makePayment" />
      </div>
      <div v-else class="text-center">
        <p> <ProgressSpinner style="width: 25px; height: 25px"/></p>
      </div>
    <nav class="text-center mt-2">
        <RouterLink to="/">Generate Payment Link</RouterLink>
    </nav>
  </div>
  </div>
</template>

<script>
import apiClient from '@/services/api';

export default {
  name: "PaymentPage",
  data() {
    return {
      paymentRequest: null,
      paymentId: this.$route.params.id,
      isLoading: false,
    };
  },
  async created(){
    await this.fetchPaymentRequest();
  },
  methods: {
    async fetchPaymentRequest() {
      try {
        this.isLoading=true;
        const response = await apiClient.get(`/v1/payments/requests/${this.paymentId}/`);
        this.paymentRequest = response.data;
        console.log(response.data)
      } catch (error) {
        console.error('Error creating payment:', error);
      } finally {
        this.isLoading=false;
      }
    },
    async makePayment() {
        try {
            const response = await apiClient.post('/v1/payments/', {
            payment_request: this.paymentRequest.id
            });
            console.log('Payment successful:', response.data);
            this.isPaymentLinkCreated = true;
        } catch (error) {
            console.error('Error making payment:', error);
        }
    }
  }
};
</script>

