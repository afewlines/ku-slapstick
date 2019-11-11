function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function countObj(target) {
  var count = 0;
  for (var k in target) {
    if (target.hasOwnProperty(k)) {
      ++count;
    }
  }
  return count;
}

prompts = [{
  required: ['adjective', 'noun, plural'],
  prompt: "Why can't my {1} hands hold all these {2}?",
}, {
  required: ['number > 1', 'adjective', 'event'],
  prompt: "Only {1} {2} days left until {3}!",
}, {
  required: ['verb, present tense', 'noun, plural', 'location'],
  prompt: "That's right, I {1} the {2} down in {3}.",
}, {
  required: ['number', 'number', 'adjective', 'adjective', 'noun'],
  prompt: "{1} {5}, {2} {5}, {3} {5}, {4} {5}.",
}]

module.exports = {
  name: "Madlibs",
  author: "brad, seeker",
  description: "hey hey we're the monkies.",
  active: false,
  sendUpdate: function () { console.log("Update hook not connected."); },
  payload: {
    target: null, //current adlib
    phase: 0, // 0:get user input, 1:display for player to pick, 2:result,
    submissions: [],
    judge: null,
    players: {},
    winner: null
  },
  submitted: 0,
  init: async function (hookUpdate) {
    console.log("Starting brad, seeker's MADLIB");
    this.sendUpdate = hookUpdate;
    this.payload.target = prompts[Math.floor(Math.random() * prompts.length)];
    await sleep(2000);
    var judge = Math.floor(Math.random() * countObj(this.payload.players));
    for (var p in this.payload.players) {
      judge--;
      if (judge <= 0) {
        judge = p;
        break;
      }
    }
    this.payload.judge = judge;
    this.active = true;
    this.sendUpdate();
    return true;
  },
  getRendererPlayer: function () {
    return "/game_modules/madlib_player";
  },
  getPayload: function () {
    return this.payload;
  },
  getRendererAdmin: function () {
    return "/game_modules/madlib_admin";
  },
  submitUserInput: function (payload) {
    if (payload.username == this.payload.judge) {
      this.payload.winner = payload.payload;
      this.payload.phase = 2;
      this.sendUpdate();
    } else {
      let a = this.payload.submissions.filter(x => x[0] == payload.username);
      if (this.payload.players[payload.username] && (a.length < 1)) {
        this.payload.submissions.push([payload.username, payload.payload]);
        if (this.payload.submissions.length >= countObj(this.payload.players) - 1) {
          this.payload.phase = 1;
          this.sendUpdate();
        }
      }
    }
  },
  gameLogic: async function (sendUpdate) {

  },
  updatePlayers: function (payload) {
    this.payload.players = payload;
  }
}
