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

import { Cursor } from './Cursor'


interface Props {
    username: string
    playerColor: string
}

interface Cursors {
    [uuid: string]: {
        username: string
        state: {
            x: number
            y: number
        } | null
        playerColor: string
    }
}

const THROTTLE_MS = 16
const WS_URL = 'ws://127.0.0.1:8000'

const Main: React.FC<Props> = ({
    username,
    playerColor,
}) => {
    const [cursors, setCursors] = useState<Cursors | null>(null)
    const cursorRef = useRef<Cursors | null>(null)
    const mazeRef = useRef<SVGSVGElement>(null)

    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
    } = useWebSocket(
        `${WS_URL}?username=${encodeURIComponent(username)}&playerColor=${encodeURIComponent(playerColor)}`,
        {
            share: false, // When false, instances (player's 'connection')  don't affect each other
            reconnectInterval: 3000,
            reconnectAttempts: 10,
            shouldReconnect: () => true,
        }
    )


    const sendThrottledMessage = useCallback(
        throttle((x: number, y: number) => {
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({
                    x,
                    y,
                    playerColor,
                })
            }
        }, THROTTLE_MS, { leading: true, trailing: true }),
        [readyState, sendJsonMessage]
    )

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
                width: window.innerWidth,
                height: window.innerHeight,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                playerColor: playerColor,
            })
        }
    }, [readyState])

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
                const newCursors = lastJsonMessage as Cursors
                cursorRef.current = newCursors
                return newCursors
            })
        }
    }, [lastJsonMessage])

    const didCursorHitWall = (uuid: string) => {
        const svg = mazeRef.current
        const path = svg?.querySelector('path')

        if (!svg || !path || !cursorRef.current || !cursorRef.current[uuid]) return

        const svgPoint = svg.createSVGPoint()
        svgPoint.x = cursorRef.current[uuid].state?.x ?? 0
        svgPoint.y = cursorRef.current[uuid].state?.y ?? 0

        const screenCTM = svg.getScreenCTM()
        if (!screenCTM) return

        const cursorPoint = svgPoint.matrixTransform(screenCTM.inverse())

        const isOnStroke = path.isPointInStroke(cursorPoint)
        const isOnFill = path.isPointInFill(cursorPoint)

        if (isOnStroke) {
            console.log('Cursor is on the stroke!')
        } else if (isOnFill) {
            console.log('Cursor is on the fill!')
        } else {
            console.log('Cursor is outside the path.')
        }
    }

    const renderCursors = useCallback((users: Cursors) => {
        return Object.entries(users)
            .map(([uuid, user]) => {
                if (!user?.state) return null
                console.log(user)
                return (
                    <>
                        <Cursor
                            key={uuid}
                            point={[user.state.x, user.state.y]}
                            onCursorMove={() => didCursorHitWall(uuid)}
                            playerColor={user.playerColor || '#000000'}
                            username={user.username}
                        />
                    </>
                )
            })
            .filter(Boolean)
    }, [])

    return (
        <div className='flex'>
            {
                cursors ? (
                    <div className='main-container'>
                        <svg
                            ref={mazeRef}
                            viewBox='0 0 491.608 491.608'
                            className='maze-path'
                        >
                            <path
                                d='M0,0v491.608h491.608V0H0z M458.834,458.834H357.536v-34.006h67.291V66.78h-99.81v32.774h67.036v131.983
                                h-34.518v-97.466H134.071v223.465h114.461v-32.774h-81.687V166.845h91.377v33.767h-57.61v90.384h90.384v-32.774h-57.61v-24.837
                                h57.61v-66.54h33.767v157.917h-36.615v32.774h69.389v-93.225h34.518v127.742h-292.5v-57.482H66.78v90.256h257.982v34.006H32.774
                                V157.075H66.78v141.978h32.773V99.554h191.314V66.78H66.78v57.521H32.774V32.774h426.059V458.834z'
                            />
                        </svg>
                        {renderCursors(cursors)}
                    </div>
                ) : null
            }
        </div>
    )
}

export default React.memo(Main)
