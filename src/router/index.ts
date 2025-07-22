import { createRouter, createWebHistory } from 'vue-router'

// Base routes that are always available (production routes)
const baseRoutes = [
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
]

// Development-only routes (testing/dev pages)
const devRoutes = [
  {
    path: '/tailwind-test',
    name: 'tailwind-test',
    component: () => import('../pages/tailwind-test.vue'),
    meta: { isDev: true }
  },
  {
    path: '/daisyui-test',
    name: 'daisyui-test',
    component: () => import('../pages/daisyui-test.vue'),
    meta: { isDev: true }
  },
  {
    path: '/dock-iterations',
    name: 'dock-iterations',
    component: () => import('../pages/dock-iterations.vue'),
    meta: { isDev: true }
  },
]

// Conditionally include dev routes only in development mode
const allRoutes = import.meta.env.DEV ? [...baseRoutes, ...devRoutes] : baseRoutes

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
})

export default router