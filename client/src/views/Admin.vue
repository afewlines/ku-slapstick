<template>
<div class="app-wrapper">
  <LeaderboardComponent>
  </LeaderboardComponent>
  <div class="wrapper">
    <HeaderComponent ref="header">
    </HeaderComponent>

    <div v-if="loaded">
      <RendererAdmin id="renderer"> </RendererAdmin> <!-- GAME COMPONENT -->
    </div>
    <div v-else
      class="box">
      <h3> Choose your game... </h3>
      <div v-for="(game, index) in games"
        class="gameSelector"
        v-on:click="setGame(index)">
        <div class="gameName">
          {{ game.name }}
        </div>
      </div>
    </div>

    <FooterComponent></FooterComponent>
  </div>
</div>
</template>


<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Leaderboard from '@/components/Leaderboard.vue'

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

export default {
  name: 'AdminScene',
  components: {
    'FooterComponent': Footer,
    'HeaderComponent': Header,
    'LeaderboardComponent': Leaderboard,
    'RendererAdmin': () => remoteComponent(window.App.$store.getters.getRendererAdmin)
  },
  data() {
    return {
      game: '',
      timer: '',
      messageReceived: false,
      socketMessage: '',
      games: [],
      beginGame: false,
      loaded: false,
      updating: false
    }
  },
  beforeMount() {
    this.refreshAdmin();
  },
  sockets: {
    messageChannel(data) {
      this.socketMessage = data;
      this.messageReceived = true;
    },
    beginGame(data) {
      this.beginGame = data;
    },
    rendererAdmin(data) {
      // gets/loads the vue framework
      if (data) {
        this.$store.commit('setRendererAdmin', this.$socket.io.uri + data.url);
        this.loaded = true;
        this.requestUpdate();
        this.$refs.header.subtitle = data.name;
      }
    },
    async update(data) {
      if (!this.loaded) {
        this.$socket.emit('getRendererAdmin');
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
    getGames(data) {
      this.games = data;
    }
  },
  methods: {
    refreshAdmin() {
      this.$socket.emit('getGames');
      this.$socket.emit('getRendererAdmin');
    },
    setGame(payload) {
      this.$socket.emit('setGame', payload);
      this.$socket.emit('sendUpdate');
      this.$socket.emit('getRendererAdmin');
      this.$socket.emit('getAlive');
    },
    requestUpdate() {
      this.$socket.emit('getUpdate');
    },
    //submitPlay() {
    //  this.$socket.emit('submitPlay', "BEGIN GAME");
    //  this.$socket.emit('apiCall', 'init');
    //}
  },
}
</script>

<style scoped>
h3 {
  font-weight: 100;
  font-style: italic;
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

.gameSelector {
  display: block;
  width: 80%;
  height: 2em;
  margin: auto;
  border: none;
  background-color: #fff;
  color: #3a3c38;
  text-align: center;
  font-weight: lighter;
  font-size: 1em;
  transition: width 0.5s ease-in-out, background-color 0.5s ease-in-out, color 0.5s ease-in-out;
}

.gameName {
  position: relative;
  height: 1em;
  top: calc(50% - 0.5em);
}

.gameSelector:hover {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
}

#username {
  width: 20em;
  height: auto;
  margin: auto;
  padding: 1.25% 2.5%;
  outline: none;
  border: none;
  background-color: #fff;
  color: #3a3c38;
  font-size: 1.125em;
  transition: background-color 1s ease-in-out, color 1s ease-in-out;
}

#username:focus {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
}
</style>
