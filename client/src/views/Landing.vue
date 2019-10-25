<template>
<div class="app-wrapper">
  <div class="wrapper">
    <HeaderComponent>
    </HeaderComponent>

    <div class="box"
      id="landing">
      <p>
        How are we today? Good?
        <br>
        Wonderful.
        <br>
        <br>
        Enter a username and enjoy.
      </p>
      <p v-if="isConnected">We're connected to the server!</p>
      <p v-if="messageReceived">Message from server: "{{socketMessage}}"</p>
    </div>
    <div class="box"
      id="entrance">
      <form id="usernameForm"
        v-on:submit="submitUsername">
        <input v-model="username"
          id="username"
          placeholder="username"
          maxlength="32"
          align="middle"
          required="required">
        <br>
        <input type="submit"
          class="button"
          id="submitUsername"
          value="Submit">
      </form>
    </div>

    <FooterComponent></FooterComponent>
  </div>
</div>
</template>


<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'LandingScene',
  components: {
    'FooterComponent': Footer,
    'HeaderComponent': Header,
  },
  data() {
    return {
      username: '',
      isConnected: false,
      socketMessage: '',
      messageReceived: false
    }
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data;
      this.messageReceived = true;
    }
  },
  methods: {
    submitUsername(payload = null) {
      // if fired from event, stop submit event
      if (payload != null) {
        payload.preventDefault();
      }

      // no input fail
      if (this.username.length < 1) {
        return;
      }
      var lettersLower = "abcdefghijklmnopqrstuvwxyz";
      var lettersUpper = lettersLower.toUpperCase();
      var numerals = "0123456789";
      var punctuation = " .,!?'#$%&()*+-/:=@^_|~";
      var complete = lettersLower + lettersUpper + numerals + punctuation

      var nameArray = this.username.split("");
      var offenders = [];

      for (var i = 0; i < nameArray.length; i++) {
        if (!complete.includes(nameArray[i])) {
          if (!offenders.includes(nameArray[i])) {
            offenders.push(nameArray[i]);
          }
        }
      }

      if (offenders.length > 0) {
        window.alert("Username contains ILLEGAL characters!!\nHere they are: " + offenders.join(""));
        this.username = "";
        return;
      }

      console.log("username \"" + this.username + "\" checks out!");
      //socket.emit('user connect', this.username);
      this.$store.commit('setUsername', this.username);
      this.$socket.emit('addPlayer', this.$store.getters.getUsername);
      this.$router.push('/play');
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
