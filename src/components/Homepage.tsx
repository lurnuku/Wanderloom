import React, {
    useState,
} from 'react'


interface Props {
    onSubmit: any,
}

const Homepage: React.FC<Props> = ({ onSubmit }) => {
    const [username, setUsername] = useState('')

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit(username)
                }}>
                <input
                    type='text'
                    value={username}
                    placeholder='username'
                    onChange={(e) => setUsername(e.target.value)} />
            </form>
        </>
    )
}

export default Homepage