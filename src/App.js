import React, { useEffect } from 'react';
import './App.css';
import Board from './Components/Board';


const App = () => {
  const [boardData, setBoardData] = React.useState([]);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameWon, setGameWon] = React.useState(false);
  const [gameLost, setGameLost] = React.useState(false);

  const generateBoard = () => {
    const board = [];
    for (let i = 0; i < 10; i++) {
      board.push([]);
      for (let j = 0; j < 10; j++) {
        board[i].push({
          value: 0,
          state: "hidden"
        });
      }
    }
    
    let mines = 10;
    while (mines > 0) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      if (board[x][y].value !== '💣') {
        board[x][y].value = '💣';
        mines--;
      }
    }

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (board[i][j].value !== '💣') {
          board[i][j].value = countAdjacentMines(board,i, j);
        }
      }
    }

    setBoardData(board);
    setGameStarted(true);
  }

  useEffect(() => { generateBoard() }, []);

  useEffect(() => {
    if(gameStarted) {
      if(countOf(boardData, "revealed") === 90) {
        setGameWon(true);
        revealBoard("revealed");
        // generateBoard();
      }
      console.log(countOf(boardData,"revealed"));
    }

  }, [boardData, gameStarted]);

  function handCellClick(x, y) {
    console.log('clicked', x, y)
    const board = [...boardData];
    if (board[x][y].value === '💣') {
      setGameLost(true);
      revealBoard("💣");
      // generateBoard();
    } else {
      board[x][y].state =  "revealed";
      setBoardData(board);
      if (board[x][y].value === 0) {
        openAdjacentNumbers(x, y);
      }
    }
  }

  function countAdjacentMines(board, x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      let actRow = x + i;
      if (actRow >= 0 && actRow < 10) {
        for (let j = -1; j <= 1; j++) {
          let actCol = y + j;
          if (actCol >= 0 && actCol < 10) {
            if (board[actRow][actCol].value === '💣') {
              count++;
            }
          }
        }
      }
    }
    return count;
  }

  function openAdjacentNumbers(x, y) {

    for (let i = -1; i <= 1; i++) {
      let actRow = x + i;
      if (actRow >= 0 && actRow < 10) {
        for (let j = -1; j <= 1; j++) {
          let actCol = y + j;
          if (actCol >= 0 && actCol < 10) {
            if (boardData[actRow][actCol].state === "hidden") {
              handCellClick(actRow, actCol);
            }
          }
        }
      }
    }

  }

  function revealBoard(state) {
    const board = [...boardData];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if(board[i][j].value === state) {
        board[i][j].state = "revealed";
        }
      }
    }
    setBoardData(board);
  }

  function handleCellContextMenu(e, x, y) {
    e.preventDefault();
    const board = [...boardData];

    if (board[x][y].state === "hidden") {
      if (countOf(board, "🚩") === 10) {
        return;
      }
      board[x][y].state = "🚩";
    } else {
      board[x][y].state = "hidden";
    }
    setBoardData(board);
  }

  function countOf(board, state) {
    let count = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (board[i][j].state === state) {
          count++;
        }
      }
    }
    return count;
  }

  function startNewGame() {
    setGameLost(false);
    setGameWon(false);
    generateBoard();
  }

  return (
    <div className="App">
      <div>
        <button onClick={() => startNewGame()}>New Game</button>
        <span>opened: {gameStarted && countOf(boardData, "revealed")}/90   </span>
        <span>flagged: {gameStarted && countOf(boardData, "🚩")}/10</span>
      </div>
      <Board board={boardData} lost={gameLost} won={gameWon} handCellClick={handCellClick} handleCellContextMenu={handleCellContextMenu} />
      <button onClick={() => {boardData.lost = true}}>test</button>
      <a href='https://github.com/stefanszeke/minesweeper_in_react'>source</a>
    </div>
  )




}

export default App;
