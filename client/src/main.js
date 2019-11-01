import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router.js'
import VueSocketIO from 'vue-socket.io';

function getip() {
  var a = window.document.domain;
  console.log(a);
  return a;
}

Vue.use(Vuex);
Vue.use(new VueSocketIO({
  debug: true,
  connection: "http://" + getip() + ":4578"
}));

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    socket: {}, // maybe
    username: "",
    renderData: "",
  },
  mutations: {
    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },
    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    },
    setUsername(state, payload) {
      state.username = payload;
    },
    setRenderData(state, payload) {
      state.renderData = payload;
    }
  },
  getters: {
    getSock: state => {
      return state.socket;
    },
    getUsername: state => {
      return state.username;
    },
    getRenderData: state => {
      return state.renderData;
    }
  }
})

window.App = new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')