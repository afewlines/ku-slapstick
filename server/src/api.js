var fs = require('fs');
var files = fs.readdirSync('_games');

module.exports = {
  gameCount: 0,
  gameList: [],
  loadGames: function () {
    for (var file in files) {
      file = files[file];
      console.log("ON: ", file);
      if (file.substr(-3) == ".js") {
        console.log("HIT ON: ", file);
        this.gameList.push(require(`../_games/${file}`));
      }
    }
  }
}