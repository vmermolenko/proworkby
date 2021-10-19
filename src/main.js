import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueExpandableImage from 'vue-expandable-image'
Vue.use(VueExpandableImage)
Vue.config.productionTip = false
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/database';
import VueMask from 'vue-the-mask';
Vue.use(VueMask);

firebase.initializeApp({ 
  apiKey: "AIzaSyAelrGXl1iNOOauiv1RFK8pfhoU7T0cv7o",
  authDomain: "geofeed-f79a8.firebaseapp.com",
  databaseURL: "https://geofeed-f79a8.firebaseio.com",
  projectId: "geofeed-f79a8",
  storageBucket: "geofeed-f79a8.appspot.com",
  messagingSenderId: "942078194442",
  appId: "1:942078194442:web:79b85ba6b638f6bf"
 });

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app){
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})

export default firebase


