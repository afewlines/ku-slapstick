<template>
<div class="box">
  <p>trivia game</p>
  <p v-if="x">{{x}}</p>
  <form id="triviaForm" v-on:submit="submitUserInput">
  
  <select v-model="selectedAnswer" required="required">
    <option disabled value=""> Select answer</option>
    <option value="0" label="test">x </option>
    <option value="1">y </option>
    <option value="2">z </option>
    <option value="3">a </option>  
  </select>  
  <input type="submit" class="button" value="Submit">

  </form>

</div>
</template>

<script>
  
export default {
  name: 'RendererPlayer',
  data() {
    return {
      selectedAnswer: '',
    }
  },

  components: {

  },

  sockets: {

  },
  
  methods: {
    submitUserInput() {
      console.log(this.selectedAnswer);
    },
  },
}


  
</script>

<style scoped>
</style>
