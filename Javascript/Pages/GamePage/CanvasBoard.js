/**
 * Handles all canvas drawing logic.
 */
class CanvasBoard {
  constructor(gamePage) {
    this.gamePage = gamePage;
    this.mainDiv = document.createElement('div');
    this.mainDiv.className = 'CanvasBoardDiv';
    this.ctx = null;
    this.canvas = null;
    this.containerDiv = null;
    this.messageDiv = null;
    this.scoreDiv = null;
    this.gameDataLogic = new GameLogic();

    this.highlightDiskX = null;
    this.highlightDiskY = null;

    this.moves = [];

    this.flippingPieces = [];

    this.showGuidelines = true;
    this.playMode = PlayMode.PlayerVsPlayer;

    this.existingAnimationRequest = null;

    window.addEventListener('resize', Utility.CreateFunction(this, this.windowResize));
    window.requestAnimationFrame(()=>{this.windowResize();});

    this.setupCanvas();
  }


  setShowGuidelines(showGuidelines) {
    this.showGuidelines = showGuidelines;
  }

  setPlayMode(playMode) {
    this.playMode = playMode;
  }

  /**
   * Set the canvas scaling based on the window size.
   */
  windowResize() {
    if (window.innerWidth > window.innerHeight - 30 - 30) {
      //Set the canvas to scale by height
      if (!this.canvas.classList.contains('CanvasGreaterWidth')) {
        this.canvas.classList.remove('CanvasGreaterHeight');
        this.canvas.classList.add('CanvasGreaterWidth');
      }
    } else {
      //Set the canvas to scale by width
      if (!this.canvas.classList.contains('CanvasGreaterHeight')) {
        this.canvas.classList.remove('CanvasGreaterWidth');
        this.canvas.classList.add('CanvasGreaterHeight');
      }
    }
  }

  /**
   * Sets up the HTML5 canvas.
   */
  setupCanvas() {
    this.messageDiv = document.createElement('div');
    this.messageDiv.className = 'MessageDiv';
    this.scoreDiv = document.createElement('div');
    this.scoreDiv.className = 'ScoreDiv';
    this.containerDiv = document.createElement('div');
    this.containerDiv.className = 'ContainerDiv';
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('mousemove', Utility.CreateFunction(this, this.hoverOverDisk));
    this.canvas.addEventListener('mousedown', Utility.CreateFunction(this, this.mouseDown));
    this.canvas.addEventListener('mouseup', Utility.CreateFunction(this, this.mouseUp));
    this.canvas.width = this.gameDataLogic.state.board[0].length * 100;
    this.canvas.height = this.gameDataLogic.state.board.length * 100;
    this.containerDiv.appendChild(this.canvas);
    this.mainDiv.appendChild(this.scoreDiv);
    this.mainDiv.appendChild(this.messageDiv);
    this.mainDiv.appendChild(this.containerDiv);
    this.ctx = this.canvas.getContext('2d');

    this.windowResize();

    this.getMoves();

    this.renderBoard();

    this.updateGameStatusMessage();
  }

  /**
   * Gets the current legal moves for the turn.
   */
  getMoves() {
    this.moves = this.gameDataLogic.getAllLegalMovesForColor(this.gameDataLogic.getTurn());
  }

  /**
   * Handles mouse down logic.
   * @param event
   */
  mouseDown(event) {
    let x = this.getCanvasMouseX(event);
    let y = this.getCanvasMouseY(event);

    let allowDoStuff = false;
    if (this.playMode === PlayMode.PlayerVsPlayer) {
      allowDoStuff = true;
    }
    if (this.playMode === PlayMode.PlayerVsAI && this.gameDataLogic.getTurn() === 'b') {
      allowDoStuff = true;
    }
    if (allowDoStuff) {
      this.applyMovesOn(x, y);
    }

    //Redraw
    this.renderBoard();
  }

