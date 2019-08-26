import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router.js'
import VueSocketIO from 'vue-socket.io';

Vue.use(Vuex)
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:4578',
  query: {
    token: window.localStorage.getItem('auth')
  }
}));

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    socket: {} // maybe
  },
  mutations: {
    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    }
  },
  getters: {
    getSock: state => {
      return state.socket;
    }
  }
})

window.App = new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')