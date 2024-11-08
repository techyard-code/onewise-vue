<template>
  <v-navigation-drawer v-model="openDrawer" temporary width="400" location="right">
    <v-card :title="formTitle">
      <template v-slot:append>
        <v-btn icon="mdi-close" variant="plain" @click="close"></v-btn>
      </template>
      <v-form ref="formRef" v-model="isValid" @submit.prevent="submitForm">
        <v-card-text>
          <v-text-field
            v-model="userForm.username"
            label="Username"
            variant="underlined"
            :rules="[rules.required, rules.min]"
          />
          <v-text-field
            v-model="userForm.password"
            label="Password"
            variant="underlined"
            :rules="[rules.required, rules.min]"
          />
          <v-text-field
            v-model="userForm.gap"
            label="Duration"
            variant="underlined"
            type="number"
            :rules="[rules.required, rules.isInteger, rules.maxLength]"
            @input="validateInput"
          />
          <v-select
            v-model="userForm.stopAt"
            label="Stop At"
            variant="underlined"
            :items="usersStore.gePlanetrData"
            item-value="id"
            item-title="name"
          />
          <div class="mt-5">
            <label>Run type</label>
            <v-radio-group inline v-model="userForm.spinAuto" :rules="[rules.required]">
              <v-radio label="Manual" value="0" color="primary"></v-radio>
              <v-radio label="Custom" value="1" color="primary"></v-radio>
            </v-radio-group>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#5865f2" variant="elevated" type="submit">{{ actionMethod == 'edit' ? actionMethod : 'Add' }} User</v-btn>
          <v-btn @click="close" variant="elevated" color="red">Cancel</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <!-- Snackbar for error messages -->
    <v-snackbar v-model="snackbar" position="right" :timeout="3000" :color="color">
      <div class="d-flex justify-space-between">
        {{ errorMessage }}
        <v-btn density="compact" style="text-align: right;" text @click="snackbar = false" icon="mdi-close"/>
      </div>
    </v-snackbar>
  </v-navigation-drawer>
</template>

<script>
import { reactive, toRef, watch, ref, onMounted } from 'vue';
import { useUsersStore } from '@/stores/userstore';
import axios from 'axios';

export default {
  props: {
    openDrawer: {
      type: Boolean,
      default: false,
    },
    actionMethod: {
      type: String,
      default: 'create'
    },
    formData: {
      type: Object
    }
  },
  setup(props, { emit }) {
    const usersStore = useUsersStore();
    const openDrawer = toRef(props, 'openDrawer');
    const actionMethod = toRef(props, 'actionMethod');
    const formData = toRef(props, 'formData');
    const formTitle = ref('Add New User');
    const color = ref('red')
    const userForm = reactive({
      id: '',
      username: '',
      password: '',
      role: 'user',
      gap: '',
      spinAuto: '',
      stopAt: ''
    });

    const rules = {
      required: (value) => !!value || 'Required.',
      min: (value) => value.length >= 3 || 'Min 3 characters',
      isInteger: (value) => {
        const isValidInteger = Number.isInteger(Number(value)) && Number(value) >= 0;
        return isValidInteger || 'Duration must be a positive integer.';
      },
      maxLength: v => (v.length <= 2) || 'Maximum length is 2',
    };
    const validateInput = (event) => {
      const value = event.target.value;
      if (value && !/^\d*$/.test(value)) {
        userForm.gap = value.slice(0, -1);
      }
    };
    const isValid = ref(true);
    const formRef = ref(null);

    // Snackbar state
    const snackbar = ref(false);
    const errorMessage = ref('');

    const close = () => {
      userForm.id = null;
      userForm.username = null;
      userForm.password = null;
      userForm.role = 'user';
      userForm.gap = null;
      userForm.spinAuto = null;
      emit('closeIt');
    };

    const showError = (message) => {
      errorMessage.value = message;
      snackbar.value = true;
    };

    const submitForm = async () => {
      if (!isValid.value) return;
      try {
        let response;
        if (actionMethod.value == 'create') {
          response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}user/register`, userForm, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        } else {
          response = await axios.put(`${import.meta.env.VITE_APP_API_BASE_URL}user/update`, userForm, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
        }

        if (response .data.statusCode == 200) {
          let msg = actionMethod.value == 'create' ? 'User data successfully created!' : 'User data successfully updated!'
          showError(msg);
          color.value = 'green'
          usersStore.getUserListApi();
          close();
        } else {
          showError('Something want worng!');
          color.value = "red"
        }
      } catch (error) {
        console.error(error);
        showError('Something want worng!');
        color.value = "red"
      }
    };

    watch(openDrawer, (newVal) => {
      if (newVal && formData.value && actionMethod.value == 'edit') {
        formTitle.value = 'Edit User';
        userForm.id = formData.value.id;
        userForm.username = formData.value.username;
        userForm.password = formData.value.password;
        userForm.role = formData.value.role;
        userForm.gap = formData.value.gap;
        userForm.spinAuto = formData.value.spinAuto == 1 ? "1" : "0";
      } else {
        formTitle.value = 'Add New User';
      }
    });

    return {
      userForm,
      openDrawer,
      close,
      rules,
      isValid,
      submitForm,
      formTitle,
      snackbar,
      errorMessage,
      showError,
      color,
      validateInput,
      usersStore
    };
  },
};
</script>