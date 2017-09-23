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
    this.gameDataLogic = new GameLogic();

    this.highlightDiskX = null;
    this.highlightDiskY = null;

    this.moves = [];

    window.addEventListener('resize', Utility.CreateFunction(this, this.windowResize));
    window.requestAnimationFrame(()=>{this.windowResize();});

    this.setupCanvas();
  }

  /**
   * Set the canvas scaling based on the window size.
   */
  windowResize() {
    if (window.innerWidth > window.innerHeight - 30) {
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
    this.containerDiv = document.createElement('div');
    this.containerDiv.className = 'ContainerDiv';
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('mousemove', Utility.CreateFunction(this, this.hoverOverDisk));
    this.canvas.addEventListener('mousedown', Utility.CreateFunction(this, this.mouseDown));
    this.canvas.addEventListener('mouseup', Utility.CreateFunction(this, this.mouseUp));
    this.canvas.width = this.gameDataLogic.state.board[0].length * 100;
    this.canvas.height = this.gameDataLogic.state.board.length * 100;
    this.containerDiv.appendChild(this.canvas);
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

    //Apply all valid moves
    let appliedMoves = 0;
    for (let move of this.moves) {
      if (move.landingX === x && move.landingY === y) {
        this.gameDataLogic.applyMove(move);
        appliedMoves += 1;
      }
    }
    //Next turn if we made a move
    if (appliedMoves > 0) {
      this.gameDataLogic.nextTurn();
      this.getMoves();
      this.updateGameStatusMessage();
    }

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

    for (let move of this.moves) {
      if (move.landingX === x && move.landingY === y) {
        this.highlightDiskX = x;
        this.highlightDiskY = y;
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

  /**
   * Updates the top message.
   */
  updateGameStatusMessage() {
    let victory = this.gameDataLogic.checkForVictory();
    if (victory === null) {
      if (this.gameDataLogic.getTurn() === 'b') {
        this.setMessage('Black\'s Turn');
      } else {
        this.setMessage('White\'s Turn');
      }
    } else {
      if (victory === 'black wins') {
        this.setMessage('Black has Won!');
      } else if (victory === 'white wins') {
        this.setMessage('White has Won!');
      } else {
        this.setMessage('Draw!');
      }
    }
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

    //Draw possible moves

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
          if (piece /*&&
            !(this.dragCheckerX === x && this.dragCheckerY === y)*/) {
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
    for (let y = 0; y < this.gameDataLogic.state.board.length; y+=1) {
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

  /**
   * Returns the canvas board div element.
   * @returns {Element|*}
   */
  getDiv() {
    return this.mainDiv;
  }
}