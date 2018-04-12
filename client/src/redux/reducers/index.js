'use strict'

import { combineReducers } from 'redux'

import clients from './clients'
import user from './user'

const Reducers = combineReducers({
  clients,
  user
})


export default Reducers
