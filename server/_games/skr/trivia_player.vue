<template>
<div class="box">
  <div v-if="!currentQuestion">
    <h2> Trivia questions loading... </h2>
  </div>

  <div v-if="currentQuestion">
    <form id="triviaForm" v-on:submit="submitUserInput">
  
      <h3> {{ currentQuestion }} </h3>

      <input type ="radio" id="1" v-model="selectedAnswer">
        <label for="1"> {{ currentAnswers[1] }} </label>
      <input type ="radio" id="2" v-model="selectedAnswer">
        <label for="2"> {{ currentAnswers[2] }} </label>
      <input type ="radio" id="3" v-model="selectedAnswer">
        <label for="3"> {{ currentAnswers[3] }} </label>
      <input type ="radio" id="4" v-model="selectedAnswer">
        <label for="4"> {{ currentAnswers[4] }} </label>

      <input type="submit" class="button" value="Submit">
    </form>
  </div>
    
</div>
</template>

<script>
  
export default {
  name: 'RendererPlayer',
  data() {
    return {
      selectedAnswer: '',
      currentQuestion: '',
      currentAnswers: '',
    }
  },

  sockets: {
    getCurrentQuestion(data) {
      this.currentQuestion = data;
    },
    getCurrentAnswers(data) {
      this.currentAnswers = data;
    },   
  },
  
  methods: {
    submitUserInput() {
      //todo: submit selectedAnswer (along with username??)
    },
  },
}


  
</script>

<style scoped>
</style>
