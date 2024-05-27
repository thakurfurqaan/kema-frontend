<template>
  <form @submit.prevent="createPaymentRequest" class="space-y-4">
    <div>
      <label for="merchant" class="font-bold block mb-2">Merchant</label>
      <Dropdown
        v-model="selectedMerchant"
        :options="merchants"
        optionLabel="business_name"
        optionValue="id"
        placeholder="Select a Merchant"
        class="w-full"
        :invalid="!selectedMerchant"
      />
    </div>
    <div>
      <label for="currency" class="font-bold block mb-2">Currency</label>
      <Dropdown
        v-model="selectedCurrency"
        :options="currencies"
        optionLabel="code"
        optionValue="id"
        placeholder="Select a Currency"
        class="w-full"
        :invalid="!selectedCurrency"
      />
    </div>
    <div>
      <label for="amount" class="font-bold block mb-2">Amount</label>
      <InputNumber
        v-model="amount"
        inputId="amount"
        :minFractionDigits="0"
        :maxFractionDigits="2"
        required
        class="w-full"
        :invalid="!amount"
      />
    </div>
    <div class="flex justify-center">
      <div v-if="isLoading">
        <ProgressSpinner style="width: 25px; height: 25px" />
      </div>
      <div v-else class="text-center">
        <Button
          type="submit"
          :disabled="!(selectedMerchant && selectedCurrency && amount)"
          >Generate Payment Link</Button
        >
      </div>
    </div>
  </form>
</template>

<script setup>
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import ProgressSpinner from "primevue/progressspinner";
import { ref, watch } from "vue";

const props = defineProps({
  merchants: Array,
  currencies: Array,
  isLoading: Boolean,
  onSubmit: Function,
});

const selectedMerchant = ref(null);
const selectedCurrency = ref(null);
const amount = ref(0);

const createPaymentRequest = () => {
  props.onSubmit({
    merchant: selectedMerchant.value,
    currency: selectedCurrency.value,
    amount: amount.value,
  });
};

watch(
  () => props.isLoading,
  (newValue) => {
    if (!newValue) {
      selectedMerchant.value = null;
      selectedCurrency.value = null;
      amount.value = 0;
    }
  }
);
</script>
