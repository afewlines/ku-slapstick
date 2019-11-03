

<template>
<div>
  <div v-if="typeof(payload.phase) != 'undefined' ">
    <div v-if="payload.phase == 1">
      <div v-for="req in payload.target.required"
        style="color: red;">
        {{ req }}
      </div>
    </div>

    <div v-if="payload.phase == 2">
      <p> {{ this.buildPrompt() }} </p>
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
        this.payload.phase = 1;
        this.payload.submissions = this.userSubmission;
      }
    }
  }
}
</script>
