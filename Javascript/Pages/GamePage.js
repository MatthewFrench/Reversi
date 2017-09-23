class GamePage {
  constructor(reversiGame) {
    this.reversiGame = reversiGame;
    this.canvasBoard = new CanvasBoard(this);
    this.mainDiv = document.createElement('div');
    this.mainDiv.className = 'GamePage';
    this.mainDiv.appendChild(this.canvasBoard.getDiv());
  }

  /**
   * Called when the game page is shown on the screen.
   */
  show() {

  }

  /**
   * Called when the game page is hidden.
   */
  hide() {

  }

  /**
   * Returns the main div of the game page.
   * @returns {Element|*}
   */
  getDiv() {
    return this.mainDiv;
  }
}