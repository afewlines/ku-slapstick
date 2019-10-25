const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const morgan = require('morgan');

app.use(morgan('combined'));
app.use(cors());

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
})

server.listen(4578)