  applyMovesOn(x, y) {
    //Apply all valid moves
    let appliedMoves = 0;
    for (let move of this.moves) {
      if (move.landingX === x && move.landingY === y) {
        this.gameDataLogic.applyMove(move);
        appliedMoves += 1;
        //Add all captured pieces to the flipping array
        for (let capture of move.captured) {
          let flip = {
            x: capture.x, y: capture.y, percent: 0.0,
            from: this.gameDataLogic.getTurn() === 'b' ? 'w' : 'b',
            to: this.gameDataLogic.getTurn()
          };
          this.flippingPieces.push(flip);
        }
      }
    }
    //Next turn if we made a move
    if (appliedMoves > 0) {
      this.nextTurn();
    }
  }

  nextTurn() {
    this.gameDataLogic.nextTurn();
    this.getMoves();
    this.updateGameStatusMessage();
    if ((this.playMode === PlayMode.PlayerVsAI &&
      this.gameDataLogic.getTurn() === 'w') ||
      this.playMode === PlayMode.AIVsAI) {
      this.runAI()
    }
  }

  runAI() {
    //Loop through entire grid and find the landing
    //With the most benefit
    let bestLandingX = -1;
    let bestLandingY = -1;
    let bestCaptureCount = 0;
    for (let y = 0; y < this.gameDataLogic.state.board.length; y+=1) {
      for (let x = 0; x < this.gameDataLogic.state.board[y].length; x += 1) {
        let captureCount = 0;
        for (let move of this.moves) {
          if (move.landingX === x && move.landingY === y) {
            captureCount += 1;
          }
        }
        //If there is a corner piece, take it like a mad man.
        if (captureCount > 0 && ((x === 0 && y ===0) ||
            (x === 0 &&
                y === this.gameDataLogic.state.board.length - 1) ||
            (x === this.gameDataLogic.state.board[0].length - 1 &&
                y === 0) ||
            (x === this.gameDataLogic.state.board[0].length - 1 &&
                y === this.gameDataLogic.state.board.length - 1))) {
          bestCaptureCount = 15;
          bestLandingX = x;
          bestLandingY = y;
        } else {
          //Add a slight randomness so no AI choice is the same.
          if ((captureCount >= bestCaptureCount && Math.random() > 0.5) ||
            captureCount > bestCaptureCount) {
            bestCaptureCount = captureCount;
            bestLandingX = x;
            bestLandingY = y;
          }
        }
      }
    }

    //Give AI a delay so it isn't instant
    setTimeout(()=>{
      this.highlightDiskX = bestLandingX;
      this.highlightDiskY = bestLandingY;
      //Redraw
      this.renderBoard();
      setTimeout(()=>{
        this.applyMovesOn(bestLandingX, bestLandingY);
        //Redraw
        this.renderBoard();
      }, 500);
    }, this.showGuidelines ? 500 : 250);

    //Redraw
    this.renderBoard();
  }

  /**
   * Event for hovering over the checker board.
   * @param event
   */
  hoverOverDisk(event) {
    //Get mouse position
    let x = this.getCanvasMouseX(event);
    let y = this.getCanvasMouseY(event);

    this.highlightDiskX = null;
    this.highlightDiskY = null;


    let allowDoStuff = false;
    if (this.playMode === PlayMode.PlayerVsPlayer) {
      allowDoStuff = true;
    }
    if (this.playMode === PlayMode.PlayerVsAI && this.gameDataLogic.getTurn() === 'b') {
      allowDoStuff = true;
    }
    if (allowDoStuff) {
      for (let move of this.moves) {
        if (move.landingX === x && move.landingY === y) {
          this.highlightDiskX = x;
          this.highlightDiskY = y;
        }
      }
    }

    //Redraw
    this.renderBoard();
  }

  /**
   * Handles the mouse up event.
   * @param event
   */
  mouseUp() {
    //Redraw
    this.renderBoard();
  }

  /**
   * Sets the message of the message div.
   * @param text
   */
  setMessage(text) {
    this.messageDiv.innerText = text;
  }

  setScore(text) {
    this.scoreDiv.innerText = text;
  }

  /**
   * Updates the top message.
   */
  updateGameStatusMessage() {
    let statusText = '';
    let victory = this.gameDataLogic.checkForVictory();
    if (victory === null) {
      if (this.gameDataLogic.getTurn() === 'b') {
        statusText = 'Black\'s Turn';
      } else {
        statusText = 'White\'s Turn';
      }
    } else {
      if (victory === 'black wins') {
        statusText = 'Black has Won!';
      } else if (victory === 'white wins') {
        statusText = 'White has Won!';
      } else {
        statusText = 'Draw!';
      }
    }
    let scoreText = 'Black: ' +
      this.gameDataLogic.getPieceCount('b') + ' - White: ' +
      this.gameDataLogic.getPieceCount('w');
    this.setMessage(statusText);
    this.setScore(scoreText);
  }

