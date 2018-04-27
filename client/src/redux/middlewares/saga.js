import { put, takeLatest } from 'redux-saga/effects';

import {getClients, getProducts, getOrders} from 'ayla-client/redux/actions/api'


/* Default Root () */
export default function* Saga(dispatch) {
  yield takeLatest("PENDING_STORE", action => fullfillStore(dispatch));
}

/* worker: on STORE */
function* fullfillStore(dispatch) {
  try {
    yield dispatch(getClients())
    yield dispatch(getProducts())
    yield dispatch(getOrders())
    yield put({type: "FULLFILLED_STORE"})
  }
  catch (e) {
    yield put({type: "REJECTED_STORE", payload: e});
  }
}
