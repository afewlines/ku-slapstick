var fs = require('fs'); 
var parse = require('csv-parse');

var questionCount = 10; // TODO: max admin be able to set number of q's

// gets a random selection of question indices
function getRandomQuestions(qList) {
  var questionNums = [];
  while(questionNums.length < questionCount) {
    var num = Math.floor(Math.random() * qList.length);
    if (!(questionNums.includes(num))) { // ensures no repeats
      questionNums.push(num);
    }
  } // end while
  
  return questionNums;
}

// gets random answer indices for each question
function getRandomAnswers(qNums, aList) {
  var ansNums = [];
  for(var i=0; ansNums.length < questionCount; i++) { // select answers for each question
    var ansIndex = [];
    ansIndex.push(0); // 1st answer is always correct
    while(ansIndex.length < 4) { // select answers for one question
      var num = Math.floor(Math.random() * aList[qNums[i]].length);
      if (!(ansIndex.includes(num))) {
        ansIndex.push(num);
      } 
    } // end while
    ansNums.push(ansIndex); // set of answers for 1 question
  } // end for
  return ansNums;
}

// main loop of game
function mainLoop(qaList) {
  // do shit
  console.log(qaList);
}

module.exports = {
  name: "Trivia",
  author: "brad, seeker",
  description: "hey hey we're the monkies.",

  init: function () {
    // process csv file
    questionList = [];
    answerList = [];
    var qaList = [];
    
    fs.createReadStream("_games/trivia_file.csv")
      .pipe(parse({delimiter: ','}))
      .on('data', function(csvrow) {
        questionList.push(csvrow[0]);
        answerList.push(csvrow.slice(1, csvrow.length));
      })
      .on('end',function() {
        //console.log(questionList);
        //console.log(answerList);
        console.log("Done processing csv file");
        var q = getRandomQuestions(questionList);
        var a = getRandomAnswers(q, answerList);
        //console.log(q);
        //console.log(a);
        
        for(var i=0; i < 10; i++) { // create question/answers list
          var answers = [];
          for(var j=0; j < 4; j++) {
            aText = answerList[q[i]][a[i][j]];
            answers.push(aText);
          }
          qaList.push([questionList[q[i]], answers]);
        }

        mainLoop(qaList);
      });
    return 1;
  },
                            
  getRendererPlayer: function () {
    return "/game_modules/trivia_player.vue.umd.min.js";
  },
  getRendererAdmin: function () {
    return 5;
  },
  submitUserInput: function (payload) {
    return 'h';
  },
         
}
