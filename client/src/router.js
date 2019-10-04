import Vue from 'vue'
import Router from 'vue-router'

import LandingScene from './views/Landing.vue'
import AdminScene from './views/Admin.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Landing',
      component: LandingScene,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminScene,
    }
  ]
})