<template>
  <div class="bg-gray-100 p-5 rounded">
    <h3 class="text-lg font-bold mb-2">Merchant Details</h3>
    <p>
      <span class="font-bold">Name:</span>
      {{ props.merchantDetails.business_name }}
    </p>
    <p>
      <span class="font-bold">Email:</span>
      {{ props.merchantDetails.email }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  merchantDetails: Object,
});
</script>
