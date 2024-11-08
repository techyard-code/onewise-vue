import axios from 'axios';
import { defineStore } from 'pinia';

export const useUsersStore = defineStore('UsersStore', { 
    state: () => ({
        userList: [],
        // planets
        planets: [ 
            { id: 1, name: 'Mercury' }, 
            { id: 2, name: 'Venus' },
            { id: 3, name: 'Earth' },
            { id: 4, name: 'Mars' },
            { id: 5, name: 'Jupiter' },
            { id: 6, name: 'Saturn' },
            { id: 7, name: 'Uranus' },
            { id: 8, name: 'Neptune' },
            { id: 9, name: 'Pluto' },
            { id: 10, name: 'Sun' },
            { id: 11, name: 'Moon' },
        ]
    }),

    actions: {
        async getUserListApi(perPage) {
            try {
                const res = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}user/getAll/1/${perPage}`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
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

        gePlanetrData() {
            return this.planets;
        },
    }
});