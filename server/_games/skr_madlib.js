prompts = [{
  required: ['adjective', 'noun, plural'],
  prompt: "Why can't my {1} hands hold all these {2}?",
}, {
  required: ['number > 1', 'adjective', 'event'],
  prompt: "Only {1} {2} days left until {3}!",
}, {
  required: ['verb, present tense', 'noun', 'location'],
  prompt: "That's right, I {1} the {2} down in {3}.",
}, {
  required: ['number', 'number', 'adjective', 'adjective', 'noun'],
  prompt: "{1} {5}, {2} {5}, {3} {5}, {4} {5}.",
}]

module.exports = {
  name: "Madlibs",
  author: "brad, seeker",
  description: "hey hey we're the monkies.",
  payload: {
    target: null, //current adlib
    phase: 0, // 0:get user input, 1:display for player to pick, 2:result,
    userInput: ['one', 'funk', 'wunky', 'donk', 'steve']
  },
  init: function () {
    this.payload.target = prompts[Math.floor(Math.random() * prompts.length)];
    return true;
  },
  getRendererPlayer: function () {
    return "/game_modules/madlib_player.umd.min.js";
  },
  getPayload: function () {
    return this.payload;
  },
  getRendererAdmin: function () {
    return 5;
  },
  submitUserInput: function (payload) {
    return 'h';
  },
}