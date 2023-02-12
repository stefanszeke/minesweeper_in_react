import React, { useEffect } from 'react';
import './App.css';
import Board from './Components/Board';
import Timer from './Components/Timer';


const App = () => {
  const [boardData, setBoardData] = React.useState([]);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameWon, setGameWon] = React.useState(false);
  const [gameLost, setGameLost] = React.useState(false);

  const [boardSize, setBoardSize] = React.useState(10);
  const [mineCount, setMineCount] = React.useState(2);

  const [controlValue, setControlValue] = React.useState([boardSize, mineCount]);

  const [controlChanging, setControlChanging] = React.useState(false);

  const [timerOn, setTimerOn] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [resetTimer, setResetTimer] = React.useState(false);

  const generateBoard = () => {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
      board.push([]);
      for (let j = 0; j < boardSize; j++) {
        board[i].push({
          value: 0,
          state: "hidden"
        });
      }
    }
    
    let mines = mineCount;
    while (mines > 0) {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      if (board[x][y].value !== '💣') {
        board[x][y].value = '💣';
        mines--;
      }
    }

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
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

     
    
  }, [timerOn]);

  useEffect(() => {
    if(gameStarted) {
      if(countOf(boardData, "revealed") === boardSize * boardSize - mineCount) {
        setGameWon(true); // win condition
      }
      if(!timerOn &&( countOf(boardData, "revealed") > 0)) {
        setTimerOn(true);
      }
    }
  }, [boardData, gameStarted]);

  useEffect(() => {
    if(gameWon || gameLost) {
      setTimerOn(false);
    }
  }, [gameWon, gameLost]);



  useEffect(() => {
    if(controlChanging) {
      setBoardSize(controlValue[0]);
      setMineCount(controlValue[1]);
      setControlChanging(false);
    }
  }, [controlChanging]);

  useEffect(() => {
    startNewGame();
  }, [boardSize, mineCount]);

  function handCellClick(x, y) {
    if(boardData[x][y].state === "🚩") { return; }
    const board = [...boardData];
    if (board[x][y].value === '💣') {
      setGameLost(true); // lose condition
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
      if (actRow >= 0 && actRow < boardSize) {
        for (let j = -1; j <= 1; j++) {
          let actCol = y + j;
          if (actCol >= 0 && actCol < boardSize) {
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
      if (actRow >= 0 && actRow < boardSize) {
        for (let j = -1; j <= 1; j++) {
          let actCol = y + j;
          if (actCol >= 0 && actCol < boardSize) {
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
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
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
      if (countOf(board, "🚩") >= mineCount) {
        return;
      }
      board[x][y].state = "🚩";
    } 
    else if (board[x][y].state === "🚩") {
      board[x][y].state = "hidden";
    }
    setBoardData(board);
  }

  function countOf(board, state) {
    let count = 0;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
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
    setGameStarted(false);
    setTimerOn(false);
    setResetTimer(resetTimer => !resetTimer);
    generateBoard();
  }

  function handleControlSizeChange(e) {
    const value = e.target.value;
    setControlValue([value, controlValue[1]]);
  }

  function handleControlMinesChange(e) {
    const value = e.target.value;
    setControlValue([controlValue[0], value]);
  }

  function handleControlChange() {
    setGameStarted(false);
    setControlChanging(true);
    startNewGame();
  }

  function handleTimerOn() {
    setTimerOn(timerOn => !timerOn);
  }

  return (
    <div className="App">
      <div>
        <h1 className='title'>minesweeper</h1>
        <div className='score-board'>
          <div className='score-item'>✅ opened: {gameStarted && countOf(boardData, "revealed")}/{boardSize*boardSize-mineCount}   </div>
          <Timer timerOn={timerOn} time={time} resetTimer={resetTimer} />
          <div className='score-item score-item-flag'>flagged: {gameStarted && countOf(boardData, "🚩")}/{mineCount} 🚩</div>
        </div>
      </div>
      <Board board={boardData} lost={gameLost} won={gameWon} handCellClick={handCellClick} handleCellContextMenu={handleCellContextMenu} />
        <div className='controls'>
          <div className='control-inputs'>
            <div>
              <label htmlFor="size">Board size: </label>
              <input type="number" id="size" name="size" min="5"max="20" defaultValue={controlValue[0]} onChange={handleControlSizeChange}></input>
            </div>
            <div>
              <label htmlFor="mines">Mines: </label>
              <input type="number" id="mines" name="mines" min="1" max="50" defaultValue={controlValue[1]} onChange={handleControlMinesChange}></input>
            </div>
          </div>
          <div className='control-buttons'>
            <button onClick={() => startNewGame()}>New Game</button>
            <button onClick={handleControlChange}> change</button>
          </div>
        </div>
      <a target="_blank" rel="noopener" href='https://github.com/stefanszeke/minesweeper_in_react/tree/master'>source</a>
    </div>
  )




}

export default App;
