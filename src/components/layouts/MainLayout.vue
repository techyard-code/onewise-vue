<template>
    <v-layout>
      <nav-bar @updateDrawer="updateDrawer" />
      <v-main>
          <router-view></router-view>
      </v-main>
    </v-layout>
  </template>
  
  <script>
  import NavBar from '../core/NavBar.vue'
  
  export default {
    components: {
      NavBar
    },
    setup() {
      const drawer = ref(true)
      const updateDrawer = () => {
        drawer.value = !drawer.value
        console.log(drawer.value)
      }
      return {
        drawer,
        updateDrawer
      }
    }
  }
  </script>