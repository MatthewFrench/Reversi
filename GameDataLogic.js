Direction = {
  Up : 0,
  Down : 1,
  Left : 2,
  Right: 3,
  UpLeft: 4,
  UpRight: 5,
  DownLeft: 6,
  DownRight: 7
};

class GameDataLogic {
  constructor() {
    /** The state of the game */
    this.state = {
      over: false,
      turn: 'b',
      board: [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, 'w', 'b', null, null, null],
        [null, null, null, 'b', 'w', null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
      ]
    };
  }

  getTurn() {
    return this.state.turn;
  }

  doesPieceBelongToPlayer(x, y) {
    let piece = this.getPiece(x, y);
    return (piece != null && piece.charAt(0) === this.state.turn);
  }

  /**
   * Returns an array of all legal moves on the board for a color.
   * @param color
   * @returns {Array}
   */
  getAllLegalMovesForColor(color) {
    let moves = [];
    for (let y = 0; y < this.state.board.length; y++) {
      for (let x = 0; x < this.state.board[y].length; x++) {
        let piece = this.getPiece(x, y);
        if (piece === color) {
          this.addLegalMovesForPieceToArray(moves, piece, x, y);
        }
      }
    }
    return moves;
  }

  /** @function addLegalMovesForPieceToArray
   * Adds a list of legal moves for the specified
   * piece to make.
   *
   * Return format:
   * [{
   *    originX - Start X
   *    originY - Start Y
   *    originPiece - Piece Color
   *    direction - Direction Number
   *    captured [ - Array of captured pieces
   *        {
   *          capturedX,
   *          capturedY
   *        }
   *    ],
   *    landingX - Final X,
   *    landingY - Final Y
   * }]
   *
   */
  addLegalMovesForPieceToArray(moves, piece, x, y) {
    this.addLegalMovesForPieceInDirectionToArray(moves, piece, x, y, Direction.Up);
    this.addLegalMovesForPieceInDirectionToArray(moves, piece, x, y, Direction.Down);
    this.addLegalMovesForPieceInDirectionToArray(moves, piece, x, y, Direction.Left);
    this.addLegalMovesForPieceInDirectionToArray(moves, piece, x, y, Direction.Right);
    this.addLegalMovesForPieceInDirectionToArray(moves, piece, x, y, Direction.UpRight);
    this.addLegalMovesForPieceInDirectionToArray(moves, piece, x, y, Direction.UpLeft);
    this.addLegalMovesForPieceInDirectionToArray(moves, piece, x, y, Direction.DownRight);
    this.addLegalMovesForPieceInDirectionToArray(moves, piece, x, y, Direction.DownLeft);
  }

  addLegalMovesForPieceInDirectionToArray(moves, piece, x, y, direction) {
    let move = {
      originX : x,
      originY : y,
      originPiece: piece,
      direction : direction,
      captured : [],
      landingX: null,
      landingY: null
    };

    let currentX = x;
    let currentY = y;
    let isCompleted = false;
    while (isCompleted === false) {
      currentX = this.getNextXLocation(currentX, direction);
      currentY = this.getNextYLocation(currentY, direction);

      if (this.isPositionOnBoard(currentX, currentY) === false) {
        isCompleted = true;
        break;
      }
      //If space is empty, we need to end
      if (this.isSpaceEmpty(currentX, currentY)) {
        //If we captured a piece, set the landing
        if (move.captured.length > 0) {
          move.landingX = currentX;
          move.landingY = currentY;
        }
        isCompleted = true;
        break;
      }
      //If space is self, we need to end
      if (this.getPiece(currentX, currentY) === piece) {
        isCompleted = false;
      } else {
        //We ran over a piece that is not ourselves, lets capture it
        move.captured.push({x: currentX, y: currentY});
      }
    }

    //If the move has a landing, it is valid so add it
    if (move.landingX != null) {
      moves.push(move);
    }
  }

  isPositionOnBoard(x, y) {
    return (x >= 0 && y >= 0 &&
      y <= this.state.board.length - 1 &&
      x <= this.state.board[y].length - 1);
  }

