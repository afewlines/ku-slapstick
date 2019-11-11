

<template>
<div :style="getStyle('box')">

  <h1 :style="getStyle('h1')"> Gaming Trivia </h1>

  <form v-on:submit="submitPlay">
    <!-- TODO: options for question num and length -->
    <input type="submit" class="button" value="Begin Game">
  </form>
  
</div>
</template>

<script>
export default {
  name: 'RendererAdmin',
  data() {
    return {
      payload: {}
    }
  },
  methods: {
    submitPlay() {
      this.$socket.emit('submitPlay', "Starting trivia game");
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
        case 'h1':
          payload = [
            'margin: 0.25em auto;',
            'padding: 0.125em 0;',
            'font-weight: 100;',
            'font-size: 1.5em;',
            'color: rgb(171, 167, 167);',
          ]
          break;
      }
      return payload.join(' ');
    }

  }
}
</script>
