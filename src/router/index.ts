import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../pages/AboutView.vue'),
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../pages/SignInView.vue'),
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../pages/SignUpView.vue'),
    },
        {
      path: '/capsules',
      name: 'capsules',
      component: () => import('../pages/CapsulesView.vue'),
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../pages/CapsulesView.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../pages/HelpView.vue'),
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: () => import('../pages/ImprintView.vue'),
    }
  ],
})

export default router
