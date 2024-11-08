<template>
  <div>
    <div class="text-center ma-7">
      <p class="text-h2 text-white">Planet Quotes</p>
    </div>
    <v-card class="mx-auto pa-12 pb-8" elevation="0" max-width="448" rounded="lg">
      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-text-field 
          density="compact" 
          placeholder="Enter username"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          v-model="authData.username"
          :rules="rules.username"
        />
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" 
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          v-model="authData.password"
          :rules="rules.password"
        />
        <v-btn class="mb-8" color="#f6bc1c" size="large" variant="elevated" block type="submit">
          Log In
        </v-btn>
      </v-form>
    </v-card>

    <!-- Snackbar for success and error messages -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" position="right">
      <div class="d-flex justify-space-between">
        {{ snackbarMessage }}
        <v-btn density="compact" style="text-align: right;" text @click="snackbar = false" icon="mdi-close"/>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const authData = reactive({
      username: '',
      password: '',
    });

    const rules = reactive({
      username: [
        v => !!v || 'Username is required',
      ],
      password: [
        v => !!v || 'Password is required',
      ]
    });

    const visible = ref(false);
    const form = ref(null);

    // Snackbar state
    const snackbar = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('red'); // Default to red for error

    const submitForm = async () => {
      const isValid = await form.value.validate();
      const payload = new FormData();
      Object.keys(authData).forEach(key => {
        payload.append(key, authData[key]);
      });

      if (isValid.valid) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}login`, payload, {
            headers: {
              Accept: 'application/json'
            },
          });

          if (response.status === 200) {
            localStorage.setItem('token', response.data.entity.token);
            localStorage.setItem('user_type', response.data.entity.user_type); // Assuming you want to store user_type
            snackbarMessage.value = 'Login successful!';
            snackbarColor.value = 'green';
            snackbar.value = true;
            router.push({ name: 'users' });
          }
        } catch (error) {
          console.error('Login failed:', error);
          snackbarMessage.value = 'Login failed. Please check your credentials.';
          snackbarColor.value = 'red'; // Set color to red for error
          snackbar.value = true;
        }
      } else {
        console.log('Form is invalid');
      }
    };

    return {
      visible,
      authData,
      rules,
      handleSubmit: submitForm,
      form,
      snackbar,
      snackbarMessage,
      snackbarColor,
    };
  }
}
</script>