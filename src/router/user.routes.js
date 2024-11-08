const userRoutes = [
    {
      path: '/',
      name: 'users',
      component: () => import('@/Views/Users/UserTableList.vue'),
      meta: {
        authRequired: false,
        layout: 'main-layout',
        title: 'User table list',
        description: 'User list page',
        keywords: 'login, authentication'
      },
    },
  ]
  
  export default userRoutes