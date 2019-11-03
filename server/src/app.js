const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const morgan = require('morgan');
const api = require('./api.js');


api.loadGames();
app.use(morgan('combined'));
app.use(cors());

app.get('/game_modules/*', function (req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(req.url.replace('/game_modules', ''), { root: __dirname + '/../game_modules' });
});

io.on('connection', client => {
  console.log("CLIENT CONNECTED");
  client.on('event', data => {
    // event template
  });
  client.on('disconnect', () => {
    console.log("CLIENT DISCONNECTED");
  });
  client.on('addPlayer', (username) => {
    console.log(`Adding player ${username}`);
    client.emit('messageChannel', 'Player Added');
  });
  client.on('submitAdmin', (game, timer) => {
    console.log(`Admin Submit: ${game} | ${timer}`);
    client.emit('messageChannel', 'Setting Successfully Set');
  });

  client.on('submitPlay', (data) => {
    console.log(`${data}`);
    client.emit('beginGame', 'true');
    // Do something to begin game
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

  client.on('getRendererPlayer', data => {
    client.emit('rendererPlayer', api.getRendererPlayer())
  });

  client.on('getUpdate', data => {
    client.emit('update', api.getPayload())
  });

})

server.listen(4578);