import React, {
    useState,
} from 'react'


interface Props {
    onSubmit: (
        username: string,
        playerColor: string
    ) => void
}

const Homepage: React.FC<Props> = ({ onSubmit }) => {
    const [username, setUsername] = useState('')
    const [playerColor, setPlayerColor] = useState('#000000')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (username.trim() && playerColor) {
            onSubmit(username.trim(), playerColor)
        }
    }

    return (
        <div className='homepage'>
            <form className='homepage-form' onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={username}
                    placeholder='username'
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type='color'
                    value={playerColor}
                    onChange={(e) => setPlayerColor(e.target.value)}
                />
                <button type='submit' disabled={!username.trim()}>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Homepage