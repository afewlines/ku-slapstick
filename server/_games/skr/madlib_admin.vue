

<template>
<div>
  <link href="https://fonts.googleapis.com/css?family=Bowlby+One+SC|Josefin+Sans&display=swap"
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
      <br />
      <div v-for="submission in payload.submissions">
        <div :style="getStyle('user')">
          {{ submission[0] }}
        </div>
        <div :style="getStyle('sub')">
          {{ buildPrompt(submission[1]) }}
        </div>
      </div>
    </div>

    <div v-else-if="payload.phase == 2">
      <br />
      <div :style="getStyle('h2')">
        Winner
      </div>
      <br />
      <div :style="getStyle('user')">
        {{ payload.winner[0] }}
      </div>
      <div :style="getStyle('sub')">
        {{ buildPrompt(payload.winner[1]) }}
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
    submit() {
      this.userSubmission.push(this.userInput);
      this.userInput = "";
      this.payload.target.required.shift();
      if (this.payload.target.required.length < 1) {
        this.$parent.submitUserInput(this.userSubmission);
        this.payload.phase = 1;
        this.payload.submissions = this.userSubmission;
      }
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
