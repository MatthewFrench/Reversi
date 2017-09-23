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
        isCompleted = true;
        break;
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

  getPiece(x, y) {
    return this.state.board[y][x];
  }

  setPiece (x, y, value) {
    this.state.board[y][x] = value;
  }

  /** @function ApplyMove
   * A function to apply the selected move to the game.
   */
  applyMove(move) {
    //Loop through all captures and set them to origin piece
    for (let capture of move.captured) {
      this.setPiece(capture.x, capture.y, move.originPiece);
    }
    //Add piece at the end
    this.setPiece(move.landingX, move.landingY, move.originPiece);
  }

  /** @function checkForVictory
   * Checks the number of white, black or empty values.
   * @return {String} one of three values:
   * "White wins", "Black wins", or null, if neither
   * has yet won.
   */
  checkForVictory() {
    var wCount = 0;
    var bCount = 0;
    var emptyCount = 0;
    for (let y = 0; y < this.state.board.length; y++) {
      for (let x = 0; x < this.state.board[y].length; x++) {
        let piece = this.getPiece(x, y);
        if (piece === "w") {
          wCount++;
        }
        if (piece === "b") {
          bCount++;
        }
        if (piece === null) {
          emptyCount++;
        }
      }
    }
    if (emptyCount === 0) {
      if (wCount > bCount) {
        this.state.over = true;
        return 'white wins';
      } else if (bCount > wCount) {
        this.state.over = true;
        return 'black wins';
      } else {
        return 'draw';
      }
    } else {
      //Check for edge cases where there's no extra moves
      let whiteMoves = this.getAllLegalMovesForColor('w');
      let blackMoves = this.getAllLegalMovesForColor('b');
      if (whiteMoves.length === 0 && blackMoves.length === 0) {
        if (wCount > bCount) {
          this.state.over = true;
          return 'white wins';
        } else if (bCount > wCount) {
          this.state.over = true;
          return 'black wins';
        } else {
          return 'draw';
        }
      }
    }
    return null;
  }


  /** @function nextTurn()
   * Starts the next turn by changing the
   * turn property of state.
   */
  nextTurn() {
    if (this.state.turn === 'b') {
      let whiteMoves = this.getAllLegalMovesForColor('w');
      if (whiteMoves.length > 0) {
        this.state.turn = 'w';
      }
    }
    else {
      let blackMoves = this.getAllLegalMovesForColor('b');
      if (blackMoves.length > 0) {
        this.state.turn = 'b';
      }
    }
  }
}