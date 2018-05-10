'use strict'

import { applyMiddleware, createStore } from 'redux'
import globalReducers from 'ayla-client/redux/reducers'
import multi from 'redux-multi'
import thunk from 'redux-thunk'
import promise from 'redux-promise'

// TODO enhence this

export function configureStore () {
  return applyMiddleware(thunk, multi, promise)(createStore)(globalReducers)
}
