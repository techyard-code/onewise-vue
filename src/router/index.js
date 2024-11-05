import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    ...userRoutes,
    {
      path: '/not-found',
      name: 'page-not-found-blank',
      component: () => import('@/components/core/NotFound.vue'),
      meta: {
        authRequired: false,
        layout: 'blank-layout'
      }
    },

    { path: '/:pathMatch(.*)*', redirect: '/not-found' }
  ]
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
