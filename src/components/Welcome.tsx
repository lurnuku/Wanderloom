import React, {
    useState,
} from 'react'


interface Props {
    onSubmit: (
        username: string,
        playerColor: string
    ) => void
}

const Welcome: React.FC<Props> = ({ onSubmit }) => {
    const [username, setUsername] = useState('')
    const [playerColor, setPlayerColor] = useState('#000000')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (username && playerColor) {
            onSubmit(username.trim(), playerColor)
        }
    }

    return (
        <div className='welcome'>
            <form
                className='welcome-form'
                onSubmit={handleSubmit}
            >
                <input
                    type='text'
                    value={username}
                    placeholder='username'
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={15}
                    required
                />
                <input
                    type='color'
                    value={playerColor}
                    onChange={(e) => setPlayerColor(e.target.value)}
                />
                <button
                    type='submit'
                    disabled={!username.trim()}
                >
                    Join a room
                </button>
            </form>
        </div>
    )
}

export default Welcome