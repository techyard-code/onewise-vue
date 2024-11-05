const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/Views/auth/Login.vue'),
    meta: {
      authRequired: false,
      layout: 'blank-layout',
      title: 'Login',
      description: 'Login page',
      keywords: 'login, authentication'
    },
    // redirect: '/dashboard' // optional
  }
]

export default authRoutes