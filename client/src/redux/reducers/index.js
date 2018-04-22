'use strict'

import { combineReducers } from 'redux'

import user from './user'
import orders from './orders'
import clients from './clients'
import products from './products'

const Reducers = combineReducers({
  user,
  orders,
  clients,
  products
})


export default Reducers
