2

<template>
<div>
  <link href="https://fonts.googleapis.com/css?family=Comfortaa|Josefin+Sans&display=swap"
    rel="stylesheet">

  <div v-if="typeof(payload.phase) != 'undefined' "
    :style="getStyle('box')">

    <div v-if="payload.phase == -1"
      :style="getStyle('fullsize')">
      <div :style="getStyle('centerVert')">
        <div :style="getStyle('p0Header')">
          ~ please wait for admin ~
        </div>
        <div :style="getStyle('text')">
          you'll be asked to write 1 truth and 1 lie for various topics. then, you'll go through and spot the lie.
        </div>
      </div>
    </div>

    <div v-else-if="payload.phase == 0"
      :style="getStyle('fullsize')">
      {{ shuffle(false) }}
      <div v-if="this.payload.quantity > 0">

        <div v-if="lying"
          :style="getStyle('p0Header')">
          lie about:
        </div>
        <div v-else
          :style="getStyle('p0Header')">
          truth about:
        </div>

        <div :style="getStyle('p0Subject')">
          {{ payload.prompts[0] }}
        </div>

        <form v-on:submit.prevent="p0Submit"
          :style="getStyle('p0Form')">
          <input v-model="p0Input"
            id="p0Input"
            :style="getStyle('p0Input')">
        </form>

        <div v-on:click="pass"
          :style="getStyle('pass')"
          v-on:mouseenter="hover($event, {backgroundColor: '#dbd8d8'})"
          v-on:mouseleave="hover($event, {backgroundColor: '#fff'})">
          skip topic
        </div>
      </div>
      <div v-else
        :style="getStyle('centerVert')">
        <div :style="getStyle('p0Header')">
          okay!
        </div>
        <div :style="getStyle('p0Header2')">
          now just sit tight :)
        </div>
      </div>
    </div>

    <div v-else-if="payload.phase == 1"
      :style="getStyle('fullsize')">
      <div v-if="payload.submissions.length > 0">
        <div :style="getStyle('p0Header2')">
          ~ where's the lie about ~
        </div>

        <div :style="getStyle('p0Subject')">
          {{payload.submissions[0].subject}}
        </div>

        <div :style="getStyle('fullsize')">
          <div v-on:click="choose(activePrompts[0].truth)"
            :style="getStyle('p1BoxLeft')"
            v-on:mouseenter="hover($event, {backgroundColor: 'rgb(40,40,40)'})"
            v-on:mouseleave="hover($event, {backgroundColor: ''})">
            {{ activePrompts[0].content }}
          </div>
          <div v-on:click="choose(activePrompts[1].truth)"
            :style="getStyle('p1BoxRight')"
            v-on:mouseenter="hover($event, {backgroundColor: 'rgb(40,40,40)'})"
            v-on:mouseleave="hover($event, {backgroundColor: ''})">
            {{ activePrompts[1].content }}
          </div>
        </div>

        <div ref="pass"
          :style="getStyle('p1Pass')">
        </div>
        <div ref="fail"
          :style="getStyle('p1Fail')">
        </div>

      </div>
      <div v-else
        :style="getStyle('centerVert')">
        <div :style="getStyle('p0Header')">
          nice!
        </div>
        <div :style="getStyle('p0Header2')">
          hold on for the results
        </div>
      </div>
    </div>

    <div v-else-if="payload.phase == 2"
      :style="getStyle('fullsize')">
      <div :style="getStyle('centerVert')">
        <div :style="getStyle('p0Header2')">
          your score:
        </div>
        <div :style="getStyle('p0Header')">
          {{ this.score }} / {{ this.payload.subs }}
        </div>
      </div>
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
      lying: false,
      p0Input: "",
      p0Current: {
        subject: null,
        lie: null,
        truth: null
      },
      score: 0,
      flag: true,
      username: this.$store.getters.getUsername
    }
  },
  computed: {
    activePrompts: function() {
      let cur = [{
        content: this.payload.submissions[0].truth,
        truth: true
      }, {
        content: this.payload.submissions[0].lie,
        truth: false
      }];
      cur.sort(() => Math.random() - 0.5);
      return cur;
    }
  },
  methods: {
    shuffle(once = true) {
      if (!once) {
        if (this.flag) {
          this.payload.prompts.sort(() => Math.random() - 0.5);
          this.flag = false;
        }
        return '';
      }
      this.payload.prompts.sort(() => Math.random() - 0.5);
      return '';
    },
    pass() {
      this.lying = false;
      this.p0Input = "";
      this.p0Current = {
        subject: null,
        lie: null,
        truth: null
      };
      this.shuffle();
    },
    hover(event, mod) {
      for (var prop in mod) {
        event.target.style[prop] = mod[prop];
      }
    },
    p0Submit() {
      if (this.p0Input.length < 1) {
        return;
      }

      if (this.lying) {
        this.p0Current.lie = this.p0Input;
        this.lying = false;
      } else {
        this.p0Current.truth = this.p0Input;
        this.lying = true;
      }
      this.p0Input = "";

      if (this.p0Current.lie != null && this.p0Current.truth != null) {
        this.p0Current.subject = this.payload.prompts[0];
        this.$parent.submitUserInput(this.p0Current);
        this.p0Current.subject = null;
        this.p0Current.lie = null;
        this.p0Current.truth = null;

        this.payload.quantity--;
        this.shuffle();
      }

    },
    choose(target) {
      if (target) {
        this.$refs.fail.style.opacity = 1;
        this.$refs.fail.style.zIndex = 99999;
        setTimeout(function() {
          this.$refs.fail.style.opacity = 0;
          this.$refs.fail.style.zIndex = -99999;
        }.bind(this), 500);
      } else {
        this.$refs.pass.style.opacity = 1;
        this.$refs.pass.style.zIndex = 99999;
        setTimeout(function() {
          this.$refs.pass.style.opacity = 0;
          this.$refs.pass.style.zIndex = -99999;
        }.bind(this), 500);
        this.score++;
      }
      if (this.payload.submissions.length > 1) {
        this.payload.submissions.splice(0, 1);
      } else {
        setTimeout(function() {
          this.payload.submissions.splice(0, 1);
        }.bind(this), 600);
        this.$parent.submitUserInput(this.score);
      }
    },
    hover(event, mod) {
      for (var prop in mod) {
        event.target.style[prop] = mod[prop];
      }
    },
    getStyle(target) {
      let payload = []
      switch (target) {
        case 'box':
          payload = [
            'width: 100%;',
            'height: 50vh;',
            'margin: 2em auto;',
            'text-align: center;',
            'background-color: rgb(20, 21, 20);',
            'overflow-x: hidden;',
            'overflow-y: auto;',
            'padding: 1em;',
          ]
          break;
        case 'text':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'padding: 1em;',
            'font-size: 1em;',
            'color: #fff;',
          ]
          break;
        case 'p0Header':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'padding: 1em;',
            'font-size: 1.5em;',
            'color: #fff;',
          ]
          break;
        case 'p0Header2':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'padding: 1em;',
            'font-size: 1em;',
            'color: #fff;',
          ]
          break;
        case 'p0Subject':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'padding-bottom: 2em;',
            'font-size: 2em;',
            'color: rgb(191, 191, 191);',
          ]
          break;
        case 'centerVert':
          payload = [
            "position: relative;",
            "top: 50%;",
            "transform: translateY(-50%);",
          ]
          break;
        case 'form':
          payload = [
            'padding: 0 0 2em;',
          ]
          break;
        case 'p0Input':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'width: 100%;',
            'height: 200%;',
            'font-size: 1.5em;',
            'margin: 0 auto;',
            '',
          ]
          break;
        case 'fullsize':
          payload = [
            'width: 100%;',
            'height: 100%;',
          ]
          break;
        case 'p1BoxRight':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'color: #fff;',
            'position: absolute;',
            'width: 50%;',
            'padding: 0.5em;',
            'right: 0;',
            'font-size: 1.5em;',
            'transition: background-color 0.5s ease-in-out;'
          ]
          break;
        case 'p1BoxLeft':
          payload = [
            "font-family: 'Josefin Sans', sans-serif;",
            'color: #fff;',
            'position: absolute;',
            'width: 50%;',
            'padding: 0.5em;',
            'left: 0;',
            'font-size: 1.5em;',
            'transition: background-color 0.5s ease-in-out;'
          ]
          break;
        case 'p1Pass':
          payload = [
            'position: absolute;',
            'width: 100%;',
            'height: 100%;',
            'left:0;',
            'top:0;',
            'z-index: -99999;',
            'background-color: #43aa8b;',
            'opacity: 0;',
            'transiton: opacity 0.125s ease-in-out;'
          ]
          break;
        case 'p1Fail':
          payload = [
            'position: absolute;',
            'width: 100%;',
            'height: 100%;',
            'left:0;',
            'top:0;',
            'z-index: -99999;',
            'background-color: #92140c;',
            'opacity: 0;',
            'transiton: opacity 0.125s ease-in-out;'
          ]
          break;
        case 'h1':
          payload = [
            'width: 80%;',
            'margin: auto;',
            "font-family: 'Josefin Sans', sans-serif;",
            'font-weight: 100;',
            'font-style: italic;',
            'font-size: 1.25em;',
            'color: rgb(171, 167, 167);',
          ]
          break;
        case 'user':
          payload = [
            'margin: 0 auto 0;',
            'padding: 0.5em 0 0;',
            "font-family: 'Josefin Sans', sans-serif;",
            'font-size: 1em;',
            'text-align: left;',
            'color: rgb(195, 188, 188);',
          ]
          break;
        case 'sub':
          payload = [
            'margin: 0 auto 0.5em;',
            "font-family: 'Josefin Sans', sans-serif;",
            'font-weight: 100;',
            'font-style: italic;',
            'font-size: 1.25em;',
            'text-align: left;',
            'color: rgb(171, 167, 167);',
          ]
          break;
        case 'h2':
          payload = [
            'padding: 0.5em;',
            "font-family: 'Comfortaa', cursive;",
            'font-weight: 100;',
            'font-size: 2em;',
            'text-align: center;',
            'color: rgb(235, 235, 235);',
          ]
          break;
        case 'pass':
          payload = [
            'display: inline-block;',
            'width: auto;',
            'height: auto;',
            'margin: 2em auto;',
            'padding: 0.5em;',
            'color: #3a3c38;',
            'background-color: #fff;',
            'transition: background-color 0.5s ease-in-out;'
          ]
          break;
      }
      return payload.join(' ');
    }
  }
}
</script>
