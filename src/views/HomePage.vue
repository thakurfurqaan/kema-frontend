<script setup>
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import ProgressSpinner from "primevue/progressspinner";
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-green-500">
    <div class="bg-white p-8 shadow-md w-full max-w-md rounded my-10">
      <h2 class="text-2xl font-bold mb-6 text-center">Generate Payment Link</h2>
      <form @submit.prevent="createPaymentRequest" class="space-y-4">
        <div>
          <label for="merchant" class="font-bold block mb-2">Merchant</label>
          <Dropdown
            v-model="selectedMerchant"
            :options="merchants"
            optionLabel="business_name"
            optionValue="id"
            placeholder="Select a Merchant"
            class="w-full md:w-14rem"
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
            class="w-full md:w-14rem"
            :invalid="!selectedCurrency"
          />
        </div>
        <div>
          <label for="amount" class="font-bold block mb-2"> Amount </label>
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
      <div v-if="paymentLink" class="text-center">
        <h3>Payment Link</h3>
        <a :href="paymentLink">{{ paymentLink }}</a>
        <br />
        <h3>QR Code</h3>
        <img :src="qrCodeUrl" alt="QR Code" />
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/services/api";
import { getQrCodeUrl } from "@/services/qrcode";

export default {
  name: "HomePage",
  data() {
    return {
      selectedMerchant: null,
      selectedCurrency: null,
      amount: 0,
      paymentLink: null,
      qrCodeUrl: null,
      merchants: [],
      currencies: [],
      isLoading: false,
    };
  },
  async created() {
    await this.fetchMerchants();
    await this.fetchCurrencies();
  },
  methods: {
    async fetchMerchants() {
      try {
        const response = await apiClient.get("/v1/merchants/");
        this.merchants = response.data;
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    },
    async fetchCurrencies() {
      try {
        const response = await apiClient.get("/v1/payments/currencies/");
        this.currencies = response.data;
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    },
    async createPaymentRequest() {
      try {
        this.isLoading = true;
        const response = await apiClient.post("/v1/payments/requests/", {
          merchant: this.selectedMerchant,
          amount: this.amount,
          currency: this.selectedCurrency,
        });
        this.paymentLink = `${window.location.origin}/payment/${response.data.id}/`;
        this.qrCodeUrl = getQrCodeUrl(this.paymentLink);
      } catch (error) {
        console.error("Error creating payment:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
