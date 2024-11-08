<template>
  <v-container fluid style="border: 2px solid white">
    <v-row>
      <v-col cols="6" class="mt-3">
        <span class="text-h5 text-white">
          <v-icon>mdi-account</v-icon> User List
        </span>
      </v-col>
      <v-col cols="6" class="d-flex justify-end mb-2">
        <v-btn type="primary" @click="createItem" class="mt-3">Add New User</v-btn>
      </v-col>
    </v-row>
    <v-col class="mt-n6">
      <v-data-table-virtual
        v-model:items-per-page="filterData.itemsPerPage"
        :headers="tableHeaderData"
        :items="filterData.serverItems"
        :items-length="filterData.totalItems"
        :loading="filterData.loading"
        :search="filterData.search"
        item-value="name"
        @update:options="loadItems"
        theme="dark"
        height="400px"
        fixed-header 
      >
        <template #item.serialNumber="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.spinAuto="{ item }">
          <v-chip color="primary" variant="flat">
            {{ item.spinAuto == 0 ? 'Manual' : 'Custom' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-menu location="start">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"/>
            </template>
            <v-list class="bg-white">
              <v-list-item>
                <v-btn prepend-icon="mdi-pencil" size="small" @click="editItem(item)">Edit</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn prepend-icon="mdi-delete" size="small" class="mr-2" @click="deleteItem(item)">Delete</v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table-virtual>
    </v-col>
    <user-form :openDrawer="openDrawer" :actionMethod="actionMethod" :formData="formData" @closeIt="closeIt" />
    
    <!-- Snackbar for error messages -->
    <v-snackbar v-model="snackbar" :timeout="3000" position="right" :color="color">
      <div class="d-flex justify-space-between">
        {{ errorMessage }}
        <v-btn density="compact" style="text-align: right;" text @click="snackbar = false" icon="mdi-close"/>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script>
import UserForm from './UserForm.vue';  
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useUsersStore } from '@/stores/userstore';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { green } from 'vuetify/util/colors';

export default {
  components: {
    UserForm
  },
  setup() {
    const router = useRouter();
    const usersStore = useUsersStore();
    const userData = computed(() => usersStore.getUserData);
    const formData = ref({});
    const actionMethod = ref('create');
    const color = ref('red')
    const filterData = reactive({
      itemsPerPage: 100,
      search: '',
      serverItems: [],
      loading: true,
      totalItems: 0,
    });
    const tableHeaderData = reactive([
      { title: 'S/N', key: 'serialNumber', align: 'start', sortable: true },
      { title: 'User  Name', align: 'start', sortable: false, key: 'username' },
      { title: 'Password', key: 'password', align: 'center' },
      { title: 'Run Type', key: 'spinAuto', align: 'center' },
      { title: 'Duration', key: 'gap', align: 'center' },
      { title: 'Created Date', key: 'createdDate', align: 'center' },
      { title: 'Actions', key: 'actions', align: 'end', sortable: false },
    ]);

    // Snackbar state
    const snackbar = ref(false);
    const errorMessage = ref('');

    // Method to show error message
    const showError = (message) => {
      errorMessage.value = message;
      snackbar.value = true;
    };

    const loadItems = async ({ page, itemsPerPage, sortBy }) => {
      filterData.loading = true;
      await usersStore.getUserListApi(100);
      if (sortBy.length) {
        const sortKey = sortBy[0].key;
        const sortOrder = sortBy[0].order;
        if (sortKey === 'serialNumber') {
          userData.value.sort((a, b) => {
            const aValue = a.serialNumber;
            const bValue = b.serialNumber;
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
          });
        } else {
          userData.value.sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
          });
        }
      }
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const items = userData.value.slice(start, end);
      filterData.serverItems = items;
      filterData.totalItems = userData.value.length;
      filterData.loading = false;
    };

    const openDrawer = ref(false);
    const openFilterModal = ref(false);

    const createItem = () => {
      actionMethod.value = 'create';
      formData.value = {};
      openDrawer.value = true;
    };

    const editItem = (item) => {
      actionMethod.value = 'edit';
      formData.value = item;
      openDrawer.value = true;
    };

    const closeIt = () => {
      openDrawer.value = false;
      formData.value = {};
    };

    const deleteItem = async (item) => {
      try{
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}user/${item.id}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.statusCode == 200) {
          showError('User  data successfully deleted!');
          color.value = 'green'
          await loadItems({ page: 1, itemsPerPage: filterData.itemsPerPage, sortBy: [] });
        } else {
          showError('Something went wrong!');
          color.value = 'red'
        }
      } catch (error) {
        showError('Something went wrong!');
        color.value = 'red'
      }
    }

    onMounted(async () => {
      // if (!localStorage.getItem('token')) router.push({ name: 'login' });
    });

    return {
      filterData,
      tableHeaderData,
      loadItems,
      openDrawer,
      openFilterModal,
      editItem,
      closeIt,
      actionMethod,
      formData,
      createItem,
      snackbar,
      errorMessage,
      showError,
      deleteItem
    };
  },
};
</script>