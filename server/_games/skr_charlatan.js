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

var prompts = ["thomas edison", "jake paul", "dandruff", "toilet paper", "dinosaurs", "chickens", "alternative energy", "car engines", "space", "computers", "facebook", "twitter", "snowboards", "cabbage", "hot dogs", "curry", "smoke", "air", "water", "human nature", "the human body", "coffee", "almond milk", "the next holiday", "art", "art history", "music", "music theory", "business", "the stock market", "banking", "a sport", "hockey", "football", "actual football", "nicotine", "plants", "flowers", "nature", "laws", "clocks", "shoes", "cardigans", "electronics", "soldering", "backpacks", "cooking", "baking", "bacon", "new york city", "memes", "early memes", "reddit", "4chan", "ifunny", "tyler, the creator", "godzilla", "steve buscemi", "eric andre", "something kinky", "george washington", "george washington carver", "the pope", "swear words", "math"];

module.exports = {
  name: "charlatan",
  author: "brad, seeker",
  description: "2-15 players. are you just a clown or are you the entire circus?",
  active: false,
  sendUpdate: function () { console.log("Update hook not connected."); },
  payload: {
    phase: -1, // 0:submissions, 1:play, 2:end
    quantity: -1,
    prompts: null,
    submissions: [],
    subs: 0,
    scores: [],
    current: -1,
    dataP2: null,
    players: {}
  },
  init: async function (hookUpdate) {
    console.log("Starting brad, seeker's CHARLATAN");
    this.sendUpdate = hookUpdate;
    this.payload.phase = -1;
    this.payload.prompts = prompts;
    this.payload.submissions = [];
    this.payload.subs = 0;
    this.payload.scores = [];
    this.payload.current = -1;
    this.payload.dataP2 = null;
    this.sendUpdate();
    return true;
  },
  getRendererPlayer: function () {
    return "/game_modules/charlatan_player";
  },
  getPayload: function () {
    return this.payload;
  },
  getRendererAdmin: function () {
    return "/game_modules/charlatan_admin";
  },
  submitUserInput: async function (payload) {
    if (payload.username == "!ADMIN") {
      switch (payload.payload.split(' ')[0]) {
        case 'reset':
          this.active = true;
          this.payload.phase = -1;
          this.payload.submissions = [];
          this.payload.subs = 0;
          this.payload.scores = [];
          this.payload.current = -1;
          this.payload.dataP2 = null;
          this.payload.prompts = prompts;
          this.sendUpdate();
          break;
        case 'start':
          this.active = true;
          this.payload.phase = 0;
          this.payload.quantity = parseInt(payload.payload.split(' ')[1]);
          this.payload.subs = this.payload.quantity * countObj(this.payload.players);
          this.sendUpdate();
          break;
        case 'advance':
          this.payload.phase++;
          this.sendUpdate();
          break;
      }
      return;
    }

    switch (this.payload.phase) {
      case 0:
        this.payload.submissions.push(payload.payload);
        if (this.payload.submissions.length >= countObj(this.payload.players) * this.payload.quantity) {
          this.payload.submissions.sort(() => Math.random() - 0.5);
          this.payload.phase = 1;
          this.sendUpdate();
        } else {
          this.sendUpdate(true);
        }
        break;
      case 1:
        this.payload.scores.push(payload);
        if (this.payload.scores.length >= countObj(this.payload.players)) {
          this.payload.scores.sort((x) => x.payload);
          this.payload.phase = 2;
          this.sendUpdate();
        } else {
          this.sendUpdate(true);
        }
        break;
      case 2:

        break;
    }
  },
  gameLogic: async function (sendUpdate) {

  },
  updatePlayers: function (payload) {
    if (this.active) {
      for (var user in this.payload.players) {
        if (!payload.hasOwnProperty(user)) {
          delete this.payload.players[user];
        }
      }
    } else {
      this.payload.players = payload;
    }
    this.sendUpdate(true);
  }
}