const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
//const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

app.use(morgan('combined'))
//app.use(bodyParser.json())
app.use(cors())

io.on('connection', client => {
  console.log("CLIENT CONNECTED");
  console.log("");
  console.log(client.id);
  client.on('event', data => {
    // event template
  });
  client.on('disconnect', () => {
    console.log("CLIENT DISCONNECTED");
  });
  client.on('addPlayer', (username) => {
    console.log(`Adding player ${username}`);
    client.emit('messageChannel', 'Player Added')
  });
})

server.listen(4578)

/*
const store = new Vuex.Store({
  state: {
    playing: false, // is in game?
    players: [], // the players and their wins
    activity: '' // what game is being played
  },
  mutations: {
    playmode(state, payload) {
      state.playing = payload ? true : false;
    },
    addPlayer(state, username) {
      state.players.push({ name: username, score: 0 });
    },
    removePlayer(state, username) {
      state.players = state.players.filter(player => (player.name == username));
    }
  },
  getters: {
    isPlaying: state => {
      return state.playing;
    },
    players: state => {
      return state.players;
    },
    currentActivity: state => {
      return state.activity == '' ? 'No Activity Selected' : state.activity;
    }
  }
})
*/