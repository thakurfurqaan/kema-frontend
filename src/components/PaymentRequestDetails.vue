<template>
  <div class="bg-gray-100 p-4 rounded">
    <h3 class="text-lg font-bold mb-2">Payment Details</h3>
    <p>
      <span class="font-bold">Amount:</span>
      {{ props.paymentDetails.currency_code }} {{ props.paymentDetails.amount }}
    </p>
    <p>
      <span class="font-bold">Status:</span> {{ props.paymentDetails.status }}
    </p>
    <p>
      <span class="font-bold">Created At:</span>
      {{ props.paymentDetails.created_at }}
    </p>
    <p v-if="props.paymentDetails.customer_email">
      <span class="font-bold">Customer Email:</span>
      {{ props.paymentDetails.customer_email }}
    </p>
    <p v-if="props.paymentDetails.customer_card_number">
      <span class="font-bold">Card Number:</span>
      **** **** **** {{ props.paymentDetails.customer_card_number.slice(-4) }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  paymentDetails: Object,
});
</script>
