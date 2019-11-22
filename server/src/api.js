//const httpVueLoader = require('http-vue-loader');
var fs = require('fs');
var files = fs.readdirSync('_games');

module.exports = {
  count: 0,
  games: [],
  currentGame: null,
  hookUpdate: null,
  players: {},
  load: function (target) {
    this.currentGame = this.games[target];
    this.currentGame.init(this.hookUpdate);
    this.updatePlayers();
  },
  getGames: function () {
    return this.games.map(x => x.name)
  },
  loadGames: function (hookUpdate) {
    this.hookUpdate = hookUpdate;
    // itr through files in dir
    for (var file in files) {
      // reuse the var because code golf is a way of life
      file = files[file];
      // check if js file, load if so
      // TODO: implement further verification
      if (file[0] != "." && file.substr(-3) == ".js") {
        console.log("Plugin found: ", file);
        this.games.push(require(`../_games/${file}`));
        this.count += 1;
      } else {
        console.log("Skipping: ", file);
      }
    }
  },
  clearCurrentGame: function () {
    this.currentGame = null;
  },
  getRendererPlayer: function () {
    if (this.currentGame) {
      return this.currentGame.getRendererPlayer();
    }
    return null;
  },
  getRendererAdmin: function () {
    if (this.currentGame) {
      return { url: this.currentGame.getRendererAdmin(), name: this.currentGame.name };
    }
    return null;
  },
  getPayload: function () {
    if (this.currentGame) {
      return this.currentGame.getPayload();
    }
    return null;
  },
  getLeaderboardData: function () {
    if (this.currentGame) {
      return { players: this.players, game: { name: this.currentGame.name, author: this.currentGame.author, desc: this.currentGame.description } }
    }
    return { players: this.players, game: null }

  },
  submitUserInput: function (payload) {
    if (this.currentGame) {
      return this.currentGame.submitUserInput(payload);
    }
    return null;
  },
  registerPlayer: function (id, payload) {
    console.log(this.players, payload);
    if (this.players[payload]) {
      if (this.players[payload] == id) {
        return true;
      } else {
        return false;
      }
    }

    for (var p in this.players) {
      if (this.players[p] == id) {
        delete this.players[p];
      }
    }

    this.players[payload] = id;
    this.updatePlayers();
    return true;
  },
  removePlayer: function (payload) {
    for (var p in this.players) {
      if (this.players[p] == payload) {
        delete this.players[p];
        return;
      }
    }
  },
  kickPlayer: function (payload) {
    if (typeof (this.players[payload]) != 'undefined') {
      return this.players[payload];
    }
    return null;
  },
  updatePlayers: function () {
    if (this.currentGame)
      this.currentGame.updatePlayers(this.players);
    return null;
  },
  submitPlay: function (data = null) {
    if (this.currentGame)
      this.currentGame.gameLogic(data);
  },
}