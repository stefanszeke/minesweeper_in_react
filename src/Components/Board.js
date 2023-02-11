import Cell from "./Cell"
import './Board.css'
import clsx from 'clsx'

const Board = (props) => {
    let className = clsx({
        "board": true,
        "board-lost": props.lost,
        "board-won": props.won,
    })



    return (
        <div className={className}>
            {props.board.map((row, i) => (
                <div className="board-row" key={i}>
                    {row.map((cell, j) => (
                        <Cell
                            key={j}
                            cell={cell}

                            onClick={() => props.handCellClick(i, j)}
                            onContextMenu={(e) => props.handleCellContextMenu(e, i, j)}
                            revealed={false}
                            value={cell.value}
                            state={cell.state}
                        />
                    ))}
                </div>
            )
            )}

        </div>
    )
}

export default Board