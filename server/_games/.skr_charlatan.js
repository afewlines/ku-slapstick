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

var prompts = ["thomas edison", "jake paul", "dandruff", "toilet paper", "dinosaurs", "chickens", "alternative energy", "car engines", "space", "computers", "facebook", "twitter", "snowboards", "cabbage", "hot dogs", "curry", "smoke", "air", "water", "human nature", "the human body", "your favorite show", "your favorite movie", "your favorite food", "coffee", "almond milk", "the next holiday", "art", "art history", "music", "your favorite artist", "your favorite band", "music theory", "business", "the stock market", "banking", "a sport", "hockey", "football", "actual football", "nicotine", "plants", "flowers", "nature", "religion", "politics", "laws", "clocks", "shoes", "cardigans", "electronics", "soldering", "backpacks", "cooking", "baking", "bacon", "new york city", "memes", "early memes", "reddit", "4chan", "ifunny", "what you're wearing rn", "tyler, the creator", "godzilla", "steve buscemi", "eric andre", "something kinky", "george washington", "george washington carver", "the pope", "swear words", "an algorithim", "math", ];

module.exports = {
  name: "charlatan",
  author: "brad, seeker",
  description: "1+ players. are you just a clown or are you the entire circus?",
  active: false,
  sendUpdate: function () { console.log("Update hook not connected."); },
  payload: {
    phase: -1, // 0:submissions, 1:play, 2:end
    quantity: -1,
    prompts: null,
    submissions: null,
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
          this.payload.phase = -1;
          this.payload.submissions = [];
          this.payload.current = -1;
          this.payload.dataP2 = null;
          this.payload.prompts = prompts;
          this.sendUpdate();
          break;
        case 'start':
          this.payload.phase = 0;
          this.payload.quantity = parseInt(payload.payload.split(' ')[1]);
          this.sendUpdate();
          break;
      }
      return;
    }

    switch (this.payload.phase) {
      case 0:
        this.payload.submissions.push(payload);
        if (this.payload.submissions.length >= this.payload.quantity) {
          this.payload.quantity = his.payload.submissions.length;
          this.payload.phase = 1;
          this.sendUpdate();
        }
        break;
      case 1:

        break;
      case 2:

        break;
    }
  },
  gameLogic: async function (sendUpdate) {

  },
  updatePlayers: function (payload) {
    this.payload.players = payload;
  }
}