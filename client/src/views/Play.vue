<template>
<div class="app-wrapper">
  <LeaderboardComponent>
  </LeaderboardComponent>
  <div class="wrapper">
    <HeaderComponent ref="header">
    </HeaderComponent>

    <div v-if="loaded">
      <RendererPlayer id="renderer"> </RendererPlayer> <!-- GAME COMPONENT -->
    </div>
    <div v-else
      class="box">
      <h3> Waiting for Host to Start Game</h3>
    </div>

    <FooterComponent></FooterComponent>
  </div>
</div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import Vue from 'vue'
import request from 'request'

function remoteComponent(url) {
  const name = url.split('/').reverse()[0];

  if (window[name]) return window[name];

  window[name] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.addEventListener('load', () => {
      resolve(window[name]);
    });
    script.addEventListener('error', () => {
      reject(new Error(`Error loading ${url}`));
    });
    script.src = url + '.umd.min.js';
    document.head.appendChild(script);
  });

  return window[name];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var grab = document.querySelector;

export default {
  name: 'Play',
  components: {
    'FooterComponent': Footer,
    'HeaderComponent': Header,
    'LeaderboardComponent': Leaderboard,
    'RendererPlayer': () => remoteComponent(window.App.$store.getters.getRendererPlayer)
  },
  data() {
    return {
      isConnected: false,
      loaded: false,
      updating: false,
      deets: 0
    }
  },
  computed: {

  },
  beforeCreate() {
    if (this.$store.getters.getUsername == "") {
      this.$router.push('/'); // make sure username is set
      location.reload();
      return;
    }
  },
  mounted() {
    this.$refs.header.subtitle = this.$store.getters.getUsername;
  },
  sockets: {
    kick(target) {
      if (target == this.$store.getters.getUsername) {
        location.reload();
      }
    },
    refresh() {
      location.reload();
    },

    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
      //this.$socket.emit('getRendererAdmin');
      this.requestUpdate();
    },

    connected() {
      let username = this.$store.getters.getUsername;
      if (username.length > 0) {
        this.$socket.emit('alive', username)
      } else {
        window.alert('Username Error');
        this.$router.push('/');
        location.reload();
        return;
      }
    },

    disconnect() {
      this.isConnected = false;
    },

    ret(data) {
      console.log(data);
    },

    rendererPlayer(data) {
      // gets/loads the vue framework
      if (data) {
        this.$store.commit('setRendererPlayer', this.$socket.io.uri + data);
        this.loaded = true;
        this.requestUpdate();
      }
    },

    async update(data) {
      if (this.$store.getters.getUsername.length <= 0) {
        this.$router.push('/');
        location.reload();
        return;
      }

      if (!this.loaded) {
        this.$socket.emit('getRendererPlayer');
      }

      if (this.updating || data == null) {
        return;
      }
      this.updating = true;

      var target = document.querySelector('#renderer');
      while (!(target)) {
        await sleep(1000);
        target = document.querySelector('#renderer');
      }

      target.__vue__.payload = data;
      this.updating = false

    },

    reloadPage() {
      console.log("reloading");
      location.reload();
    },
  },
  methods: {
    requestUpdate() {
      this.$socket.emit('getUpdate');
    },
    submitUserInput(data) {
      this.$socket.emit('submitUserInput', {
        username: this.$store.getters.getUsername,
        payload: data
      })
    }
  },
}
</script>

<style scoped>
h3 {
  display: inline-block;
  margin: 3em 0;
  padding: 1em;
  font-weight: 100;
  font-style: italic;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.57);
  animation: 6s ease-in-out infinite pulse;
}

body {
  overflow: hidden;
}

.app-wrapper {
  margin: 0;
  padding: 0;

  position: absolute;
  height: 100%;
  width: 100%;
}

.wrapper {
  width: 100%;
  max-width: 800px;
  height: auto;
  margin: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.box {
  width: 100%;
  margin: 1em 0;
  text-align: center;
  padding: 1%;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 1em 0 white;
  }

  50% {
    box-shadow: 0 0 2.5em -0.5em white;
  }

  100% {
    box-shadow: 0 0 1em 0 white;
  }
}
</style>
