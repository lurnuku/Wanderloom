import React, {
  useState,
} from 'react'

import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import Homepage from './components/Homepage'
import Main from './components/Main'


const App: React.FC = () => {
  const [username, setUsername] = useState('')
  const [playerColor, setPlayerColor] = useState('#070000')

  const handleSubmit = (newUsername: string, newColor: string) => {
    setUsername(newUsername)
    setPlayerColor(newColor)
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          {
            username ?
              <Main
                username={username}
                playerColor={playerColor}
              /> :
              <Homepage onSubmit={handleSubmit} />
          }
        </Route>
        <Route exact path='/page-not-found'>
        </Route>
        <Route exact path='/error'>
        </Route>
        <Redirect to='/page-not-found' />
      </Switch>
    </BrowserRouter>
  )
}

export default App