

<template>
<div>
  <link href="https://fonts.googleapis.com/css?family=Comfortaa|Josefin+Sans&display=swap"
    rel="stylesheet">

  <div v-if="typeof(payload.phase) != 'undefined' "
    :style="getStyle('box')">
    <div v-if="payload.phase == 0">
      <div v-if="(payload.judge != username) && (payload.target.required.length>0)">
        <div :style="getStyle('req')">
          {{ payload.target.required[0] }}
        </div>
        <form v-on:submit.prevent="submit"
          :style="getStyle('form')">
          <input v-model="userInput"
            id="target"
            :style="getStyle('input')">
        </form>
      </div>
      <div v-else>
        <div :style="getStyle('req')">
          Waiting for other players...
        </div>
      </div>
    </div>

    <div v-else-if="payload.phase == 1">
      <div v-if="payload.judge == username">
        <div :style="getStyle('text')">
          ~ choose your favorite ~
        </div>
        <div v-for="submission in payload.submissions"
          v-on:click="choose(submission)"
          style="text-align: left;">
          <div :style="getStyle('subcontainer')"
            v-on:mouseenter="hover($event, {backgroundColor: 'rgb(40,40,40)'})"
            v-on:mouseleave="hover($event, {backgroundColor: ''})">
            <div :style="getStyle('user')">
              {{ submission[0] }}
            </div>
            <div :style="getStyle('sub')">
              {{ buildPrompt(submission[1]) }}
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div :style="getStyle('req')">
          you said-
        </div>
        <div :style="getStyle('h1')">
          {{ this.buildPrompt(this.lastSubmission) }}
        </div>
      </div>
    </div>

    <div v-else-if="payload.phase == 2"
      style="text-align: left;">
      <div :style="getStyle('h2')">
        ~ winner ~
      </div>
      <br />
      <div :style="getStyle('subcontainer')">
        <div :style="getStyle('user')">
          {{ payload.winner[0] }}
        </div>
        <div :style="getStyle('sub')">
          {{ buildPrompt(payload.winner[1]) }}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'RendererPlayer',
  data() {
    return {
      payload: {},
      userInput: "",
      userSubmission: [],
      lastSubmission: [],
      username: this.$store.getters.getUsername
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
        this.lastSubmission = this.userSubmission;
        this.userSubmission = [];
      }
    },
    choose(target) {
      this.$parent.submitUserInput(target);
    },
    hover(event, mod) {
      for (var prop in mod) {
        event.target.style[prop] = mod[prop];
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
            'background-color: rgb(20, 21, 20);',
            'overflow-x: hidden;',
            'overflow-y: auto;',
            'padding: 1em;',
          ]
          break;
        case 'req':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'height: auto;',
            'padding: 3em 0 2em;',
            'font-size: 2em;',
            'margin: 0 auto;',
            'color: rgb(191, 191, 191);',
          ]
          break;
        case 'text':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'height: auto;',
            'padding: 1em 0;',
            'font-size: 1.5em;',
            'margin: 0 auto;',
            'color: rgb(191, 191, 191);',
          ]
          break;
        case 'form':
          payload = [
            'padding: 0 0 2em;',
          ]
          break;
        case 'input':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'width: 50%;',
            'height: 2em;',
            'font-size: 1.5em;',
            'margin: 0 auto;',
            '',
          ]
          break;
        case 'h1':
          payload = [
            'width: 80%;',
            'margin: auto;',
            "font-family: 'Josefin Sans', sans-serif;",
            'font-weight: 100;',
            'font-style: italic;',
            'font-size: 1.25em;',
            'color: rgb(171, 167, 167);',
          ]
          break;
        case 'user':
          payload = [
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
        case 'subcontainer':
          payload = [
            'display: inline-block;',
            'transition: background-color 0.25s ease-in-out;',
            'padding: 0.5em;',
          ]
          break;
      }
      return payload.join(' ');
    }
  }
}
</script>
