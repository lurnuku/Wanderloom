import React, {
    useEffect,
    useRef,
    useState,
} from 'react'

import useWebSocket from 'react-use-websocket'

import throttle from 'lodash.throttle'

import { Cursor } from './Cursor'


interface Props {
    username: string
}

interface Cursors {
    [uuid: string]: {
        username: string
        state: {
            x: number
            y: number
        } | null
    }
}

const Main: React.FC<Props> = ({ username }) => {
    const [cursors, setCursors] = useState<Cursors | null>(null)

    const renderCursors = (users: Cursors) => {
        return Object.keys(users).map((uuid) => {
            const user = users[uuid]
            if (!user?.state) {
                return null
            }

            return (
                <Cursor
                    key={uuid}
                    point={[user.state.x, user.state.y]}
                />
            )
        }).filter(Boolean)
    }

    const {
        sendJsonMessage,
        lastJsonMessage,
    } = useWebSocket('ws://127.0.0.1:8000', {
        share: true,
        queryParams: { username },
    })

    const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, 80))

    useEffect(() => {
        sendJsonMessage({
            width: window.innerWidth,
            height: window.innerHeight,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        })

        const handleMouseMove = (e: MouseEvent) => {
            sendJsonMessageThrottled.current({
                x: e.clientX,
                y: e.clientY,
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    useEffect(() => {
        if (lastJsonMessage && typeof lastJsonMessage === 'object') {
            setCursors(lastJsonMessage as Cursors)
        }
    }, [lastJsonMessage])

    return (
        <div className='no-cursor'>
            <div>
                {cursors ? renderCursors(cursors) : <p>No cursor data available yet.</p>}
            </div>
        </div>
    )
}

export default Main