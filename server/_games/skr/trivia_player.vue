
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
      <h1 :style="getStyle('h1')"> {{ payload.question }} </h1>

      <div v-if="!payload.submitted">
        <div v-for="(question, index) in payload.answers" :key="index"
          v-on:click="submitUserInput(index, question)">
          <div :style="getStyle('h2')"> {{ question }} </div>
        </div>
      </div>

      <div v-else :style="getStyle('h2')">
        Your answer: {{ this.answer }}
      </div>        

    </div>
  </div>

  <!-- Game End Screen -->
  <div v-if="payload.gameEnd" :style="getStyle('h2')">
    <div :style="getStyle('h1')"> Game Over </div>
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
      answer: null,
    }
  },

  methods: {
    buildScoreScreen() {
      if(!this.payload.gameEnd)
        return 0;

      var html = "<table align='center' cellspacing='10'>\
                  <tr><th>Player Name</th><th>Score</th>";
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
  
    submitUserInput(index, answer) {
      console.log("submission" + index);
      this.$parent.submitUserInput(index);
      this.payload.submitted = true;
      this.answer = answer;
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
        case 'h2':
          payload = [
            'width: 100%;',
            'margin: 0.25em auto;',
            'padding: 0.125em 0;',
            'font-weight: 100;',
            'font-size: 1.3em;',
            'color: white;',
          ]
          break;

      }
      return payload.join(' ');
    }

  },
}


  
</script>