  isSpaceEmpty(x, y) {
    return this.getPiece(x,y) === null;
  }

  getNextXLocation(x, direction) {
    switch (direction) {
      case Direction.DownLeft:
      case Direction.UpLeft:
      case Direction.Left:
        x -= 1;
        break;
      case Direction.DownRight:
      case Direction.UpRight:
      case Direction.Right:
        x += 1;
        break;
    }
    return x;
  }

  getNextYLocation(y, direction) {
    switch (direction) {
      case Direction.UpRight:
      case Direction.UpLeft:
      case Direction.Up:
        y -= 1;
        break;
      case Direction.DownRight:
      case Direction.DownLeft:
      case Direction.Down:
        y += 1;
        break;
    }
    return y;
  }

  /** @function checkSlide
   * A helper function to check if a slide move is legal.
   * If it is, it is added to the moves array.
   * @param {Array} moves - the list of legal moves
   * @param {integer} x - the x position of the movement
   * @param {integer} y - the y position of the movement
   */
  checkSlide(moves, x, y) {
    // Check square is on grid
    if (x < 0 || x > this.state.board[0].length - 1
      || y < 0 || y > this.state.board.length - 1) return;
    // check square is unoccupied
    if (this.getPiece(x, y)) return;
    // legal move!  Add it to the move list
    moves.push({type: 'slide', x: x, y: y});
  }

  /** @function copyJumps
   * A helper function to clone a jumps object
   * @param {Object} jumps - the jumps to clone
   * @returns The cloned jump object
   */
  copyJumps(jumps) {
    // Use Array.prototype.slice() to create a copy
    // of the landings and captures array.
    var newJumps = {
      landings: jumps.landings.slice(),
      captures: jumps.captures.slice()
    };
    return newJumps;
  }

  getPiece(x, y) {
    return this.state.board[y][x];
  }

  setPiece (x, y, value) {
    this.state.board[y][x] = value;
  }

  /** @function checkJump
   * A recursive helper function to determine legal jumps
   * and add them to the moves array
   * @param {Array} moves - the moves array
   * @param {Object} jumps - an object describing the
   *  prior jumps in this jump chain.
   * @param {String} piece - 'b' or 'w' for black or white pawns,
   *    'bk' or 'wk' for white or black kings
   * @param {integer} x - the current x position of the piece
   * @param {integer} y - the current y position of the peice
   */
  checkJump(moves, jumps, piece, x, y) {
    switch (piece) {
      case 'b': // black can only move down the board diagonally
        this.checkLanding(moves, this.copyJumps(jumps), piece, x - 1, y - 1, x - 2, y - 2);
        this.checkLanding(moves, this.copyJumps(jumps), piece, x + 1, y - 1, x + 2, y - 2);
        break;
      case 'w':  // white can only move up the board diagonally
        this.checkLanding(moves, this.copyJumps(jumps), piece, x - 1, y + 1, x - 2, y + 2);
        this.checkLanding(moves, this.copyJumps(jumps), piece, x + 1, y + 1, x + 2, y + 2);
        break;
      case 'bk': // kings can move diagonally any direction
      case 'wk': // kings can move diagonally any direction
        this.checkLanding(moves, this.copyJumps(jumps), piece, x - 1, y + 1, x - 2, y + 2);
        this.checkLanding(moves, this.copyJumps(jumps), piece, x + 1, y + 1, x + 2, y + 2);
        this.checkLanding(moves, this.copyJumps(jumps), piece, x - 1, y - 1, x - 2, y - 2);
        this.checkLanding(moves, this.copyJumps(jumps), piece, x + 1, y - 1, x + 2, y - 2);
        break;
    }
  }

