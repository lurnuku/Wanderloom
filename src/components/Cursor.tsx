import * as React from 'react'
import { PerfectCursor } from 'perfect-cursors'


interface Props {
    point: number[]
    onCursorMove?: () => void
}

export const Cursor: React.FC<Props> = ({
    point,
    onCursorMove,
}) => {
    function usePerfectCursor(
        cb: (point: number[]) => void,
        point?: number[]
    ) {
        const [pc] = React.useState(() => new PerfectCursor(cb))

        React.useLayoutEffect(() => {
            if (point) pc.addPoint(point)
            return () => pc.dispose()
        }, [pc, point])

        const onPointChange = React.useCallback(
            (point: number[]) => pc.addPoint(point),
            [pc]
        )

        return onPointChange
    }

    const rCursor = React.useRef<SVGSVGElement>(null)

    const animateCursor = React.useCallback((point: number[]) => {
        const elm = rCursor.current
        if (!elm) return
        elm.style.setProperty(
            'transform',
            `translate(${point[0]}px, ${point[1]}px)`
        )

        if (onCursorMove) {
            onCursorMove()
        }
    }, [onCursorMove])

    const onPointMove = usePerfectCursor(animateCursor)

    React.useLayoutEffect(() => onPointMove(point), [onPointMove, point])

    return (
        <svg
            ref={rCursor}
            style={{
                position: 'absolute',
                top: -15,
                left: -15,
                width: 26,
                height: 26,
                pointerEvents: 'none',
            }}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 26 26'
        >
            <defs>
                <style>
                    {`
            .cls-1 {
              fill: #ff69b4;
            }
          `}
                </style>
            </defs>
            <g>
                <g id='Vrstva_1'>
                    <path className='cls-1' d='M6.3,7.7c.3,0,.4.3,1,.5.2,0,.6.2.8,0,.6-.2.7-1.2,1.1-2.4.2-.8.6-2.2,1.4-3.4.4-.6,1.1-1.6,2.4-2.1.3-.1,1.3-.4,2.4,0,1.4.5,2.4,1.9,2.6,3.2,0,.8-.2,1.4.3,2,0,0,.5.7,1.2.7,1,0,1.2-1.7,2.6-2.1,0,0,1-.3,1.6.2.7.7.1,2.3,0,3-.9,2.7-2.5,2.9-2.8,4.9,0,.7-.3,1.5-.4,2.2,0,.5-.1,1-.4,1.1-.2,0-.4-.2-.5-.2-.6-.6.3-2-.2-2.5-.2-.2-.7-.1-1,0-.9.4-.9,2-1,3.1-.3,2.9-1.9,6.9-4.3,7.8-.5.2-1,.2-2.9.8-1,.3-1.4.4-1.7.6-.8.4-1.2.7-1.4.5-.3-.2-.2-.9,0-1.6.5-2.7.8-4.1,1.1-5.1.2-.7.4-1.1.8-2.4.4-1.1.6-1.9.3-2.7,0-.2-.3-.8-.7-.9-.4-.1-.9.3-1.1.6-.5.6-.1,1.1-.6,1.9,0,0-.5.9-1,.8-.3,0-.5-.4-.8-1.5-.5-1.7-.7-2.9-.8-3.6-.3-2-.3-2.3-.1-2.6.4-.7,1.4-1.3,2.1-1Z' />
                    <path d='M13,9.2s-.3,0-.4.2c-.1.2-.2.4,0,.6.1.2.4.2.4.2.3,0,.6-.2.6-.5,0-.3-.3-.5-.5-.5Z' />
                    <path d='M13.1,5.9c0-.2.1-.8,0-1.5-.1-.5-.2-.6-.3-.7-.2-.1-.5,0-.7.2-.2.2-.2.4-.3.8-.1.5,0,.8,0,1.3,0,.2,0,.5.2.8,0,.2.2.3.3.3.2,0,.3,0,.4,0,.4-.2.5-.7.6-1.1Z' />
                    <path d='M15.3,3.9c-.2,0-.4,0-.5,0-.4.2-.5.6-.6,1-.1.4-.3,1-.1,1.7,0,.2.2.6.4.6.2,0,.5-.3.6-.5.2-.3.6-.8.6-1.5,0,0,0-1.2-.4-1.4Z' />
                </g>
            </g>
        </svg>
    )
}