  /**
   * Returns the mouse X position on the canvas.
   * @param event
   */
  getCanvasMouseX(event) {
    //Get mouse position
    let bounds = event.target.getBoundingClientRect();
    let mouseX = event.clientX - bounds.left;
    mouseX = mouseX * this.canvas.width / bounds.width;
    return Math.floor(mouseX / 100);
  }

  /**
   * Returns the mouse Y position on the canvas.
   * @param event
   */
  getCanvasMouseY(event) {
    //Get mouse position
    let bounds = event.target.getBoundingClientRect();
    let mouseY = event.clientY - bounds.top;
    mouseY = mouseY * this.canvas.height / bounds.height;
    return Math.floor(mouseY / 100);
  }

  /**
   * Redraws the entire checker board.
   */
  renderBoard() {
    this.ctx.fillStyle = 'lightgray';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //Draw grid
    for (let y = 0; y < this.gameDataLogic.state.board.length; y+=1) {
      for (let x = 0; x < this.gameDataLogic.state.board[y].length; x += 1) {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 1.0;
        this.ctx.strokeRect(x * 100, y * 100, 100, 100);
      }
    }

    //Draw pieces
    for (let y = 0; y < this.gameDataLogic.state.board.length; y+=1) {
      for (let x = 0; x < this.gameDataLogic.state.board[y].length; x+=1) {
          let piece = this.gameDataLogic.getPiece(x, y);
          let isFlipping = false;
          let flippingPiece = null;
          for (let flip of this.flippingPieces) {
            if (flip.x === x && flip.y === y) {
              isFlipping = true;
              flippingPiece = flip;
              break;
            }
          }
          if (piece) {
            if (isFlipping) {
              //Draw the flipping piece to animate it
              let fromPiece = flippingPiece.from;
              let animationPercent = flippingPiece.percent;
              if (fromPiece === "w") {
                if (animationPercent < 0.5) {
                  this.ctx.fillStyle = 'white';
                } else {
                  this.ctx.fillStyle = 'black';
                }
              } else {
                if (animationPercent < 0.5) {
                  this.ctx.fillStyle = 'black';
                } else {
                  this.ctx.fillStyle = 'white';
                }
              }
              let heightPercent = 0.0;
              if (animationPercent < 0.5) {
                heightPercent = 1.0 - animationPercent * 2;
              } else {
                heightPercent = 1.0 - ((1.0 - animationPercent) * 2);
              }
              this.ctx.strokeStyle = 'black';
              this.ctx.beginPath();
              this.ctx.ellipse(x*100 + 50, y * 100 + 50, 40, 40 * heightPercent, 0, 0, Math.PI * 2);
              this.ctx.fill();
              this.ctx.lineWidth = 1;
              this.ctx.stroke();
            } else {
              if (piece === "w" || piece === "wk") {
                this.ctx.fillStyle = 'white';
              } else if (piece === "b" || piece === "bk") {
                this.ctx.fillStyle = 'black';
              }
              this.ctx.strokeStyle = 'black';
              this.ctx.beginPath();
              this.ctx.arc(x*100 + 50, y * 100 + 50, 40, 40, 0, Math.PI * 2);
              this.ctx.fill();
              this.ctx.lineWidth = 1;
              this.ctx.stroke();
            }
          }
      }
    }

    //Draw highlighted pieces
    if (this.highlightDiskX !== null) {
      for (let move of this.moves) {
          if (move.landingX === this.highlightDiskX &&
            move.landingY === this.highlightDiskY) {
            this.ctx.fillStyle = 'red';
            this.ctx.beginPath();
            this.ctx.arc(this.highlightDiskX*100 + 50,
              this.highlightDiskY * 100 + 50, 25, 25, 0, Math.PI * 2);
            this.ctx.fill();

            //Draw pink for any disks this will capture
            let captured = move.captured;
            for (let capture of captured) {
              this.ctx.fillStyle = 'pink';
              this.ctx.beginPath();
              this.ctx.arc(capture.x*100 + 50,
                capture.y * 100 + 50, 25, 25, 0, Math.PI * 2);
              this.ctx.fill();
            }
          }
      }
    }

    //Draw the possible move outlines on top of pieces
    if (this.showGuidelines) {
      for (let y = 0; y < this.gameDataLogic.state.board.length; y += 1) {
        for (let x = 0; x < this.gameDataLogic.state.board[y].length; x += 1) {
          for (let move of this.moves) {
            if (move.landingX === x && move.landingY === y) {
              this.ctx.lineWidth = 10.0;
              this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
              this.ctx.beginPath();
              this.ctx.arc(move.landingX * 100 + 50, move.landingY * 100 + 50, 30, 35, 0, Math.PI * 2);
              this.ctx.stroke();

              this.ctx.beginPath();
              this.ctx.arc(move.originX * 100 + 50, move.originY * 100 + 50, 35, 30, 0, Math.PI * 2);
              this.ctx.stroke();

              //Draw direction
              let originX = move.originX;
              let originY = move.originY;
              let landingX = move.landingX;
              let landingY = move.landingY;
              let originXOffset = 0;
              let originYOffset = 0;
              let landingXOffset = 0;
              let landingYOffset = 0;
              let circleRadius = 30;
              let circleRadiusDiagonal = 30 / Math.sqrt(2);
              switch (move.direction) {
                case Direction.Left:
                  originXOffset -= circleRadius;
                  landingXOffset += circleRadius;
                  break;
                case Direction.Right:
                  originXOffset += circleRadius;
                  landingXOffset -= circleRadius;
                  break;
                case Direction.Up:
                  originYOffset -= circleRadius;
                  landingYOffset += circleRadius;
                  break;
                case Direction.Down:
                  originYOffset += circleRadius;
                  landingYOffset -= circleRadius;
                  break;
                case Direction.UpLeft:
                  originXOffset -= circleRadiusDiagonal;
                  landingXOffset += circleRadiusDiagonal;
                  originYOffset -= circleRadiusDiagonal;
                  landingYOffset += circleRadiusDiagonal;
                  break;
                case Direction.UpRight:
                  originXOffset += circleRadiusDiagonal;
                  landingXOffset -= circleRadiusDiagonal;
                  originYOffset -= circleRadiusDiagonal;
                  landingYOffset += circleRadiusDiagonal;
                  break;
                case Direction.DownLeft:
                  originXOffset -= circleRadiusDiagonal;
                  landingXOffset += circleRadiusDiagonal;
                  originYOffset += circleRadiusDiagonal;
                  landingYOffset -= circleRadiusDiagonal;
                  break;
                case Direction.DownRight:
                  originXOffset += circleRadiusDiagonal;
                  landingXOffset -= circleRadiusDiagonal;
                  originYOffset += circleRadiusDiagonal;
                  landingYOffset -= circleRadiusDiagonal;
                  break;
              }
              this.ctx.beginPath();
              this.ctx.lineWidth = 10.0;
              this.ctx.moveTo(originX * 100 + 50 + originXOffset,
                originY * 100 + 50 + originYOffset);
              this.ctx.lineTo(landingX * 100 + 50 + landingXOffset,
                landingY * 100 + 50 + landingYOffset);
              this.ctx.stroke();
            }
          }
        }
      }
    }
    if (this.flippingPieces.length > 0) {
      //Loop through flipping pieces
      for (let flip of this.flippingPieces) {
        flip.percent += 1.0 / 25.0;
      }
      //Remove all finished flips
      this.flippingPieces = this.flippingPieces.filter( function(flip) {
        return flip.percent <= 1.0;
      });

      //Redraw on next frame for animations
      if (this.existingAnimationRequest !== null) {
        window.cancelAnimationFrame(this.existingAnimationRequest);
        this.existingAnimationRequest = null;
      }
      this.existingAnimationRequest = window.requestAnimationFrame(()=>{this.renderBoard();});
    }
  }

  /**
   * Returns the canvas board div element.
   * @returns {Element|*}
   */
  getDiv() {
    return this.mainDiv;
  }
}