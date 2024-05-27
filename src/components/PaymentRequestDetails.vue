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
  </div>
</template>

<script setup>
const props = defineProps({
  paymentDetails: Object,
});
</script>
