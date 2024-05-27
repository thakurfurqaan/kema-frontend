<template>
<div>
    <h2>Generate Payment Link</h2>
    <form @submit.prevent="createPaymentRequest">
      <div>
        <label for="merchant">Merchant:</label>
        <select v-model="selectedMerchant" required>
          <option v-for="merchant in merchants" :key="merchant.id" :value="merchant.id">
            {{ merchant.business_name }}
          </option>
        </select>
      </div>
      <div>
        <label for="currency">Currency:</label>
        <select v-model="selectedCurrency" required>
          <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
            {{ currency.name }} ({{ currency.code }})
          </option>
        </select>
      </div>
      <div>
        <label for="amount">Amount:</label>
        <input type="number" v-model="amount" required>
      </div>
      <button type="submit">Create Payment</button>
    </form>
    <div v-if="paymentLink">
      <h3>Payment Link</h3>
      <a href="paymentLink">{{ paymentLink }}</a>
      <br>
      <img :src="qrCodeUrl" alt="QR Code">
    </div>
  </div>
</template>

<script>
import apiClient from '@/services/api';
import { getQrCodeUrl } from '@/services/qrcode';

export default {
  data() {
    return {
      selectedMerchant: null,
      selectedCurrency: null,
      amount: '',
      paymentLink: null,
      qrCodeUrl: null,
      merchants: [],
      currencies: [],
      isPaymentLinkCreated: false
    };
  },
  async created(){
    await this.fetchMerchants();
    await this.fetchCurrencies();
  },
  methods: {
    async fetchMerchants() {
      try {
        const response = await apiClient.get('/v1/merchants/');
        this.merchants = response.data;
      } catch (error) {
        console.error('Error fetching merchants:', error);
      }
    },
    async fetchCurrencies() {
      try {
        const response = await apiClient.get('/v1/payments/currencies/');
        this.currencies = response.data;
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    },
    async createPaymentRequest() {
      try {
        const response = await apiClient.post('/v1/payments/requests/', {
          merchant: this.selectedMerchant,
          amount: this.amount,
          currency: this.selectedCurrency
        });
        this.paymentLink = `${window.location.origin}/payment/${response.data.id}/`;
        this.qrCodeUrl = getQrCodeUrl(this.paymentLink);
      } catch (error) {
        console.error('Error creating payment:', error);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
