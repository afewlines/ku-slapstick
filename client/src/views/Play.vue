<template>
<div class="app-wrapper">
  <div class="wrapper">
    <HeaderComponent></HeaderComponent>

    <div class="game"
      v-html="renderData">
    </div>



    <FooterComponent></FooterComponent>
  </div>
</div>
</template>


<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'



export default {
  name: 'Play',
  components: {
    'FooterComponent': Footer,
    'HeaderComponent': Header,
  },
  data() {
    return {
      isConnected: false,
      renderData: ``
    }
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
      this.$socket.emit('getRenderDataPlayer');
    },

    disconnect() {
      this.isConnected = false;
    },

    // Fired when the server sends something on the "messageChannel" channel.
    chat(data) {

    },

    ret(data) {
      console.log(data);
    },

    renderDataPlayer(data) {
      this.renderData = data;
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
