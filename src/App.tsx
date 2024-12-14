import React, {
  useState,
} from 'react'

import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import Welcome from './components/Welcome'
import Main from './components/Main'


const App: React.FC = () => {
  const [username, setUsername] = useState<string>('')
  const [playerColor, setPlayerColor] = useState<string>('#070000')

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
              <Welcome onSubmit={handleSubmit} />
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