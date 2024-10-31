import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'

ReactDOM.render(
  <React.Suspense fallback='Loading...'>
    <Router>
      <App />
    </Router>
  </React.Suspense>,
    document.getElementById('root')
)
