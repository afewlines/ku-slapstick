
<template>
<div :style="getStyle('box')">

  <div v-if="!payload.currentWord">
    <h1 :style="getStyle('h1')"> Aquarium loading... </h1>
    <div :style="getStyle('info')">
      Everyone comes up with a definition for a made-up word. Then,
      everyone votes on who came up with the best definition.
      Whoever has the most points wins!.
    </div>
  </div>

  <!-- Playing the game -->
  <div v-if="!payload.gameEnd">
    <div v-if="payload.phase == 1">
      <div v-if="payload.currentWord">
        <h1 :style="getStyle('h1')"> {{ payload.currentWord }} </h1>
        <input v-model="answer" :style="getStyle('input')">
        <button v-on:click="submitUserInput" :style="getStyle('form')">
          Submit
        </button>
      </div>
    </div>

    <div v-if="payload.phase == 2">
      <h1 :style="getStyle('h1')"> Select the best definition </h1>
      <div v-html="buildSelectScreen()"> </div>
    </div>
  </div>

  <!-- Game End Screen -->
  <div v-if="payload.gameEnd">
    <div v-html="buildScoreScreen()"> </div>
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
      answer: "",
    }
  },

  methods: {
    buildSelectScreen() {
      var html = "";
      console.log(this.payload.answers);
      for(var i=0; i < this.payload.answers.length; i++) {
        html += "<div>";
        html += this.payload.answers[i][0];
        html += " | ";
        html += this.payload.answers[i][1];
        html += "</div>";
      }
      return html;
    },
    
    buildScoreScreen() {
      
    },
  
    submitUserInput() {
      this.$parent.submitUserInput(this.answer);
      this.answer = "";
    },
  
    getStyle(target) {
      let payload = []
      switch (target) {
        case 'info':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'height: auto;',
            'padding: 3em 0 2em;',
            'font-size: 1.2em;',
            'margin: 0 auto;',
            'color: rgb(191, 191, 191);',
          ]
          break;
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
        case 'h1':
          payload = [
            'margin: 0.25em auto;',
            'padding: 0.125em 0;',
            'font-weight: 100;',
            'font-style: italic;',
            'font-size: 1.5em;',
            'color: white;',
            'border-bottom: 2px solid black;',
          ]
          break;
          case 'score':
          payload = [
            'align=center;',
          ]
          break;
      }
      return payload.join(' ');
    }

  },
}


  
</script>

