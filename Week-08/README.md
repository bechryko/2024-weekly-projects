# Password Game

This is a simple variant of the famous Password Game, implemented in C. The motivation behind this was a peer-review task for the university course Basics of Programming, where I am a demonstrator. I made a simple example solution for the first students to review, but I decided to refactor it a little and make it this week's project.

## Compilation and start

The Makefile helps you compile and start the program. The Makefile is made for Windows, but compilation for Linux shouldn't be too hard, you only have to remove the `.exe` extensions from the Makefile (also modify the `clean` target a little bit).
`make`: compiles the game
`make run`: compiles and runs the game
`make run hu`: compiles the game and runs it in Hungarian language
`make clean`: removes the compiled file
