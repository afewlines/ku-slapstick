<template>
<div class="container"
  ref="container">
  <div class="tab"
    @click="toggleSwitch">
    Session Info
  </div>
  <div v-if="game"
    class="info"
    ref="info">
    <div id="name">{{ game.name }}</div>
    <div id="author">{{ game.author }}</div>
    <div id="desc">{{ game.desc }}</div>
  </div>
  <div class="board"
    ref="board">
    | Players
    <br> </br>
    <transition-group name="players"
      tag="div">
      <div v-for="(id, name) in players"
        class="player"
        @click="clickPlayer($event.target)"
        :key="id">
        {{ name }}
      </div>
    </transition-group>
  </div>
</div>
</template>

<script>
export default {
  name: 'Leaderboard',
  data() {
    return {
      players: [],
      game: null,
      admin: false
    }
  },
  mounted() {
    this.$socket.emit('getLeaderboardData');
  },
  sockets: {
    leaderboardData(payload) {
      console.log(payload);
      this.players = payload.players;
      this.game = payload.game;
    }
  },
  methods: {
    toggleSwitch() {
      if (this.$refs.container.classList.contains('activated')) {
        this.$refs.container.classList.remove('activated');
        setTimeout(function() {
          this.$refs.container.classList.remove('actuating');
        }.bind(this), 1000);
      } else {
        this.$refs.container.classList.add('activated');
        this.$refs.container.classList.add('actuating');
      }
    },
    clickPlayer(el) {
      if (this.admin) {
        console.log(el);
        this.$socket.emit('kickPlayer', el.innerText);
      }
    }
  }
}
</script>


<style scoped>
* {
  overflow: visible;
  font-size: 1em;
  color: #3a3c38;
}

.container {
  z-index: 10005;
  position: absolute;
  width: 18em;
  height: 80vh;
  top: 50%;
  padding: 0.5em;
  transform: translate(-100%, -50%);
  background-color: rgb(255, 255, 255);
  transition: transform 1s ease-in-out;
  filter: opacity(80%) drop-shadow(0 0 3em);
}

.activated {
  transform: translate(20%, -50%);
}

.tab {
  position: absolute;
  display: inline-block;
  white-space: nowrap;
  width: auto;
  height: auto;
  left: 100%;
  padding: 0.5em;
  transform-origin: top left;
  transform: rotate(90deg) translateY(-100%);
  font-style: italic;
  background-color: rgb(255, 255, 255);
  transition: background-color 0.25s ease-out;

}

.board {
  overflow: hidden;
  padding-top: 1em;
  font-size: 1.25em;
  font-weight: 100;

}

#name {
  font-size: 1.25em;
  font-style: italic;
}

#author {
  position: relative;
  top: -0.2em;
  font-size: 0.75em;
  font-weight: 100;
}

#desc {
  font-size: 0.8em;
  font-weight: 100;
}

.player {
  display: inline-block;
  font-size: 0.8em;
  padding: 0.25em;
  margin: 0.125em;
  font-weight: 100;
  background-color: rgba(0, 0, 0, 0.2);
  transition: background-color 1s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 1.25s cubic-bezier(0.6, -2, 0.2, 1.65);
}

.player:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.125);
}

.tab:hover {
  background-color: rgb(181, 181, 181);
}

.players-enter-active,
.players-leave-active {
  transition: all 1s;
}

.players-enter,
.players-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.container:not(.actuating):hover {
  transform: translate(-95%, -50%);
}
</style>
