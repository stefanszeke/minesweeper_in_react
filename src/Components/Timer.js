import React from 'react'
import clsx from 'clsx'
import "./Timer.css"

const Timer = (props) => {

    const [time, setTime] = React.useState(0)
    


    let className = clsx({
        "timer": true,
    })


    React.useEffect(() => {
        let interval = null;
        if (props.timerOn) {
            interval = setInterval(() => {
                setTime(time => time + 10)
            }, 10)
        } else if (!props.timerOn) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [props.timerOn])

    // reset timer
    React.useEffect(() => {
        setTime(0)
    }, [props.resetTimer])





    return (
        <div className={className}>
            <div className='timer-top'>
                <div>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</div>
                <div>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</div>
            </div>
            <div className='timer-bottom'>
                <div>00:{("0"+((time/10)%100).toFixed()).slice(-2)}</div>  
            </div>
        </div>
    )
}

export default Timer

