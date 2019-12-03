this folder is 4 source files. put the js in here, point the js to the build vue files

vue files cannot use css normally, must be assigned per-element in the html. we're sorry, we don't like it either.

the file @/client/compileComponentEasy takes 1 arg, the relative path/prefix for the target vue files. with this, targets ends must be '_admin.vue' AND '_player.vue'.
for example, to build the madlib game, the command is
      ./compileComponentEasy skr/madlib
games built by this method are automatically placed in 'game_modules' and are therefore ready to be read

otherwise, @/client/compileComponent takes one argument: the file to build


if you have any questions, reach out on insta/twitter: @bradseeker
as expected, bugs should be logged via github
