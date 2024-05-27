<template>
  <div class="text-center" v-if="paymentLink">
    <h3>Payment Link</h3>
    <a :href="paymentLink">{{ props.paymentLink }}</a>
    <br />
    <h3>QR Code</h3>
    <img :src="props.qrCodeUrl" alt="QR Code" />
  </div>
</template>

<script setup>
const props = defineProps({
  paymentLink: String,
  qrCodeUrl: String,
});
</script>
