import React from 'react'

import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import Homepage from './comonents/Homepage'


const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <Homepage />
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