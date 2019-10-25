<template>
<div class="app-wrapper">
  <div class="wrapper">
    <HeaderComponent></HeaderComponent>

    <div class="chat">
      <div class="message"
        v-for="message in messages"
        v-bind:key="message.id">
        <div class="m-user">
          {{ message.username }}
        </div>
        <div class="m-message">
          {{ message.message }}
        </div>
      </div>
    </div>

    <div class="userChat">
      <form id="chatForm"
        v-on:submit="submitChat">
        <input id="chatInput"
          v-model="userMessage"
          placeholder="Say something!"
          maxlength=128
          align="left"
          required="required">
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
  name: 'ChatScene',
  components: {
    'FooterComponent': Footer,
    'HeaderComponent': Header,
  },
  data() {
    return {
      isConnected: false,
      userMessage: '',
      messages: [],
      messageCount: 0
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
    chat(data) {
      this.messages.push({
        'id': this.messageCount++,
        'username': data[0],
        'message': data[1]
      });
      this.socketMessage = data;
      this.messageReceived = true;
    }
  },
  methods: {
    submitChat() {
      console.log("chat", this.userMessage);
      this.$socket.emit('submitChat', this.$store.getters.getUsername, this.userMessage);
      this.userMessage = '';
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

#chatForm {
  width: 100%;
  height: 100%;
}

#chatInput {
  position: relative;
  width: 20em;
  height: auto;
  left: calc(50% - 10em);
  margin: 0.5em 0;
  padding: 1.25% 1.1%;
  outline: none;
  border: none;
  color: #000;
  font-size: 1.125em;
}

.chat {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  height: 50vh;
  padding: 1.25vh 0;
  width: 90%;
  margin: 1.25vh auto 0;
  font-size: 2em;
  background-color: rgb(39, 41, 38);
}

.message {
  position: relative;
  height: auto;
  font-size: 0.8em;
  width: 100%;
  margin: 0 auto;
  transition: transform ease-in-out 0.25s, opacity ease-in 0.2s;
}

.m-message {
  position: relative;
  width: calc(100% - 6em);
  left: 6em;
  text-align: left;
  line-height: 1;
  color: #A66F6F;
  font-weight: 100;
}

.m-user {
  overflow: hidden;
  position: absolute;
  width: 20em;
  left: -14.5em;
  text-align: right;
  color: #824B4B;
  font-style: italic;
  padding: 0 0.125em;
}
</style>
