

<template>
<div :style="getStyle('box')">
  <!-- TODO: fix
  <div v-if="!this.gameStarted">
    <form v-on:submit.prevent="backButton"
      :style="getStyle('back')">
      <button> Go Back </button>
    </form>
  </div>
  <br/>
  -->
  
  <div :style="getStyle('h1')"> Aquarium </div>
  <div v-if="!this.gameStarted">
    <div> Timer Length:
    <select v-model="timerLength">
      <option value="5"> 5 seconds </option>
      <option default value="10"> 10 seconds </option>
      <option value="15"> 15 seconds </option>
      <option value="20"> 20 seconds </option>
    </select>
    </div>

    <div> Number of Words:
    <select v-model="numWords">
      <option value="3"> 3 words </option>
      <option default value="5"> 5 words </option>
      <option value="10"> 10 words </option>
      <option value="15"> 15 words </option>
    </select>
    </div>
    <br/>

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
      timerLength: 10,
      numWords: 5,
    }
  },

  methods: {
    submit() {
      this.gameStarted = true;
      this.$socket.emit('submitPlay', [this.timerLength, this.numWords]);
    },
    backButton() {
      this.$socket.emit('clearCurrentGame');
      location.reload();
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
        case 'back':
          payload = [
            'text-align: left;',
            'float: left;',
          ]
          break;
      }
      return payload.join(' ');
    }
  }
}
</script>
