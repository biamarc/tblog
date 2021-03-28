import {AppRoutes} from '../models/path_constants'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') , meta: { requiresAuth: false }},

      { path: AppRoutes.PROFILE.path, component: ()=> import('pages/Profile.vue') , meta: { requiresAuth: true }},
      { path: AppRoutes.MY_TRAVELS.path, component: ()=> import('pages/MyTravels.vue'), meta: { requiresAuth: true } }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
