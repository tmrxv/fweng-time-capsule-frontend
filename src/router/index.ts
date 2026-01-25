import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import CapsuleDetailsView from '@/pages/CapsuleDetailsView.vue'
import ExploreView from '@/pages/ExploreView.vue'

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
      meta: { guestOnly: true },
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../pages/SignUpView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/capsules',
      name: 'capsules',
      component: () => import('../pages/CapsulesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/capsules/:id',
      name: 'capsule-details',
      component: CapsuleDetailsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/capsules/create',
      name: 'create-capsule',
      component: () => import('../pages/CreateCapsuleView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/capsules/:id/edit',
      name: 'edit-capsule',
      component: () => import('../pages/EditCapsuleView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/explore',
      name: 'explore',
      component: ExploreView,
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
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../pages/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../pages/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Logged-in users must NOT access sign-in or sign-up pages
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' }
  }

  // Guests must NOT access protected routes
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'sign-in' }
  }

  // Only admins may access admin routes
  if (to.meta.requiresAdmin && auth.role !== 'ADMIN') {
    return { name: 'home' }
  }

  return true
})

export default router