  /** @function checkLanding
   * A helper function to determine if a landing is legal,
   * if so, it adds the jump sequence to the moves list
   * and recursively seeks additional jump opportunities.
   * @param {Array} moves - the moves array
   * @param {Object} jumps - an object describing the
   *  prior jumps in this jump chain.
   * @param {String} piece - 'b' or 'w' for black or white pawns,
   *    'bk' or 'wk' for white or black kings
   * @param {integer} cx - the 'capture' x position the piece is jumping over
   * @param {integer} cy - the 'capture' y position of the peice is jumping over
   * @param {integer} lx - the 'landing' x position the piece is jumping onto
   * @param {integer} ly - the 'landing' y position of the peice is jumping onto
   */
  checkLanding(moves, jumps, piece, cx, cy, lx, ly) {
    // Check landing square is on grid
    if (lx < 0 || lx > this.state.board.length - 1 || ly < 0 || ly > this.state.board.length - 1) return;
    // Check landing square is unoccupied
    if (this.getPiece(lx, ly)) return;
    // Check capture square is occuped by opponent
    if ((piece === 'b' || piece === 'bk') && !(this.getPiece(cx, cy) === 'w' || this.getPiece(cx, cy) === 'wk')) return;
    if ((piece === 'w' || piece === 'wk') && !(this.getPiece(cx, cy) === 'b' || this.getPiece(cx, cy) === 'bk')) return;
    // legal jump! add it to the moves list
    //But only add it if it doesn't already exist
    let containsDuplicateLanding = false;
    jumps.landings.forEach(function (landing){
      if (landing.x == lx && landing.y == ly) {
        containsDuplicateLanding = true;
      }
    });
    if (!containsDuplicateLanding) {
      jumps.captures.push({x: cx, y: cy});
      jumps.landings.push({x: lx, y: ly});

      moves.push({
        type: 'jump',
        captures: jumps.captures.slice(),
        landings: jumps.landings.slice()
      });
      // check for further jump opportunities
      this.checkJump(moves, jumps, piece, lx, ly);
    }
  }

  /**
   * Checks a piece if it is a king and applies it.
   */
  checkAndApplyKing(x, y) {
    let piece = this.getPiece(x, y);
    if (y == 0 && piece == 'b') {
      this.setPiece(x, y, 'bk')
    }
    if (y == this.state.board.length - 1 && piece == 'w') {
      this.setPiece(x, y, 'wk')
    }
  }

  /** @function ApplyMove
   * A function to apply the selected move to the game
   * @param {object} move - the move to apply.
   */
  applyMove(x, y, move) {
    if (move.type === "slide") {
      this.setPiece(move.x, move.y, this.getPiece(x, y));
      this.setPiece(x, y, null);
      this.checkAndApplyKing(move.x, move.y);
    } else {
      move.captures.forEach(Utility.CreateFunction(this, function (square) {
        this.setPiece(square.x, square.y, null);
      }));
      var index = move.landings.length - 1;
      this.setPiece(move.landings[index].x, move.landings[index].y, this.getPiece(x, y));
      this.setPiece(x, y, null);
      this.checkAndApplyKing(move.landings[index].x, move.landings[index].y);
    }
  }



  /** @function checkForVictory
   * Checks to see if a victory has been actived
   * (All peices of one color have been captured)
   * @return {String} one of three values:
   * "White wins", "Black wins", or null, if neither
   * has yet won.
   */
  checkForVictory() {
    var wCount = 0;
    var bCount = 0;
    for (let y = 0; y < this.state.board.length; y++) {
      for (let x = 0; x < this.state.board[y].length; x++) {
        if (this.getPiece(x, y) === "w" || this.getPiece(x, y) === "wk") {
          wCount++;
        }
        if (this.getPiece(x, y) === "b" || this.getPiece(x, y) === "bk") {
          bCount++;
        }
      }
    }
    if (wCount == 0) {
      this.state.over = true;
      return 'black wins';
    }
    if (bCount == 0) {
      this.state.over = true;
      return 'white wins';
    }
    return null;
  }


  /** @function nextTurn()
   * Starts the next turn by changing the
   * turn property of state.
   */
  nextTurn() {
    if (this.state.turn === 'b') this.state.turn = 'w';
    else this.state.turn = 'b';
  }
}