import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ( { store }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  // navigation guard
  Router.beforeEach((to, from, next) => {
    // console.log('Enter navigation guard')
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // console.log('Request a protected url')
      const loggedIn = store.getters['auth/isLogged']
      // console.log('User is logged?: ' + loggedIn)
      if (!loggedIn) {
        // console.log('Redirect to home')
        next({ path: '/' })
      } else {
        // console.log('Proceed to protected url')
        next()
      }
    } else {
      // console.log('Normal navigation')
      next()
    }
  })


  return Router
}
