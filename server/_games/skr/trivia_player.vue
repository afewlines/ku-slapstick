
<template>
<div :style="getStyle('box')">

  <div v-if="!payload.question || !payload.answers">
    <div :style="getStyle('h1')"> Gaming Trivia </div>
    <div :style="getStyle('info')">
      Answer a series of question about video games. Earn 1
      point for each correct question. Whoever has the
      highest score wins!
    </div>
  </div>

  <!-- Playing the game -->
  <div v-if="!payload.gameEnd">
  <div v-if="payload.question && payload.answers">
    <form id="triviaForm" v-on:submit="submitUserInput">
  
      <h1 :style="getStyle('h1')"> {{ payload.question }} </h1>

      <input type ="radio" v-model="selectedAnswer" value="0" :style="getStyle('rad')">
      <label for="0" :style="getStyle('lab')"> {{ payload.answers[0] }} </label>
      <br />
      <input type ="radio" v-model="selectedAnswer" value="1" :style="getStyle('rad')">
      <label for="1" :style="getStyle('lab')"> {{ payload.answers[1] }} </label>
      <br />
      <input type ="radio" v-model="selectedAnswer" value="2" :style="getStyle('rad')">
      <label for="2" :style="getStyle('lab')"> {{ payload.answers[2] }} </label>
      <br />
      <input type ="radio" v-model="selectedAnswer" value="3" :style="getStyle('rad')">
      <label for="3" :style="getStyle('lab')"> {{ payload.answers[3] }} </label>
      <br /><br />
  
      <input type="submit" class="button" value="Submit">

    </form>
  </div>
  </div>

  <!-- Game End Screen -->
  <div v-if="payload.gameEnd">
    <h1 :style="getStyle('h1')"> Game Over </h1>
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
      selectedAnswer: "",
    }
  },

  methods: {
    buildScoreScreen() {
      if(!this.payload.gameEnd) {
        return 0;
      }
      var scoreStyle = this.getStyle('score');
      var html = "<table align='center'><tr><th>Player Name</th><th>Score</th>";

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
  
    getStyle(target) {
      let payload = []
      switch (target) {
        case 'rad':
          payload = [
            'margin:10px;',
          ]
          break;
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
        case 'lab':
          payload = [
            'margin:-2px;',
            'padding: 4px 12px;',
            'display:inline-block;',
            'font-weight: bold;',
            'color: white;',
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

