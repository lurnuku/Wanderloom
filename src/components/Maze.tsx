import React, {
    useEffect,
    useRef,
} from 'react'

import useWebSocket from 'react-use-websocket'

import throttle from 'lodash.throttle'


interface Props {
    username: string
}

const Maze: React.FC<Props> = ({ username }) => {
    const renderCursors = () => {
        return Object.keys(users)
    }

    const {
        sendJsonMessage,
        lastJsonMessage,
    } = useWebSocket('ws:///127.0.0.1:8000', {
        share: true,
        queryParams: { username }
    })

    const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, 25))

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            sendJsonMessageThrottled.current({
                x: e.clientX,
                y: e.clientY,
            })
        })
    }, [])

    if (lastJsonMessage) {
        return (
            <div>
                {renderCursors(lastJsonMessage)}
            </div>
        )
    }

    return (
        <div>
            Hello {username}
        </div>
    )
}

export default Maze