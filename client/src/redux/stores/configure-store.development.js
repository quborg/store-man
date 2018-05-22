'use strict'

import {applyMiddleware, createStore, compose} from 'redux'
import promise  from 'redux-promise'
import multi    from 'redux-multi'
import thunk    from 'redux-thunk'
import logger   from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import {Saga}   from 'ayla-client/redux/middlewares'
import Reducers from 'ayla-client/redux/reducers'
import { loadingBarMiddleware } from 'ayla-client/react/plugins/loadingBar'

const sagaMiddleware   = createSagaMiddleware()
    , middlewares      = [ thunk, multi, promise, logger, sagaMiddleware, loadingBarMiddleware() ]
    , composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose


function configureStore () {
  const store = createStore(
                  Reducers,
                  composeEnhancers(
                    applyMiddleware(
                      ...middlewares
                    )
                  )
                )

  if (module.hot) {
    module.hot.accept('ayla-client/redux/reducers/', () => {
      store.replaceReducer(require('ayla-client/redux/reducers/').default)
    })
  }

  sagaMiddleware.run(Saga, store.dispatch)

  return store
}


export { configureStore }
