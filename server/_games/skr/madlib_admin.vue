

<template>
<div>
  <link href="https://fonts.googleapis.com/css?family=Comfortaa|Josefin+Sans&display=swap"
    rel="stylesheet">

  <div v-if="typeof(payload.phase) != 'undefined'"
    :style="getStyle('box')">

    <div v-if="payload.phase == 0">
      <br />
      <div :style="getStyle('h1')">
        ~ what you'll need ~
      </div>
      <br />
      <div v-for="req in payload.target.required"
        :style="getStyle('req')">
        {{ req }}
      </div>
    </div>

    <div v-else-if="payload.phase == 1">
      <div :style="getStyle('h1')">
        ~ what y'all said ~
      </div>
      <div v-for="submission in payload.submissions">
        <div :style="getStyle('sub')">
          {{ buildPrompt(submission[1]) }}
        </div>
      </div>
    </div>

    <div v-else-if="payload.phase == 2">
      <div :style="getStyle('h1')">
        ~ winner ~
        <div :style="getStyle('btn1')"
          v-on:click="command('reset')">
          next
        </div>
        <div :style="getStyle('btn2')"
          v-on:click="endGame()">
          quit
        </div>
      </div>
      <div :style="getStyle('user')">
        {{ payload.winner[0] }}
      </div>
      <div :style="getStyle('sub')">
        {{ buildPrompt(payload.winner[1]) }}
      </div>
      <br />
      <div :style="getStyle('h1')">
        - the rest -
      </div>
      <div v-for="submission in payload.submissions">
        <div :style="getStyle('user')">
          {{ submission[0] }}
        </div>
        <div :style="getStyle('sub')">
          {{ buildPrompt(submission[1]) }}
        </div>
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
      payload: {}
    }
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
        case 'h2':
          payload = [
            'padding: 0.5em;',
            "font-family: 'Comfortaa', cursive;",
            'font-weight: 100;',
            'font-size: 2em;',
            'text-align: center;',
            'color: rgb(235, 235, 235);',
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
            'font-size: 0.75em;',
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
            'font-size: 0.75em;',
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
