import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react'

import useWebSocket, {
    ReadyState,
} from 'react-use-websocket'

import throttle from 'lodash.throttle'

import mazePath from '../../images/the-maze.svg'

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

const THROTTLE_MS = 16
const WS_URL = 'ws://127.0.0.1:8000'

const Main: React.FC<Props> = ({ username }) => {
    const [cursors, setCursors] = useState<Cursors | null>(null)
    const cursorRef = useRef<Cursors | null>(null)

    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
    } = useWebSocket(WS_URL, {
        share: false, // When false, instances  don't affect each other
        queryParams: { username },
        reconnectInterval: 3000,
        reconnectAttempts: 10,
        shouldReconnect: () => true,
    })

    // Later, if I want to detect when a player's cursor is close to a wall re-rendering, 
    // keep the latest cursor position in cursorRef, triggering warning effects, 
    // or vibrations when the player is near the maze boundary
    useEffect(() => {
        cursorRef.current = cursors
    }, [cursors])

    const sendThrottledMessage = useCallback(
        throttle((x: number, y: number) => {
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({
                    x,
                    y,
                })
            }
        }, THROTTLE_MS, { leading: true, trailing: true }),
        [readyState, sendJsonMessage]
    )

    // Initialize cursor position
    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
                width: window.innerWidth,
                height: window.innerHeight,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            })
        }
    }, [readyState])

    // Handle mouse movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            sendThrottledMessage(e.clientX, e.clientY)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            sendThrottledMessage.cancel()
        }
    }, [sendThrottledMessage])

    useEffect(() => {
        if (lastJsonMessage && typeof lastJsonMessage === 'object') {
            setCursors(prev => {
                if (JSON.stringify(prev) === JSON.stringify(lastJsonMessage)) {
                    return prev
                }
                return lastJsonMessage as Cursors
            })
        }
    }, [lastJsonMessage])

    const renderCursors = useCallback((users: Cursors) => {
        return Object.entries(users).map(([uuid, user]) => {
            if (!user?.state) return null
            return (
                <Cursor
                    key={uuid}
                    point={[user.state.x, user.state.y]}
                />
            )
        }).filter(Boolean)
    }, [])

    if (readyState !== ReadyState.OPEN) {
        return (
            <div className="main-container">
                <div className="connection-status">
                    {readyState === ReadyState.CONNECTING && "Connecting..."}
                    {readyState === ReadyState.CLOSING && "Closing..."}
                    {readyState === ReadyState.CLOSED && "Reconnecting..."}
                </div>
            </div>
        )
    }

    return (
        <div className='flex'>
            <div className='main-container'>
                {
                    cursors ?
                        <div>
                            <img src={mazePath}/>
                            {renderCursors(cursors)}
                        </div> :
                        null
                }
            </div>
        </div>

    )
}

export default React.memo(Main)