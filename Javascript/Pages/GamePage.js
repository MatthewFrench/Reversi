class GamePage {
  constructor(reversiGame) {
    this.reversiGame = reversiGame;
    this.canvasBoard = new CanvasBoard(this);
    this.mainDiv = document.createElement('div');
    this.mainDiv.className = 'GamePage';
    this.mainDiv.appendChild(this.canvasBoard.getDiv());

    this.restartDiv = document.createElement('div');
    this.restartDiv.className = 'RestartGame';
    this.restartButton = document.createElement('div');
    this.restartButton.className = 'RestartGameButton';
    this.restartDiv.appendChild(this.restartButton);
    this.restartButton.addEventListener('click', () => {this.restartButtonClicked();});
    this.restartButton.innerText = 'Restart?';

    window.addEventListener('resize', Utility.CreateFunction(this, this.windowResize));
    window.requestAnimationFrame(()=>{this.windowResize();});
  }

  /**
   * Set the button scaling based on the window size.
   */
  windowResize() {
    if (window.innerWidth > window.innerHeight - 30 - 30) {
      //Set the canvas to scale by height
      if (!this.mainDiv.classList.contains('ScreenGreaterWidth')) {
        this.mainDiv.classList.remove('ScreenGreaterHeight');
        this.mainDiv.classList.add('ScreenGreaterWidth');
      }
    } else {
      //Set the canvas to scale by width
      if (!this.mainDiv.classList.contains('ScreenGreaterHeight')) {
        this.mainDiv.classList.remove('ScreenGreaterWidth');
        this.mainDiv.classList.add('ScreenGreaterHeight');
      }
    }
  }

  showRestartButton() {
    this.mainDiv.appendChild(this.restartDiv);
  }

  reset() {
    this.restartDiv.remove();
    this.canvasBoard.reset();
  }

  restartButtonClicked() {
    this.reversiGame.switchToTitlePage();
  }

  /**
   * Called when the game page is shown on the screen.
   */
  show(showGuidelines, playMode) {
    this.reset();
    this.canvasBoard.setShowGuidelines(showGuidelines);
    this.canvasBoard.setPlayMode(playMode);
    this.canvasBoard.renderBoard();
    if (playMode === PlayMode.AIVsAI) {
      this.canvasBoard.runAI();
    }
    window.requestAnimationFrame(()=>{this.windowResize();});
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