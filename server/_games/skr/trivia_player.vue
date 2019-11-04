<template>
<div class="box">

  <div v-if="(typeof(payload.question) == 'undefined')">
    <h2> Trivia questions loading... </h2>
  </div>

  <div v-if="!payload.gameEnd">
  <div v-if="(typeof(payload.question) != 'undefined')">
    <form id="triviaForm" v-on:submit="submitUserInput">
  
      <h3> {{ payload.question }} </h3>

      <input type ="radio" id="0" v-model="selectedAnswer" value="0">
      <label for="0"> {{ payload.answers[0] }} </label>
      <input type ="radio" id="1" v-model="selectedAnswer" value="1">
      <label for="1"> {{ payload.answers[1] }} </label>
      <input type ="radio" id="2" v-model="selectedAnswer" value="2">
      <label for="2"> {{ payload.answers[2] }} </label>
      <input type ="radio" id="3" v-model="selectedAnswer" value="3">
      <label for="3"> {{ payload.answers[3] }} </label>

      <input type="submit" class="button" value="Submit">
    </form>
  </div>
  </div>

  <div v-if="payload.gameEnd">
    <h3> Game Over! </h3>
    <span v-html="buildScoreScreen()"> </span>
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
      selectedAnswer: "",
    }
  },

  methods: {
    buildScoreScreen() {
      if(!this.payload.gameEnd) {
        return 0;
      }
      var html = "<table><tr><th>Player Name</th><th>Score</th>";

      for(var i=0; i < this.payload.scores.length; i++) {
        html += "<tr><td>";
        html += this.payload.scores[i][0];
        html += "</td><td>";
        html += this.payload.scores[i][1];
        html += "</td></tr>";
      }
      html += "</table>";
      return html;
    },
  
    submitUserInput() {
      console.log("submission" + this.selectedAnswer);
      this.$parent.submitUserInput(this.selectedAnswer);
      this.selectedAnswer = "";
    },
  },
}


  
</script>

<style scoped>
</style>
