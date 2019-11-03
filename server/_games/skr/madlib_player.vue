

<template>
<div>
  <div v-if="(typeof(payload.phase) != 'undefined' )&& payload.phase>-1">
    <p> {{ this.buildPrompt() }} </p>
    <form v-on:submit.prevent="submitUserInput">
      <input v-model="submission"
        id="target">
    </form>
  </div>
</div>
</template>

<script>
export default {
  name: 'RendererPlayer',
  data() {
    return {
      payload: {},
      active: false
    }
  },
  methods: {
    buildPrompt() {
      var prompt = this.payload.target.prompt;
      var input = this.payload.userInput;
      console.log(prompt, input);
      if (prompt && input) {
        for (var i = 0; i < input.length; i++) {
          while (prompt.includes('{' + (i + 1) + '}')) {
            prompt = prompt.replace('{' + (i + 1) + '}', input[i]);
          }
        }
        return prompt;
      }
      return 'Error';
    }
  }
}
</script>

<style scoped>
</style>
