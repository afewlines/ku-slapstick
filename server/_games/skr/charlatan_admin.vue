

<template>
<div>
  <!-- link to fonts -->
  <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1"
    rel="stylesheet"
    type="text/css">

  <div v-if="typeof(payload.phase) != 'undefined'"
    :style="getStyle('box')">

    <div v-if="payload.phase < 2"
      :style="getStyle('btn1')"
      v-on:click="command('advance')">
      next
    </div>
    <div v-else
      :style="getStyle('btn1')"
      v-on:click="command('reset')">
      replay
    </div>
    <div :style="getStyle('btn2')"
      v-on:click="endGame()">
      quit
    </div>

    <div v-if="payload.phase == -1"
      :style="getStyle('fullsize')">
      <div :style="getStyle('centerVert')">
        <div :style="getStyle('introText')">
          how many submissions should each player submit?
        </div>

        <form v-on:submit.prevent="introSubmit"
          :style="getStyle('introForm')">
          <input v-model="introInput"
            id="introInput"
            size="3"
            pattern="\d{1,2}"
            title="We're looking from a number between 1 and 99."
            :style="getStyle('introInput')">
        </form>
      </div>
    </div>

    <div v-if="payload.phase == 0"
      :style="getStyle('fullsize')">

      <div :style="getStyle('centerVert')">
        <div :style="getStyle('p0Header')">
          submission progress:
        </div>
        <div :style="getStyle('p0Progress')">
          <div ref="p0Bar"
            :style="getStyle('p0Bar') + `width: ${this.submitted}%;`">
          </div>
        </div>
      </div>

    </div>

    <div v-else-if="payload.phase == 1"
      :style="getStyle('fullsize')">

      <div :style="getStyle('centerVert')">
        <div :style="getStyle('p0Header')">
          spot those lies!
        </div>

        <div :style="getStyle('p0Progress')">
          <div ref="p0Bar"
            :style="getStyle('p0Bar') + `width: ${this.scored}%;`">
          </div>
        </div>
      </div>

    </div>

    <div v-else-if="payload.phase == 2"
      :style="getStyle('fullsize')">
      <div :style="getStyle('p0Header')">
        ~ scores ~
      </div>
      <div v-for="scr in payload.scores"
        :style="getStyle('result')">
        {{ scr.username }}: {{ scr.payload }}
      </div>

    </div>

  </div>
</div>
</template>

<script>
export default {
  name: 'RendererAdmin',
  data() {
    return {
      introInput: '',
      payload: {}
    }
  },
  computed: {
    submitted: function() {
      let count = 0;
      for (var k in this.payload.players) {
        if (this.payload.players.hasOwnProperty(k)) {
          ++count;
        }
      }
      return (this.payload.submissions.length / (count * this.payload.quantity)) * 100;
    },
    scored: function() {
      let count = 0;
      for (var k in this.payload.players) {
        if (this.payload.players.hasOwnProperty(k)) {
          ++count;
        }
      }

      return (this.payload.scores.length / count) * 100;
    },

  },
  methods: {
    buildPrompt(input) {
      var prompt = this.payload.target.prompt;
      if (prompt && input) {
        for (var i = 0; i < input.length; i++) {
          while (prompt.includes('{' + (i + 1) + '}')) {
            prompt = prompt.replace('{' + (i + 1) + '}', input[i]);
          }
        }
        return prompt;
      }
      return 'Error';
    },
    command(target) {
      this.$parent.submitUserInput(target);
    },
    introSubmit() {
      this.$parent.submitUserInput(`start ${this.introInput}`);
    },
    endGame() {
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
            'background-color: rgb(20, 21, 20);',
            'overflow-x: hidden;',
            'overflow-y: auto;',
            'padding: 1em;',
          ]
          break;
        case 'fullsize':
          payload = [
            'width: 100%;',
            'height: 100%;',
          ]
          break;
        case 'introText':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'padding: 1em;',
            'font-size: 1.5em;',
            'color: #fff;',
          ]
          break;
        case 'introForm':
          payload = [
            'margin: 0.25em auto;',
            'padding: 0.125em 0;',
            'font-weight: 100;',
            'font-style: italic;'
          ]
          break;
        case 'introInput':
          payload = [
            'width: auto;',
            'margin: 0 auto 0;',
            'padding: 0.125em 0 0;',
            "font-family: 'Josefin Sans', sans-serif;",
            'font-size: 2em;',
            'text-align: center;',
            'color: #3a3c38;',
          ]
          break;
        case 'p0Header':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'padding: 1em;',
            'font-size: 1.5em;',
            'color: #fff;',
          ]
          break;
        case 'centerVert':
          payload = [
            "position: relative;",
            "top: 50%;",
            "transform: translateY(-50%);",
          ]
          break;
        case 'p0Progress':
          payload = [
            'width: 80%;',
            'height: 2.5em;',
            'margin: 1em auto;',
            'background-color: #3a3c38;',
          ]
          break;
        case 'p0Bar':
          payload = [
            'padding: 0.25em;',
            'height: 100%;',
            'background-color: #c69999;',
            'transition: width 0.5s ease-in-out;',
          ]
          break;
        case 'playerDotPre':
          payload = [
            'display: inline-block;',
            'height: 1em;',
            'width: 1em;',
            'margin: 0.5em;',
            'background-color: #bfbfbf;',
          ]
          break;
        case 'playerDot':
          payload = [
            'display: inline-block;',
            'height: 1em;',
            'width: 1em;',
            'margin: 0.5em;',
            'background-color: #c69999;',
          ]
          break;
        case 'result':
          payload = [
            'padding: 0.125em;',
            'width: auto;',
            'height: auto;',
            'margin: auto;',
            'font-weight: 100;',
            'font-size: 1.5em;',
            'text-align: center;',
            'color: #fff;',
          ]
          break;
        case 'btn1':
          payload = [
            'position: absolute;',
            'padding: 0.5em;',
            'margin: 0.25em;',
            'top: 25%;',
            'right: 3vw;',
            "font-family: 'Josefin Sans', sans-serif;",
            'font-weight: 100;',
            'font-size: 1em;',
            'text-align: center;',
            'color: rgb(20,21,20);',
            'background-color: rgba(255,255,255,128);',
          ]
          break;
        case 'btn2':
          payload = [
            'position: absolute;',
            'padding: 0.5em;',
            'margin: 0.25em;',
            'top: 25%;',
            'left: 3vw;',
            "font-family: 'Josefin Sans', sans-serif;",
            'font-weight: 100;',
            'font-size: 1em;',
            'text-align: center;',
            'color: rgb(20,21,20);',
            'background-color: rgba(255,255,255,128);',
          ]
          break;
      }
      return payload.join(' ');
    }
  }
}
</script>
