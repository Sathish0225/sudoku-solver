import "./App.css";
import React, { useState } from "react";

const initial = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1],
];

function App() {
  const [sudokuArr, setSudokuArr] = useState(getDeepCopy(initial));

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  function onInputChange(e, row, col) {
    var val = parseInt(e.target.value) || -1,
      grid = getDeepCopy(sudokuArr);
    // Input value should range from 1-9  and for empty cell it should be -1
    if (val === -1 || (val >= 1 && val <= 9)) {
      grid[row][col] = val;
    }
    setSudokuArr(grid);
  }

  // function to check sudoku is valid or not
  function checkSudoko() {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);
    let compare = compareSudoku(sudokuArr, sudoku);
    if (compare.isComplete) {
      alert("Congratulations! You have solved Sudoku");
    } else if (compare.isSolvable) {
      alert("Keep going! You have a chance to solve Sudoku");
    } else {
      alert("Sudoku can't be solved, try again!");
    }
  }

  // function to compare sudoku
  function compareSudoku(currentSudoku, solvedSudoko) {
    let res = {
      isComplete: true,
      isSolvable: true,
    };
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (currentSudoku[i][j] !== solvedSudoko[i][j]) {
          if (currentSudoku[i][j] !== -1) {
            res.isSolvable = false;
          }
          res.isComplete = false;
        }
      }
    }
    return res;
  }

  // check num is unique in row
  function checkRow(grid, row, num) {
    return grid[row].indexOf(num) === -1;
  }

  // check num is unique in col
  function checkCol(grid, col, num) {
    return grid.map((row) => row[col]).indexOf(num) === -1;
  }

  function checkBox(grid, row, col, num) {
    let boxArr = [],
      rowStart = row - (row % 3),
      colStart = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // get all the cell numbers and push in the boxArr
        boxArr.push(grid[rowStart + i][colStart + j]);
      }
    }

    return boxArr.indexOf(num) === -1;
  }

  function checkValid(grid, row, col, num) {
    //num should be unique in row, col and in the square 3x3
    if (
      checkRow(grid, row, num) &&
      checkCol(grid, col, num) &&
      checkBox(grid, row, col, num)
    ) {
      return true;
    }
    return false;
  }

  function getNextCell(row, col) {
    // if col reaches 8, increase row number
    // if row reaches 8 and col reaches 8, next will be [0,0]
    // if col doesn't reach 8, increase col number
    return col !== 8 ? [row, col + 1] : row !== 8 ? [row + 1, 0] : [0, 0];
  }

  // recursive function to solve sudoku
  function solver(grid, row = 0, col = 0) {
    // if the current cell is already filled, move to next cell
    if (grid[row][col] !== -1) {
      // for last cell, dont solve it
      let isLast = row >= 8 && col >= 8;
      if (!isLast) {
        let [nextRow, nextCol] = getNextCell(row, col);
        return solver(grid, nextRow, nextCol);
      }
    }
    for (let num = 1; num <= 9; num++) {
      // check if this num is satisfying sudoku constraints
      if (checkValid(grid, row, col, num)) {
        // fill the num in that cell
        grid[row][col] = num;
        // get Next cell and repeat the function
        let [nextRow, nextCol] = getNextCell(row, col);

        if (!nextRow && !nextCol) {
          return true;
        }

        if (solver(grid, nextRow, nextCol)) {
          return true;
        }
      }
    }

    // if its in valid fill with -1
    grid[row][col] = -1;
    return false;
  }

  // function to solve sudoku
  function solveSudoko() {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);
    setSudokuArr(sudoku);
  }

  // function to reset sudoku
  function resetSudoko() {
    let sudoku = getDeepCopy(initial);
    setSudokuArr(sudoku);
  }

  return (
    <div className="App">
      <div className="App-Header">
        <h3>Sudoku Solver</h3>
        <table className="table-auto">
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rindex) => {
              return (
                <tr
                  key={rindex}
                  className={(row + 1) % 3 === 0 ? "bBorder" : ""}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cindex) => {
                    return (
                      <td
                        key={rindex + cindex}
                        className={(col + 1) % 3 === 0 ? "rBorder" : ""}
                      >
                        <input
                          onChange={(e) => onInputChange(e, row, col)}
                          value={
                            sudokuArr[row][col] === -1
                              ? ""
                              : sudokuArr[row][col]
                          }
                          className="cellInput"
                          disabled={initial[row][col] !== -1}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="buttonContainer">
          <button
            className="checkButton rounded-md text-white"
            onClick={checkSudoko}
          >
            Check
          </button>
          <button
            className="solveButton rounded-md text-white"
            onClick={solveSudoko}
          >
            Solve
          </button>
          <button
            className="resetButton rounded-md text-white"
            onClick={resetSudoko}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
