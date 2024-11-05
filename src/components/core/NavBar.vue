<template>
  <v-app-bar style="background-color: #6c15a2;">
    <v-app-bar-title class="text-white">Application Bar</v-app-bar-title>
    <v-btn class="mr-4" color="#f6bc1c" variant="flat" append-icon="mdi-logout" @click="logout">
      Logout
    </v-btn>
  </v-app-bar>

  <!-- Snackbar for success and error messages -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" position="right">
    {{ snackbarMessage }}
    <v-btn density="compact" style="text-align: right;" text @click="snackbar = false" icon="mdi-close"/>
  </v-snackbar>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup(props, { emit }) {
    const router = useRouter();
    const drawer = ref(false);
    
    // Snackbar state
    const snackbar = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('red'); // Default to red for error

    const logout = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API_BASE_URL}logout`, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (res.status === 200) {
          localStorage.removeItem('token');
          snackbarMessage.value = 'Logout successful!';
          snackbarColor.value = 'green'; // Set color to green for success
          snackbar.value = true; // Show snackbar
          router.push({ name: 'login' });
        }
      } catch (error) {
        console.error('Logout failed:', error);
        snackbarMessage.value = 'Logout failed. Please try again.';
        snackbarColor.value = 'red'; // Set color to red for error
        snackbar.value = true; // Show snackbar
      }
    };

    const updateDrawer = () => {
      emit('updateDrawer');
    };

    return {
      drawer,
      updateDrawer,
      logout,
      snackbar,
      snackbarMessage,
      snackbarColor,
    };
  },
};
</script>