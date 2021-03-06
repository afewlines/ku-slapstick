var fs = require('fs');
var parse = require('csv-parse');

var questionCount = 5; // default
var timerLength = 10000; // default

var qaList = []; // list of all questions and their answers
var qaAnswers = []; //index of correct answer

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// randomize location and keep track of correct answer
function randomizeAnswerList(qaList) {
  for(line in qaList) {
    var correctAns = Math.floor(Math.random() * 4);
    qaAnswers.push(correctAns);
    var temp = qaList[line][1][0]; // correct answer
    qaList[line][1][0] = qaList[line][1][correctAns]; // swap
    qaList[line][1][correctAns] = temp;
  }
} // end randomizeAnswerList


// gets a random selection of question indices
function getRandomQuestions(qList) {
  var questionNums = [];
  while(questionNums.length < questionCount) {
    var num = Math.floor(Math.random() * qList.length);
    if (!(questionNums.includes(num))) questionNums.push(num);
  } // end while
  
  return questionNums;
} // end getRandomQuestions

// gets random answer indices for each question
function getRandomAnswers(qNums, aList) {
  var ansNums = [];
  for(var i=0; ansNums.length < questionCount; i++) {
    var ansIndex = [];
    ansIndex.push(0); // 1st answer is always correct

    while(ansIndex.length < 4) { // select answers for one question
      var num = Math.floor(Math.random() * aList[qNums[i]].length);
      if (!(ansIndex.includes(num))) ansIndex.push(num); 
    } 
    ansNums.push(ansIndex); // set of answers for 1 question
  } // end for
  return ansNums; // all sets of answers
} // end getRandomAnswers

// gets random questions and answers from read csv
function processCSV(qa) {
  var questionList = [], answerList = [];

  for (line in qa) {
    questionList.push(qa[line][0]);
  }
  for (var i=0; i < qa.length; i++) {
    answerList.push(qa[i][1]);
  }
  var q = getRandomQuestions(questionList); // indices of questions
  var a = getRandomAnswers(q, answerList);  // indices of answers

  for(var i=0; i < questionCount; i++) { // create question/answers list
    var answers = [];
    for(var j=0; j < 4; j++) {
      aText = answerList[q[i]][a[i][j]]; 
      answers.push(aText);
    }
    // array of ['question', [answers for question]]
    qaList.push([questionList[q[i]], answers]);
  }

  console.log("Trivia questions successfully loaded");
} // end process CSV

// reads entire csv file
function readCSV () {
  return new Promise(resolve => {
    const qa = [];
    fs.createReadStream("_games/trivia_file.csv").pipe(parse({delimeter: ','}))
      .on('data', (data) => {
        qa.push([data[0], data.slice(1, data.length)]);
      }).on('end', () =>
            resolve(qa));
  });
} // end readCSV

module.exports = {
  name: "Gaming Trivia",
  author: "kellcj2",
  description: "are you smarter than a group of drunk college students?",
  sendUpdate: function () { console.log("Update hook not connected."); },

  payload: {
    question: null,
    questionNum: 0,
    gameEnd: false,
    submitted: false,
  },
  answers: [],
  playerScores: [],
  
  init: async function (hookUpdate) {
    console.log("Loading Gaming Trivia", hookUpdate);
    this.sendUpdate = hookUpdate;

    return true;
  }, // end init

  getRendererPlayer: function () {
    return "/game_modules/trivia_player";
  },
  getRendererAdmin: function () {
    return "/game_modules/trivia_admin";
  },    
  getPayload: function () {
    return this.payload;
  },
  submitUserInput: function (payload) {
    //console.log(payload);
    var newScore = true, correct = 0;

    if(payload.payload == qaAnswers[this.payload.questionNum]) // if correct
      correct = 1;
    
    for(player in this.playerScores) { // check if player already added
      if(this.playerScores[player][0] == payload.username) {
        this.playerScores[player][1] += correct; // modify score
        newScore = false;
        //console.log("score: " + this.playerScores[player]);
        break;
      }
    }
    if(newScore) { // add player to playerScores
      //console.log("adding new player: " + payload.username);
      this.playerScores.push([payload.username, correct]);
    }
    
  },

  gameLogic: async function (data) {
    console.log("Starting Trivia Game");
    if(data != null) {
      timerLength = Number(data[0]) * 1000; // ms
      questionCount = Number(data[1]);
    }

    this.answers = [];
    this.playerScores = [];
    qaList = [];
    qaAnswers = [];
    
    var promise = readCSV();
    promise.then(qa => (  // when csv file is done being read
      processCSV(qa),
      randomizeAnswerList(qaList),
      this.beginGame()
    ));
  },

  beginGame: async function () {
    for(var i=0; i < questionCount; i++) {
      this.payload.question = qaList[i][0];
      this.payload.answers = qaList[i][1];
      this.payload.submitted = false;
      this.sendUpdate();
      
      await sleep(timerLength);
      this.payload.questionNum++;
    } // end for
    // game is done, send final scores over
    this.payload.gameEnd = true;
    this.payload.scores = this.playerScores; 
    this.sendUpdate();

    // clear for next game
    this.payload.question = null;
    this.payload.questionNum = 0;
    this.payload.gameEnd = false;
    this.payload.submitted = false;
  },

  
  updatePlayers: function (payload) {
    //console.log("Trivia players: ", payload);
    
  },

} // end module.exports
