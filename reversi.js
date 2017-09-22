// checkers.js
var currentBoard = null;

/** @function main
 * Entry point to the program.
 * Starts the checkers game.
 */
function main() {
  currentBoard = new CanvasBoard();
  currentBoard.setupCanvas();
}

//Initializes either a web canvas or the console canvas
window.onload = function () {
  main();
};