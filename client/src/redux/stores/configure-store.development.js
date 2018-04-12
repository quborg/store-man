'use strict'

import { applyMiddleware, createStore, compose } from 'redux'
import Reducers from 'ayla-client/redux/reducers'
import promise from 'redux-promise'
import multi from 'redux-multi'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

const middlewares      = [ thunk, multi, promise, logger ]
    , composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose


function configureStore () {
  const store = createStore(
                  Reducers,
                  composeEnhancers(
                    applyMiddleware(
                      thunk, logger
                    )
                  )
                )

  if (module.hot) {
    module.hot.accept('ayla-client/redux/reducers/', () => {
      store.replaceReducer(require('ayla-client/redux/reducers/').default)
    })
  }

  return store
}


export { configureStore }
