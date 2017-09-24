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
    this.playButtonDiv = document.createElement('div');
    this.playButtonDiv.className = 'PlayButton';
    this.playButtonDiv.innerText = 'Play';
    this.playButtonDiv.addEventListener('mouseup', ()=>{this.playButtonClicked();});
    this.playButtonDiv.addEventListener('touchend', (e)=>{this.playButtonClicked();e.preventDefault();});
    this.mainDiv.appendChild(this.playButtonDiv);

    //Create guideline buttons
    this.withGuidelineDiv = document.createElement('div');
    this.withGuidelineDiv.className = 'WithGuidelineButton';
    this.withGuidelineDiv.innerText = 'With Guidelines';
    this.withGuidelineDiv.addEventListener('mouseup', ()=>{this.withGuidelinesClicked();});
    this.withGuidelineDiv.addEventListener('touchend', (e)=>{this.withGuidelinesClicked();e.preventDefault();});

    this.withoutGuidelineDiv = document.createElement('div');
    this.withoutGuidelineDiv.className = 'WithoutGuidelineButton';
    this.withoutGuidelineDiv.innerText = 'Without Guidelines';
    this.withoutGuidelineDiv.addEventListener('mouseup', ()=>{this.withoutGuidelinesClicked();});
    this.withoutGuidelineDiv.addEventListener('touchend', (e)=>{this.withoutGuidelinesClicked();e.preventDefault();});

    //Create play with buttons
    this.playPVP = document.createElement('div');
    this.playPVP.className = 'PlayPVPButton';
    this.playPVP.innerText = 'Player v Player';
    this.playPVP.addEventListener('mouseup', ()=>{this.playPVPButtonClicked();});
    this.playPVP.addEventListener('touchend', (e)=>{this.playPVPButtonClicked();e.preventDefault();});

    this.playPlayerAgainstAI = document.createElement('div');
    this.playPlayerAgainstAI.className = 'PlayPlayerAgainstAIButton';
    this.playPlayerAgainstAI.innerText = 'Player v AI';
    this.playPlayerAgainstAI.addEventListener('mouseup', ()=>{this.playPlayerAgainstAIButtonClicked();});
    this.playPlayerAgainstAI.addEventListener('touchend', (e)=>{this.playPlayerAgainstAIButtonClicked();e.preventDefault();});

    this.playAIAgainstAI = document.createElement('div');
    this.playAIAgainstAI.className = 'PlayAIAgainstAIButton';
    this.playAIAgainstAI.innerText = 'AI v AI';
    this.playAIAgainstAI.addEventListener('mouseup', ()=>{this.playAIAgainstAIButtonClicked();});
    this.playAIAgainstAI.addEventListener('touchend', (e)=>{this.playAIAgainstAIButtonClicked();e.preventDefault();});

    this.showGuideline = false;
    this.playMode = 0;
  }

  /**
   * Handles play button click.
   */
  playButtonClicked() {
    this.playButtonDiv.remove();

    this.mainDiv.appendChild(this.withGuidelineDiv);
    this.mainDiv.appendChild(this.withoutGuidelineDiv);
  }

  withGuidelinesClicked() {
    this.withGuidelineDiv.remove();
    this.withoutGuidelineDiv.remove();

    this.mainDiv.appendChild(this.playPVP);
    this.mainDiv.appendChild(this.playPlayerAgainstAI);
    this.mainDiv.appendChild(this.playAIAgainstAI);

    this.showGuideline = true;
  }

  withoutGuidelinesClicked() {
    this.withGuidelineDiv.remove();
    this.withoutGuidelineDiv.remove();

    this.mainDiv.appendChild(this.playPVP);
    this.mainDiv.appendChild(this.playPlayerAgainstAI);
    this.mainDiv.appendChild(this.playAIAgainstAI);

    this.showGuideline = false;
  }

  playPVPButtonClicked() {
    this.playMode = PlayMode.PlayerVsPlayer;

    this.reversiGame.switchToGamePage(this.showGuideline, this.playMode);
  }

  playPlayerAgainstAIButtonClicked() {
    this.playMode = PlayMode.PlayerVsAI;

    this.reversiGame.switchToGamePage(this.showGuideline, this.playMode);
  }

  playAIAgainstAIButtonClicked() {
    this.playMode = PlayMode.AIVsAI;

    this.reversiGame.switchToGamePage(this.showGuideline, this.playMode);
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