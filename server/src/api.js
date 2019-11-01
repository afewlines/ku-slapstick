var fs = require('fs');
var files = fs.readdirSync('_games');

module.exports = {
  count: 0,
  games: [],
  currentGame: null,
  getGames: function () {
    return this.games.map(x => x.name)
  },
  loadGames: function () {
    // itr through files in dir
    for (var file in files) {
      // reuse the var because code golf is a way of life
      file = files[file];
      // check if js file, load if so
      // TODO: implement further verification
      if (file.substr(-3) == ".js") {
        console.log("Plugin found: ", file);
        this.games.push(require(`../_games/${file}`));
        this.count += 1;
      } else {
        console.log("Skipping: ", file);
      }
    }

    // TODO: THIS IS DEBUG
    this.currentGame = this.games[0];
  },
  getRenderDataPlayer: function () {
    if (this.currentGame) {
      return this.currentGame.getRenderDataPlayer();
    }
    return `<p>No game loaded.</p>`
  }
}