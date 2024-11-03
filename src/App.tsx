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
import Maze from './components/Maze'


const App: React.FC = () => {
  const [username, setUsername] = useState('')

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          {
            username ?
              <Maze username={username} /> :
              <Homepage onSubmit={setUsername} />
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