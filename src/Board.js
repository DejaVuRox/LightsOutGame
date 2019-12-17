import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";
class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  };
  constructor(props) {
    super(props);

    //set initial state
    this.state = {
      hasWon: false,
      board: this.createBoard()
    };
  }

  //create a board nrows high/ncols wide, each cell randomly lit or unlit
  createBoard() {
    let board = [];
    //create array-of-arrays of true/false values
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(keyCoordinate) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = keyCoordinate.split("-").map(Number);

    function flipCell(y, x) {
      // if this keyCoordinate is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    //flip this cell and the cells around it
    flipCell(y, x); // flipping initial cell
    flipCell(y, x - 1); // flip left
    flipCell(y, x + 1); // flip right
    flipCell(y - 1, x); // flip below
    flipCell(y + 1, x); // flip above

    // win when every cell is turned off
    let hasWon = board.every(row => row.every(cell => !cell))
    this.setState({ board, hasWon });
  }

  /** Render game board or winning message. */

  render() {
    // if the game is won, just show a winning msg & render nothing else
    if (this.state.hasWon) {
      return (
        <div className="Board-title">
          <div className="winner">
            <span className="neon-orange">YOU</span>
            <span className="flux-blue">WIN!</span>
          </div>
        </div>
      );
    }

    let tblBoard = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        let keyCoordinate = `${y}-${x}`;
        row.push(
          <Cell
            key={keyCoordinate}
            isLit={this.state.board[y][x]}
            flipCellsAroundMe={() => this.flipCellsAround(keyCoordinate)}
          />
        );
      }
      tblBoard.push(<tr>{row}</tr>);
    }

    return (
      <div>
        <div className="Board-title">
          <div className="neon-orange">Lights</div>
          <div className="flux-blue">Out</div>
        </div>
        <table className="Board">
          <tbody>{tblBoard}</tbody>
        </table>
      </div>
    );
  }
}

export default Board;
