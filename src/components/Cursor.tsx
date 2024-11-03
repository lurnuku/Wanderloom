import * as React from 'react'
import { PerfectCursor } from 'perfect-cursors'

export const Cursor = ({ point }: { point: number[] }) => {
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
    }, [])

    const onPointMove = usePerfectCursor(animateCursor)

    React.useLayoutEffect(() => onPointMove(point), [onPointMove, point])

    return (
        <svg
            ref={rCursor}
            style={{
                position: 'absolute',
                top: -15,
                left: -15,
                width: 25, // Adjust size as needed
                height: 25, // Adjust size as needed
            }}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 496 496'
            fill='#FFFFFF'
        >
            <g>
                <g>
                    <g>
                        <path d='M440,384c-8.288,0-16.504,1.864-24,5.448c-4.936-2.36-10.216-3.832-15.584-4.632c1.304-10.192,5.936-19.856,13.24-27.16 l-11.312-11.312c-10.248,10.248-16.648,23.976-18.048,38.344c-5.472,0.752-10.824,2.312-15.872,4.648 c-11.016-20.44-32.112-46.072-65.096-57.688c-23.504-8.28-39.312-28.992-39.336-51.536c-0.016-11.504,2.248-20.936,5.128-32.872 C273.712,228.128,280,201.952,280,152v-32C280,53.832,226.168,0,160,0S40,53.832,40,120v51.52 c-11.864,4.36-22.192,12.584-28.84,23.664l-7.592,12.664C1.232,211.736,0,216.176,0,220.704v2.328C0,236.8,11.2,248,24.968,248 c5.448,0,10.728-1.912,15.048-5.176C40.32,314.592,52.904,408,152,408c35.432,0,52.312-4.872,67.208-9.168 C231.896,395.168,242.848,392,264,392c14.76,0,27.112,4.4,38.304,10.68C293.216,412.848,288,426.096,288,440 c0,30.872,25.128,56,56,56c8.288,0,16.504-1.864,24-5.448c15,7.16,33,7.16,48,0c7.504,3.584,15.712,5.448,24,5.448 c30.872,0,56-25.128,56-56S470.872,384,440,384z M264,376c-23.408,0-35.952,3.616-49.224,7.456 C200.216,387.656,185.168,392,152,392c-66.392,0-96-46.872-96-152v-8h16v-16H54.624c-6.408,0-12.44,2.504-16.968,7.032 l-6.344,6.344C29.64,231.048,27.328,232,24.968,232c-4.944,0-8.968-4.024-8.968-8.968v-2.328c0-1.624,0.448-3.216,1.28-4.616 l7.592-12.664C32.064,191.448,45.208,184,59.176,184H72v-16H59.176c-1.064,0-2.112,0.152-3.176,0.208V121.76 c4.256,3.832,9.832,6.24,16,6.24c13.232,0,24-10.768,24-24S85.232,80,72,80c-3.032,0-5.912,0.624-8.584,1.656 C78.72,43.248,116.208,16,160,16c57.344,0,104,46.656,104,104v32c0,48.064-5.792,72.144-10.44,91.496 c-2.992,12.472-5.576,23.232-5.56,36.632c0.032,29.312,20.136,56.088,50.024,66.616c36.856,12.984,56.92,47.408,62.392,63.792 c2.624,7.864,6.92,14.256,12.08,19.56c-11.008-3.568-21.448-11.752-33.064-20.864C319.592,393.648,297.12,376,264,376z M64,104 c0-4.416,3.584-8,8-8s8,3.584,8,8s-3.584,8-8,8S64,108.416,64,104z M440,480c-6.984,0-13.896-1.864-19.984-5.4L416,472.272 l-4.016,2.328c-12.168,7.064-27.8,7.064-39.968,0L368,472.272l-4.016,2.328c-6.088,3.536-13,5.4-19.984,5.4 c-22.056,0-40-17.944-40-40c0-10.808,4.44-21.032,12.024-28.496c4.608,3.328,9.088,6.832,13.528,10.312 C346.712,435.28,362.912,448,384,448h40v-16h-8c-11.728,0-33.432-5.584-40.416-26.528c-0.16-0.488-0.384-1.04-0.56-1.552 c11.664-5.464,25.76-5.024,36.96,1.48l4.016,2.328l4.016-2.328c6.088-3.536,13-5.4,19.984-5.4c22.056,0,40,17.944,40,40 C480,462.056,462.056,480,440,480z' />
                        <path d='M123.16,195.184l-7.592,12.664c-2.336,3.888-3.568,8.328-3.568,12.856v2.328C112,236.8,123.2,248,136.968,248 c6.576,0,13.008-2.664,17.656-7.312l6.344-6.344c1.496-1.496,3.552-2.344,5.656-2.344H184v-16h-17.376 c-6.408,0-12.44,2.504-16.968,7.032l-6.344,6.344c-1.672,1.672-3.984,2.624-6.344,2.624c-4.944,0-8.968-4.024-8.968-8.968v-2.328 c0-1.624,0.448-3.216,1.28-4.616l7.592-12.664C144.064,191.448,157.208,184,171.176,184H184v-16h-12.824 C151.624,168,133.216,178.416,123.16,195.184z' />
                        <path d='M152,128c13.232,0,24-10.768,24-24s-10.768-24-24-24s-24,10.768-24,24S138.768,128,152,128z M152,96c4.416,0,8,3.584,8,8 s-3.584,8-8,8s-8-3.584-8-8S147.584,96,152,96z' />
                        <path d='M248,120c0-48.52-39.48-88-88-88v16c39.704,0,72,32.296,72,72H248z' />
                        <rect x='232' y='136' width='16' height='16' />
                    </g>
                </g>
            </g>
        </svg>
    )
}
