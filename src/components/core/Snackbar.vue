<!-- App.vue -->
<template>
  <div id="app">
    <v-btn @click="showError">Trigger Error Snackbar</v-btn>
    <v-snackbar v-model="snackbar" :timeout="3000" color="red">
      {{ errorMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      errorMessage: '',
    };
  },
  methods: {
    showError() {
      this.errorMessage = 'An error occurred!'; // Set your error message here
      this.snackbar = true; // Show the snackbar
    },
  },
};
</script>

<style>
/* Add any custom styles here */
</style>