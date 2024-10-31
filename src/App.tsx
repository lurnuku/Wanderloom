import React from 'react'

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Switch>
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