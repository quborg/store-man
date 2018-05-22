import { put, takeLatest } from 'redux-saga/effects';

import {getClients, getProducts, getBags, getBaskets, getOrders} from 'ayla-client/redux/actions/api'


/* Default Root () */
export default function* Saga(dispatch) {
  yield takeLatest("PENDING_STORE", action => fullfillStore(dispatch));
  // yield takeLatest("PENDING_ORDERS", action => fullfillOrders(dispatch));
}

/* worker: on STORE */
function* fullfillStore(dispatch) {
  try {
    yield dispatch(getClients())
    yield dispatch(getProducts())
    yield dispatch(getBags())
    yield dispatch(getBaskets())
    yield dispatch(getOrders())
    yield put({type: "FULFILLED_STORE"})
  }
  catch (e) {
    yield put({type: "REJECTED_STORE", payload: e});
  }
}
