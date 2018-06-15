'use strict'

import {applyMiddleware, createStore, compose} from 'redux'
import createSagaMiddleware from 'redux-saga'
import promise  from 'redux-promise'
import multi    from 'redux-multi'
import thunk    from 'redux-thunk'
import {Saga}   from 'store-man-client/redux/middlewares'
import Reducers from 'store-man-client/redux/reducers'
import { loadingBarMiddleware } from 'store-man-client/react/plugins/loadingBar'


const sagaMiddleware   = createSagaMiddleware()
    , middlewares      = [ thunk, multi, promise, sagaMiddleware, loadingBarMiddleware() ]
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

  sagaMiddleware.run(Saga, store.dispatch)

  return store
}


export { configureStore }
