import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'

Vue.use(VueRouter)

const routes = [
  /*
  {
    path: '/',
    name: 'Dashboard',
    meta: {layout : 'main', auth: true, is_admin : true},
    component: () => import( '../views/Dashboard.vue')
  },
  */
  {
    path: '/',
    name: 'LoginIndex',
    meta: {layout : 'empty', auth: false, is_admin : false},
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {layout : 'main', auth: true, is_admin : true},
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  },
  {
    path: '/order',
    name: 'Order',
    meta: {layout : 'main', auth: true, is_admin : true},
    component: () => import(/* webpackChunkName: "order" */ '../views/Order.vue')
  }
  ,
  {
    path: '/worker',
    name: 'Worker',
    meta: {layout : 'main', auth: true, is_admin : true},
    component: () => import(/* webpackChunkName: "worker" */ '../views/Worker.vue')
  },
  {
    path: '/client',
    name: 'Client',
    meta: {layout : 'main', auth: true, is_admin : true},
    component: () => import(/* webpackChunkName: "client" */ '../views/Client.vue')
  },
  {
    path: '/calculation',
    name: 'Calculation',
    meta: {layout : 'main', auth: true, is_admin : true},
    component: () => import(/* webpackChunkName: "calculation" */ '../views/Calculation.vue')
  },
  {
    path: '/payment',
    name: 'Payment',
    meta: {layout : 'main', auth: true, is_admin : true},
    component: () => import(/* webpackChunkName: "payment" */ '../views/Payment.vue')
  },
  {
    path: '/payoff',
    name: 'Payoff',
    meta: {layout : 'main', auth: true, is_admin : true},
    component: () => import(/* webpackChunkName: "payoff" */ '../views/Payoff.vue')
  },
  {
    path: '/register',
    name: 'Register',
    meta: {layout : 'empty', auth: false, is_admin : false},
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {layout : 'empty', auth: false, is_admin : false},
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  }
  ,
  {
    path: '/home',
    name: 'Home',
    meta: {layout : 'main', auth: true, is_admin : true},
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  }
  ,
  {
    path: '/workerdashboard',
    name: 'WorkerDashboard',
    meta: {layout : 'main', auth: true, is_admin : false},
    component: () => import(/* webpackChunkName: "workerdashboard" */ '../views/WorkerDashboard.vue')
  }
  ,
  {
    path: '/workerorderall',
    name: 'WorkerOrderAll',
    meta: {layout : 'main', auth: true, is_admin : false},
    component: () => import(/* webpackChunkName: "workerorderall" */ '../views/WorkerOrderAll.vue')
  },
  {
    path: '/workerorderdoing',
    name: 'WorkerOrderDoing',
    meta: {layout : 'main', auth: true, is_admin : false},
    component: () => import(/* webpackChunkName: "workerorderdoing" */ '../views/WorkerOrderDoing.vue')
  },
  {
    path: '/workerorderhistory',
    name: 'WorkerOrderHistory',
    meta: {layout : 'main', auth: true, is_admin : false},
    component: () => import(/* webpackChunkName: "workerorderhistory" */ '../views/WorkerOrderHistory.vue')
  },
  {
    path: '/registration',
    name: 'Registration',
    meta: {layout : 'empty', auth: false, is_admin : false},
    component: () => import(/* webpackChunkName: "registration" */ '../views/Registration.vue')
  },
  {
    path: '/default',
    name: 'Default',
    meta: {layout : 'empty', auth: false, is_admin : false},
    component: () => import(/* webpackChunkName: "default" */ '../views/Default.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {layout : 'empty', auth: true, is_admin : false},
    component: () => import(/* webpackChunkName: "default" */ '../views/Profile.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requireAuth = to.matched.some(record => record.meta.auth)
  
  /*
  let meta_is_admin = to.matched.some(record=>record.meta.is_admin);
 
  
  var local_admin = false;
  var email = localStorage.email
  if (email === 'isupergeneral@gmail.com'){
    local_admin = false;
  }
  */
  /*
    if (currentUser != null) {
      if (currentUser.email === 'isupergeneral@gmail.com'){
        to.matched.some(record => record.meta.is_admin = false)
      } else {
        to.matched.some(record => record.meta.is_admin = false)
      }
    }
  */

  if (requireAuth && !currentUser)  {
    next('/login')
  } else {
    next()
  }
})


export default router
