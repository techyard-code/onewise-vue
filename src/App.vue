<template>
  <v-app style="background-color: #6c15a2;">
      <component :is="layout"/>
  </v-app>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'

const BlankLayout = () => import('./components/layouts/BlankLayout.vue')
const MainLayout = () => import('./components/layouts/MainLayout.vue')

export default {
  name: 'App',
  components: {
    BlankLayout: defineAsyncComponent(BlankLayout),
    MainLayout: defineAsyncComponent(MainLayout)
  },

  setup() {
    const route = useRoute()
    const layout = computed(() => {
      return route.meta.layout || 'blank-layout'
    })
    return {
      layout
    }
  }
}
</script>
