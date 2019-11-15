<template>
<div :style="getStyle('box')">

  <h1 :style="getStyle('h1')"> Aquarium </h1>
  <div v-if="!this.gameStarted">
    <button v-on:click="submit" :style="getStyle('form')">
      Click to start the game
    </button>
  </div>
  <div v-else>
    <h1 :style="getStyle('h1')"> Game in progress </h1>
  </div>
</div>
</template>


<script>
export default {
  name: 'RendererAdmin',
  data() {
    return {
      payload: {},
      gameStarted: false,
    }
  },

  methods: {
    submit() {
      this.gameStarted = true;
      this.$socket.emit('submitPlay', "Starting Aquarium");
      this.$socket.emit('apiCall', 'gameLogic');
    },
    getStyle(target) {
      let payload = []
      switch (target) {
        case 'box':
          payload = [
            'width: 100%;',
            'height: 50vh;',
            'margin: 2em auto;',
            'text-align: center;',
            'background-color: rgb(92, 94, 91);',
            'box-shadow: 0 0 5em 0 rgb(30, 30, 30) inset;',
            'overflow-x: hidden;',
            'overflow-y: auto;',
          ]
          break;
        case 'req':
          payload = [
            'width: 75%;',
            'height: auto;',
            'padding: 0.125em 0;',
            'margin: 0.25em auto;',
            'background-color: #fff;',
            'color: #3a3c38;',
            'font-weight: lighter;',
            'font-size: 1.75em;',
          ]
          break;
        case 'h1':
          payload = [
            'margin: 0.25em auto;',
            'padding: 0.125em 0;',
            'font-weight: 100;',
            'font-style: italic;',
            'font-size: 1.25em;',
            'color: rgb(171, 167, 167);',
          ]
          break;
        case 'user':
          payload = [
            'width: 85%;',
            'margin: 0 auto 0;',
            'padding: 0.5em 0 0;',
            "font-family: 'Josefin Sans', sans-serif;",
            'font-size: 1em;',
            'text-align: left;',
            'color: rgb(195, 188, 188);',
          ]
          break;
        case 'sub':
          payload = [
            'width: 80%;',
            'margin: 0 auto 0.5em;',
            "font-family: 'Josefin Sans', sans-serif;",
            'font-weight: 100;',
            'font-style: italic;',
            'font-size: 1.25em;',
            'text-align: left;',
            'color: rgb(171, 167, 167);',
          ]
          break;
      }
      return payload.join(' ');
    }
  }
}
</script>
