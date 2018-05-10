'use strict'

import { combineReducers } from 'redux'

import user from './user'
import clients from './clients'
import products from './products'
import bags from './bags'
import baskets from './baskets'
import orders from './orders'

const Reducers = combineReducers({
  user,
  clients,
  products,
  bags,
  baskets,
  orders,
})


export default Reducers
