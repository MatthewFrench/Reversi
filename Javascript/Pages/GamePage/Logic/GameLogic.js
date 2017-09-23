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

PlayMode = {
  PlayerVsPlayer : 0,
  PlayerVsAI : 1,
  AIVsAI : 2
};

/**
 * Handles manipulation of game data.
 */
class GameLogic {
  constructor() {
    /** The state of the game */
    this.state = new GameState();
  }

  /**
   * Returns the active turn.
   * @returns {*}
   */
  getTurn() {
    return this.state.getTurn();
  }

  /**
   * Returns an array of all legal moves on the board for a color.
   * @param color
   * @returns {Array}
   */
  getAllLegalMovesForColor(color) {
    let moves = [];
    for (let y = 0; y < this.state.getBoard().length; y++) {
      for (let x = 0; x < this.state.getBoard()[y].length; x++) {
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

  /**
   * Adds legal moves for a piece and direction to the moves array.
   * @param moves
   * @param piece
   * @param x
   * @param y
   * @param direction
   */
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
      currentX = GameLogic.getNextXLocation(currentX, direction);
      currentY = GameLogic.getNextYLocation(currentY, direction);

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
    if (move.landingX !== null) {
      moves.push(move);
    }
  }

  /**
   * Returns true if the position is on the board.
   * @param x
   * @param y
   * @returns {boolean}
   */
  isPositionOnBoard(x, y) {
    return (x >= 0 && y >= 0 &&
      y <= this.state.getBoard().length - 1 &&
      x <= this.state.getBoard()[y].length - 1);
  }

  /**
   * Returns true if the space is empty.
   * @param x
   * @param y
   * @returns {boolean}
   */
  isSpaceEmpty(x, y) {
    return this.getPiece(x,y) === null;
  }

  /**
   * Returns the next x position in the given direction.
   * @param x
   * @param direction
   * @returns {*}
   */
  static getNextXLocation(x, direction) {
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

  /**
   * Returns the next y position in the given direction.
   * @param y
   * @param direction
   * @returns {*}
   */
  static getNextYLocation(y, direction) {
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

  /**
   * Returns the piece at the location.
   * @param x
   * @param y
   * @returns {*}
   */
  getPiece(x, y) {
    return this.state.getBoard()[y][x];
  }

  /**
   * Sets the piece at the location.
   * @param x
   * @param y
   * @param value
   */
  setPiece (x, y, value) {
    this.state.getBoard()[y][x] = value;
  }

  getPieceCount(piece) {
    let count = 0;
    for (let y = 0; y < this.state.getBoard().length; y++) {
      for (let x = 0; x < this.state.getBoard()[y].length; x++) {
        let currentPiece = this.getPiece(x, y);
        if (currentPiece === piece) {
          count++;
        }
      }
    }
    return count;
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
    let wCount = 0;
    let bCount = 0;
    let emptyCount = 0;
    for (let y = 0; y < this.state.getBoard().length; y++) {
      for (let x = 0; x < this.state.getBoard()[y].length; x++) {
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
        this.state.setOver(true);
        return 'white wins';
      } else if (bCount > wCount) {
        this.state.setOver(true);
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
          this.state.setOver(true);
          return 'white wins';
        } else if (bCount > wCount) {
          this.state.setOver(true);
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
    if (this.state.getTurn() === 'b') {
      let whiteMoves = this.getAllLegalMovesForColor('w');
      if (whiteMoves.length > 0) {
        this.state.setTurn('w');
      }
    }
    else {
      let blackMoves = this.getAllLegalMovesForColor('b');
      if (blackMoves.length > 0) {
        this.state.setTurn('b');
      }
    }
  }
}