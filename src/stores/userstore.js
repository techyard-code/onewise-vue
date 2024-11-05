import axios from 'axios';
import { defineStore } from 'pinia';

export const useUsersStore = defineStore('UsersStore', { 
    state: () => ({
        userList: [],
        filterData: {
            search: '',
            status: '',
            order: '',
            sort_by: '',
            paginated: 1,
            page_size: 10,
            page: 1,
        },
        response: null // Initialize response in the state
    }),

    actions: {
        async getUserListApi(perPage) {
            try {
                const res = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}user/getAll/1/${perPage}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (res.status === 200) {
                    this.userList = res.data.entity.users;
                }
                return res; 
            } catch (error) {
                console.error('Error fetching user list:', error);
                throw error; // Rethrow the error for further handling if needed
            }
        },
    }, 

    getters: {
        getUserData() {
            return this.userList;
        },
    }
});