

<template>

<div :style="getStyle('box')">
  <div v-if="!this.gameStarted">
    <form v-on:submit.prevent="backButton"
      :style="getStyle('back')">
      <button> Go Back </button>
    </form>
  </div>
  <br/>
  
  <div :style="getStyle('h1')"> Gaming Trivia </div>
  <div v-if="!this.gameStarted">
    <div> Timer Length:
    <select v-model="timerLength">
      <option value="5"> 5 seconds </option>
      <option default value="10"> 10 seconds </option>
      <option value="15"> 15 seconds </option>
      <option value="20"> 20 seconds </option>
    </select>
    </div>

    <div> Number of Questions:
    <select v-model="numQuestions">
      <option value="3"> 3 questions </option>
      <option default value="5"> 5 questions </option>
      <option value="10"> 10 questions </option>
      <option value="15"> 15 questions </option>
    </select>
    </div>
    <br/>


      <form v-on:submit.prevent="submitPlay">
        <button> Begin Game </button>
      </form>
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
      timerLength: 10,
      numQuestions: 5,
      gameStarted: false,
    }
  },
  methods: {
    submitPlay() {
      this.$socket.emit('submitPlay', [this.timerLength, this.numQuestions]);
      this.gameStarted = true;
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
        case 'h1':
          payload = [
            'margin: 0.25em auto;',
            'padding: 0.125em 0;',
            'font-weight: 100;',
            'font-size: 1.5em;',
            'color: rgb(171, 167, 167);',
          ]
          break;
        case 'form':
          payload = [
            'padding: 0 0 2em;',
          ]
          break;
        case 'begin':
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
