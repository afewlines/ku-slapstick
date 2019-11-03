

<template>
<div>
  <div v-if="typeof(payload.phase) != 'undefined' ">
    <div v-if="payload.phase == 0">
      <div v-if="payload.target.required.length>0">
        {{ payload.target.required[0] }}
        <form v-on:submit.prevent="submit">
          <input v-model="userInput"
            id="target">
        </form>
      </div>
    </div>

    <div v-if="payload.phase == 1">
      <p> {{ this.buildPrompt() }} </p>
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
      active: false,
      userInput: "",
      userSubmission: []
    }
  },
  methods: {
    buildPrompt() {
      var prompt = this.payload.target.prompt;
      var input = this.payload.submissions;
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
      }
    }
  }
}
</script>

<style scoped>
</style>
