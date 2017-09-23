class GameState {
  constructor() {
      this.over = false;
      this.turn = 'b';
      this.board = [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, 'w', 'b', null, null, null],
        [null, null, null, 'b', 'w', null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
      ];
  }

  /**
   * Returns the current turn of the game.
   * @returns {string|*}
   */
  getTurn() {
    return this.turn;
  }

  /**
   * Sets the current turn of the game.
   * @param turn
   */
  setTurn(turn) {
    this.turn = turn;
  }

  /**
   * Returns the game board.
   * @returns {Array|[null,null,null,null,null,null,null,null]}
   */
  getBoard() {
    return this.board;
  }

  /**
   * Returns the game over status.
   * @returns {boolean|*}
   */
  getOver() {
    return this.over;
  }

  /**
   * Sets the game over status.
   * @param over
   */
  setOver(over) {
    this.over = over;
  }
}