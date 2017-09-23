class TitlePage {
  constructor(reversiGame) {
    this.reversiGame = reversiGame;

    this.mainDiv = document.createElement('div');
    this.mainDiv.className = 'TitlePage';

    //Create title
    let titleDiv = document.createElement('div');
    titleDiv.className = 'TitleDiv';
    let firstLetter = document.createElement('div');
    firstLetter.className = 'TitleFirstLetter';
    firstLetter.innerText = 'R';
    titleDiv.appendChild(firstLetter);
    let otherLetters = document.createElement('span');
    otherLetters.innerText = 'eversi';
    titleDiv.appendChild(otherLetters);
    this.mainDiv.appendChild(titleDiv);

    //Create play button
    let playButtonDiv = document.createElement('div');
    playButtonDiv.className = 'PlayButton';
    playButtonDiv.innerText = 'Play';
    playButtonDiv.addEventListener('mouseup', ()=>{this.playButtonClicked();});
    this.mainDiv.appendChild(playButtonDiv);
  }

  /**
   * Handles play button click.
   */
  playButtonClicked() {
    this.reversiGame.switchToGamePage();
  }

  /**
   * Called when the title page is shown.
   */
  show() {

  }

  /**
   * Called when the title page is hidden.
   */
  hide() {

  }

  /**
   * Returns the main div of the title page.
   * @returns {Element|*}
   */
  getDiv() {
    return this.mainDiv;
  }
}