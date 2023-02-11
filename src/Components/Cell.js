import React from 'react'
import './Cell.css'
import clsx from 'clsx'

const Cell = (props) => {

    let className = clsx({
        "cell": true,
        "revealed": props.state === "revealed",
        "flagged": props.state === "🚩",
        "mine": props.value === "💣" && props.state === "revealed",
        "zero": props.value === 0 && props.state === "revealed",
        "one": props.value === 1 && props.state === "revealed",
        "two": props.value === 2 && props.state === "revealed",
        "three": props.value === 3 && props.state === "revealed",
        "four": props.value === 4 && props.state === "revealed",
        "five": props.value === 5 && props.state === "revealed",
        "six": props.value === 6 && props.state === "revealed",
        "seven": props.value === 7 && props.state === "revealed",
        "eight": props.value === 8 && props.state === "revealed",
    })



    return (
        <div 
            className={className}
            onClick={props.onClick}
            onContextMenu={props.onContextMenu}
        >
            {props.state === "🚩" ? "🚩" : ""}
            {props.state === "revealed" && (props.value > 0 || props.value === "💣" || props.value === "🚩" ) ? props.value : ""}
        </div>
    )
}

export default Cell

