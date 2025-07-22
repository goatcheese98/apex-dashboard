import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../pages/(dashboard).vue'),
    },
    {
      path: '/tailwind-test',
      name: 'tailwind-test',
      component: () => import('../pages/tailwind-test.vue'),
    },
    {
      path: '/daisyui-test',
      name: 'daisyui-test',
      component: () => import('../pages/daisyui-test.vue'),
    },
    {
      path: '/enhanced-components',
      name: 'enhanced-components',
      component: () => import('../pages/enhanced-components.vue'),
    },
    {
      path: '/dock-iterations',
      name: 'dock-iterations',
      component: () => import('../pages/dock-iterations.vue'),
    },
    {
      path: '/tournament/:tournamentId',
      name: '/tournament/[tournamentId]',
      component: () => import('../pages/tournament.[tournamentId].vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/[...path].vue'),
    },
  ],
})

export default router