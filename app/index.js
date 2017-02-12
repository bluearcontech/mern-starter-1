import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Router } from 'react-router'

import createStore from './store'
import createRoutes from './routes'
import HmrContainer from './containers/HmrContainer'
import AppContainer from './containers/AppContainer'

import projectConfig from '../config/project.config'

import './styles/app.scss'

const initialState = window.__INITIAL_STATE__ // eslint-disable-line no-underscore-dangle
const store = createStore(initialState)

let routes = createRoutes(store)

const MOUNT_NODE = document.getElementById('root')

const render = () => {
  ReactDOM.render(
    <HmrContainer>
      <AppContainer store={store}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </AppContainer>
    </HmrContainer>,
    MOUNT_NODE // eslint-disable-line comma-dangle
  )
}

if (projectConfig.globals.__DEV__) { // eslint-disable-line no-underscore-dangle
  if (module.hot) {
    module.hot.accept('./routes', () => {
      routes = require('./routes').default(store) // eslint-disable-line global-require
      render()
    })
  }
}

render()
