
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
      {{ phaseOne() }}
      <div v-if="payload.currentWord">
        <h1 :style="getStyle('h1')"> {{ payload.currentWord }} </h1>

        <div v-if="this.submitted == null"> <!-- not yet submitted -->
          <form v-on:submit.prevent="submitUserInput" 
            :style="getStyle('input')">
          <input v-model="answer" :style="getStyle('input')">
          </form>
        </div>

        <div v-else :style="getStyle('h2')"> <!-- submitted -->
            Your definition: {{ this.submitted }} <br/>
            Waiting on other players...
        </div>
      </div>
    </div> <!-- end phase 1 -->

    <!-- Voting on best answer -->
    <div v-if="payload.phase == 2">
      <div v-if="this.selected == null">
        <div :style="getStyle('h1')"> 
          Select the best definition for {{ payload.currentWord }}
        </div>

        <div v-for="(ans, index) in payload.answers" :key="index"
          v-on:click="submitSelectedAnswer(ans)">
          <div :style="getStyle('h2')"> {{ ans }} </div>
        </div>
      </div>

      <div v-else>
        <div :style="getStyle('h1')"> 
          You selected {{ this.selected }} <br/>
          Waiting on other players...
        </div>
      </div>
    </div> <!-- end phase 2 -->
  
  </div>

  <!-- Game End Screen -->
  <div v-if="payload.gameEnd == true">
    <div :style="getStyle('h1')"> Game Over! </div>
    <div v-html="buildScoreScreen(payload.scores)"> </div>
    {{ gameEnd() }} <!-- tell admin game is over -->
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
      selected: null,
      submitted: null,
    }
  },

  methods: {
    buildScoreScreen(target) {
      var style = this.getStyle('h2');
      var html = "";
      for(var i=0; i < target.length; i++) {
        html += "<center style=\"float:left;";
        html += style;
        html += "\">";
        html += target[i][0];
        html += "  | Score: ";
        html += target[i][1];
        html += "</center>";
      }
      return html;
    },

    gameEnd() {
      this.$socket.emit('gameOver'); // tell admin game over
    },
  
    phaseOne() {
      this.selected = null;
      return null;
    },
  
    submitUserInput() {
      this.$parent.submitUserInput(this.answer);
      this.submitted = this.answer;
      this.answer = "";
    },

    submitSelectedAnswer(target) {
      this.$parent.submitUserInput(target);
      this.selected = target;
      this.submitted = null;
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

