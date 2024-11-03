import React, {
    useEffect,
    useRef,
} from 'react'

import useWebSocket from 'react-use-websocket'

import throttle from 'lodash.throttle'

import { Cursor } from './Cursor'


interface Props {
    username: string
}

const Maze: React.FC<Props> = ({ username }) => {
    const renderCursors = (users) => {
        return Object.keys(users).map((uuid) => {
            const user = users[uuid]
            return (
                <Cursor
                    key={user}
                    point={[
                        user.state.x,
                        user.state.y,
                    ]}
                />
            )
        })
    }

    const {
        sendJsonMessage,
        lastJsonMessage,
    } = useWebSocket('ws:///127.0.0.1:8000', {
        share: true,
        queryParams: { username }
    })

    const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, 80))

    useEffect(() => {
        sendJsonMessage({
            x: 0,
            y: 0,
        })

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
        <div className='custom-cursor'>
            Hello {username}
        </div>
    )
}

export default Maze