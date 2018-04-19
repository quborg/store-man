'use strict'

import { combineReducers } from 'redux'

import user from './user'
import clients from './clients'
import products from './products'

const Reducers = combineReducers({
  user,
  clients,
  products
})


export default Reducers
