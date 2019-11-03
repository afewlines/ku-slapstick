<template>
<div class="app-wrapper">
  <div class="wrapper">
    <HeaderComponent></HeaderComponent>
    <div v-if="!loaded">
      <p> No Game Loaded </p>
    </div>

    <div v-if="loaded">
      <RendererPlayer> </RendererPlayer>
    </div>
    <FooterComponent></FooterComponent>
  </div>
</div>
</template>


<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Vue from 'vue'
import request from 'request'

function remoteComponent(url) {
  const name = url.split('/').reverse()[0].match(/^(.*?)\.umd/)[1];

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
    script.src = url;
    document.head.appendChild(script);
  });

  return window[name];
}

export default {
  name: 'Play',
  components: {
    'FooterComponent': Footer,
    'HeaderComponent': Header,
    'RendererPlayer': () => remoteComponent(window.App.$store.getters.getRenderData)
  },
  data() {
    return {
      isConnected: false,
      loaded: false,
    }
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
      this.$socket.emit('getRendererPlayer');
    },

    disconnect() {
      this.isConnected = false;
    },

    ret(data) {
      console.log(data);
    },

    rendererPlayer(data) {
      // gets/loads the vue framework
      console.log(this.$socket.io.uri + data);
      this.$store.commit('setRenderData', this.$socket.io.uri + data);
      this.loaded = true;
    }
  },
  methods: {
    api(target) {
      this.$socket.emit('apiCall', target);
    }
  },
}
</script>

<style scoped>
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
  height: 90vh;
  min-height: 600px;
  max-height: 1080px;
  margin: 5vh auto auto auto;
}

.box {
  width: 100%;
  margin: 1em 0;
  text-align: center;
  padding: 1%;
}
</style>
