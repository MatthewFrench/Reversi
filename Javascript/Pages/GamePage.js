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
  show(showGuidelines, playMode) {
    this.canvasBoard.setShowGuidelines(showGuidelines);
    this.canvasBoard.setPlayMode(playMode);
    this.canvasBoard.renderBoard();
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