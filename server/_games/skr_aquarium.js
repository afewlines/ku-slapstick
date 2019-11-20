function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var questionCount = 5;
var timerLength = 10000;

words = [
  "Mansquatch", "Chyorckle", "Bobulus", "Stevetanaka", "Moople",
  "Chort", "Zonkle", "Klormp", "Pnuemonolank", "Zgloerven", "Konk",
  "Snorp", "Noogle", "Hurkler", "Ponklo", "Alphanoose", "Polymoose",
  "Eigle", "Yeckle", "Doink", "Stoink", "Worple", "Quarck", "Andruple",
  "Rheudocow", "Turckle", "Flaglametric", "Inculbar", "Oinogoose",
  "Sadmansad", "Furk", "Gonk", "Jimbarslim", "Lizzord",
  "Zuccislizardrobot", "Xytromidon", "Clackle", "Vynumerofive",
  "Czechoslomooseia", "Bald-horkus", "Flabadon", "Tinklevonbon",
  "Dopameme", "Flibble", "Bighugelarge",
]

// returns random selection of words
function getRandomWords() {
  var index = [];
  while(index.length < questionCount) {
    var num = Math.floor(Math.random() * words.length);
    if(!(index.includes(num))) index.push(num);
  } // end while
  var w = [];
  for(var i=0; i < questionCount; i++) {
    w.push(words[index[i]]);
  } // end for
  return w;
}

module.exports = {
  name: "Aquarium",
  author: "kellcj2",
  description: "fake word definitions (aka definitely not dictionarium)",
  sendUpdate: function () { console.log("Update hook not connected."); },

  payload: {
    phase: 1,
    currentWord: null,
    gameEnd: false,
    answers: [],
    scores: [],
  },
  
  playerData: [], // arrays of [username, current answer, score]
  gameWords: [],  // array of words being used in current game
  
  init: async function (hookUpdate) {
    console.log("Starting Aquarium", hookUpdate);
    this.sendUpdate = hookUpdate;

    return true;
  }, // end init

  getRendererPlayer: function () {
    return "/game_modules/aquarium_player";
  },
  getRendererAdmin: function () {
    return "/game_modules/aquarium_admin";
  },    
  getPayload: function () {
    return this.payload;
  },
  submitUserInput: function (userData) {
    if(this.payload.phase == 1) {
      var newAnswer = true;
      for(player in this.playerData) { // check if player already added
        if(this.playerData[player][0] == userData.username) { 
          newAnswer = false;
          this.playerData[player][1] = userData.payload; // player's answer
          //break;
        }
      }
      if(newAnswer) // add new player
        this.playerData.push([userData.username, userData.payload, 0]);

    } else if(this.payload.phase == 2) { // select best answer
      //console.log("Selected answer");
      //console.log(userData.payload);
      for(player in this.playerData) {
        if(this.playerData[player][1] == userData.payload)
          this.playerData[player][2] += 1; // increment score
      }
      
    }
    //console.log(this.playerData);
  },

  gameLogic: async function (data) {
    if(data != null) {
      timerLength = Number(data[0]) * 1000;
      questionCount = Number(data[1]);
    }
    playerData = [];
    gameWords = getRandomWords();
    
    for(var i=0; i < questionCount; i++) {
      this.payload.currentWord = gameWords[i];
      for(player in this.playerData)
        this.playerData[player][1] = null;
      
      this.sendUpdate();
      await sleep(timerLength);

      // select best answer
      this.payload.phase = 2;
      for(player in this.playerData)
        if(this.playerData[player][1] != null)
          this.payload.answers.push(this.playerData[player][1]);

      this.sendUpdate();
      await sleep(15000);

      this.payload.phase = 1;
      this.payload.answers = [];
    } // end for

    // game is over, send scores
    this.payload.gameEnd = true;
    
    for(player in this.playerData) {
      var data = this.playerData[player];
      this.payload.scores.push([data[0], data[2]]);
      this.playerData[player][2] = 0; // reset score
    }
    this.sendUpdate();

    // clear for next game
    this.payload.phase = 1;
    this.payload.currentWord = null;
    this.payload.gameEnd = false;
    this.payload.answers = [];
    this.payload.scores = [];
  },


  updatePlayers: function (payload) {
    
  },
} // end module.exports
