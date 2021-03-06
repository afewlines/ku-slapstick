const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const morgan = require('morgan');
const api = require('./api.js');

app.use(morgan('combined'));
app.use(cors());

app.get('/game_modules/*', function (req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(req.url.replace('/game_modules', ''), { root: __dirname + '/../game_modules' });
});

io.on('connection', client => {
  client.on('event', data => {
    // event template
  });
  client.on('disconnect', () => {
    api.removePlayer(client.id);
    updateLeaderboard();
    console.log(`DISCON ${client.id}`);
  });
  client.on('addPlayer', (username) => {
    console.log(`CONNEC ${client.id}, ${username}`);
    api.registerPlayer(client.id, username);
    updateLeaderboard();
    //client.emit('messageChannel', 'Player Added');
  });
  client.on('kickPlayer', (username) => {
    io.emit('kick', username);
    console.log(`KICKED ${api.kickPlayer(username)}, ${username}`);
    updateLeaderboard();
  });
  client.on('getAlive', data => {
    io.emit('connected');
  });
  client.on('alive', data => {
    api.registerPlayer(client.id, data);
  });
  client.on('submitAdmin', (game, timer) => {
    console.log(`ADMNSB ${game}, ${timer}`);
    client.emit('messageChannel', 'Setting Successfully Set');
  });
  client.on('submitPlay', (data) => { // on admin page and game is selected
    api.submitPlay(data);
  });
  client.on('clearCurrentGame', () => { // on admin page and game is selected
    api.clearCurrentGame();
    io.emit('reloadPage');
  });
  client.on('submitChat', (user, msg) => {
    io.emit('chat', [user, msg]);
  });
  client.on('apiCall', (target = null) => {
    if (target) {
      if (typeof api[target] === "function") {
        client.emit('ret', api[target]());
      } else {
        client.emit('ret', api[target]);
      }
    } else {
      client.emit('ret', api);
    }
  });
  client.on('getGames', data => {
    client.emit('getGames', api.games);
  });
  client.on('setGame', target => {
    api.load(target);
  });
  client.on('getRendererPlayer', data => {
    client.emit('rendererPlayer', api.getRendererPlayer());
  });
  client.on('getRendererAdmin', data => {
    client.emit('rendererAdmin', api.getRendererAdmin());
  });
  client.on('getUpdate', data => {
    client.emit('update', api.getPayload());
  });
  client.on('sendUpdate', data => {
    io.emit('update', api.getPayload());
    updateLeaderboard();
  });
  client.on('submitUserInput', data => {
    api.submitUserInput(data);
  });
  client.on('getLeaderboardData', data => {
    client.emit('leaderboardData', api.getLeaderboardData());
  });
  client.on('gameOver', () => {
    io.emit('gameOver'); // tell admin game is over
  });
})

function updateLeaderboard() {
  io.sockets.emit('leaderboardData', api.getLeaderboardData());
}

function forceUpdate(admin) {
  if (admin) {
    io.sockets.emit('updateAdmin', api.getPayload());
    io.sockets.emit('connected');
  } else {
    io.sockets.emit('update', api.getPayload());
    io.sockets.emit('connected');
  }
}

api.loadGames(function (admin = false) {
  forceUpdate(admin);
}.bind(forceUpdate));

setTimeout(function () { io.sockets.emit('refresh'); }, 1000);
server.listen(4578);