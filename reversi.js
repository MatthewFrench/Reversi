var reversiGame = null;

/** @function main
 * Entry point to the program.
 * Starts the game.
 */
function main() {
  reversiGame = new ReversiGame();
  document.body.appendChild(reversiGame.getDiv());
  reversiGame.show();
}

//Initializes the game
window.onload = function () {
  main();
};