module.exports = {
  name: "Madlibs",
  author: "brad, seeker",
  description: "hey hey we're the monkies.",
  vars: {
    prompt: "The fat cat {{isConnected}}."
  },
  init: function () {
    return 5;
  },
  getRenderDataPlayer: function () {
    return `<h1> hey </h1>`;
  },
  getRenderDataAdmin: function () {
    return 5;
  },
  submitUserInput: function (payload) {
    return 'h';
  },
}