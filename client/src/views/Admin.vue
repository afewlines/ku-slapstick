<template>
<div class="app-wrapper">
  <div class="wrapper">
    <HeaderComponent>
    </HeaderComponent>

    <div class="box"
      id="landing">
      <p><b>Game Admin Options</b></p>
    </div>

    <div class="box"
      id="entrance">
      <form id="adminForm"
        v-on:submit="submitAdmin">

        <!-- Game Selection -->
        <div> Game Selection:
          <select v-model="game"
            required="required">

            <option disabled
              value=""> Select a game to play</option>
            <option>Gaming Trivia</option>
            <option>Other games...</option>
          </select>
        </div>
        <br><br>

        <!-- Timer Selection -->
        <div> Timer Selection:
          <select v-model="timer"
            required="required">

            <option disabled
              value="">Select the length of each question</option>
            <option>5 seconds</option>
            <option>10 seconds</option>
            <option>15 seconds</option>
            <option>20 seconds</option>
          </select>
        </div>

        <input type="submit"
          class="button"
          id="submitAdmin"
          value="Submit">
      </form>

      <!-- Ready to begin playing -->
      <div v-if="messageReceived">{{socketMessage}}
        <div v-if="!beginGame">
          Click Play to begin game:
          <form id="playForm"
            v-on:submit="submitPlay">
            <input type="submit"
              class="button"
              id="submitPlay"
              value="Play">
          </form>
        </div>
        <div v-if="beginGame">
          <h2>Game Successfully Started</h2>
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

export default {
  name: 'AdminScene',
  components: {
    'FooterComponent': Footer,
    'HeaderComponent': Header,
  },
  data() {
    return {
      game: '',
      timer: '',
      messageReceived: false,
      socketMessage: '',
      beginGame: false
    }
  },
  sockets: {
    messageChannel(data) {
      this.socketMessage = data;
      this.messageReceived = true;
    },
    beginGame(data) {
      this.beginGame = data;
    }
  },
  methods: {
    submitAdmin() {
      this.$socket.emit('submitAdmin', this.game, this.timer);
    },
    submitPlay() {
      this.$socket.emit('submitPlay', "BEGIN GAME");
      this.$socket.emit('apiCall', 'init');
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
  max-width: 550px;
  height: 500px;
  margin: calc(50vh - 250px) auto auto auto;
}

.box {
  width: 100%;
  margin: 1em 0;
  text-align: center;
  padding: 1%;
  color: #bfbfbf;
}

.button {
  display: block;
  width: 5.125em;
  height: 2em;
  margin: 25px auto 10px;
  padding: 1px 0;
  border: none;
  background-color: #fff;
  color: #3a3c38;
  text-align: center;
  font-weight: lighter;
  font-size: 1.125em;
  transition: width 0.5s ease-in-out, background-color 0.5s ease-in-out, color 0.5s ease-in-out;
}

.button:hover {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
  width: 4.625em;
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
