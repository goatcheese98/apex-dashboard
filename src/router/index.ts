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