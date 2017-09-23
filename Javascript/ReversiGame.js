class ReversiGame {
  constructor() {
    this.currentPage = null;
    this.titlePage = new TitlePage(this);
    this.gamePage = new GamePage(this);

    this.mainDiv = document.createElement('div');
    this.mainDiv.className = 'ReversiGame';
  }

  /**
   * Switches to the title page.
   */
  switchToTitlePage() {
    if (this.currentPage !== null) {
      this.currentPage.hide();
    }
    Utility.RemoveElements(this.mainDiv);
    this.mainDiv.appendChild(this.titlePage.getDiv());
    this.currentPage = this.titlePage;
    this.titlePage.show();
  }

  /**
   * Switches to the game page.
   */
  switchToGamePage(showGuidelines, playMode) {
    if (this.currentPage !== null) {
      this.currentPage.hide();
    }
    Utility.RemoveElements(this.mainDiv);
    this.mainDiv.appendChild(this.gamePage.getDiv());
    this.currentPage = this.gamePage;
    this.gamePage.show(showGuidelines, playMode);
  }

  /**
   * Called when the game is shown.
   */
  show() {
    this.switchToTitlePage();
  }

  /**
   * Returns the main div of the game.
   * @returns {Element|*}
   */
  getDiv() {
    return this.mainDiv;
  }
}