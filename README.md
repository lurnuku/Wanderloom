# Wanderloom

An almost real-time multiplayer maze exploration game where two players must collaborate to navigate through a maze. Created because I wanted to try out websockets.

#### TO DO
- DONE - at launch, show the shared cursor in the middle of the screen
- DONE - remove own cursor, leave just the shared one and other user's one
- DONE: let players choose their ghost color
- DONE - wall detection with svg-path-bounds or getBoundingClientRect()
- DONE - review the logic for setting up the state (position) at launch
- DONE - names need to float above cursors.
- DONE - restrict username to idk how many characters and set the first letter to float

- graphical interface (svg of a maze)
- on the client -> if players === 2 only then render the start button
- set up one maze for max two players ("rooms") -> a room-based system where each room allows 2 players, and new pairs of players will be assigned to new rooms
- button that will start the game, doesn't have to be button, could be some "place" on the page where both of the players hover for about 4 seconds, it will start the game, there will be some visible timer of how long left till the game starts like a glass getting full or something