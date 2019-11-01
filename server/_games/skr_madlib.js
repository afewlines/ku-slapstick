module.exports = {
  name: "Madlibs",
  author: "brad, seeker",
  description: "hey hey we're the monkies.",
  vars: {
    prompt: "The fat cat {{}}."
  },
  init: function () {
    return 5;
  },
  getRendererPlayer: function () {
    return "/game_modules/madlib_player.vue.umd.min.js";
  },
  getRendererAdmin: function () {
    return 5;
  },
  submitUserInput: function (payload) {
    return 'h';
  },
}