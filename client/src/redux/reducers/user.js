
const initFlags = {
  isFetching: false,
  failure: false,
}

const initialState = {
  ...initFlags,
  loggedIn: localStorage.getItem('loggedIn') == 'true'
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'PENDING_USER':    return { ...state, ...initFlags, isFetching: true };
    case 'FULFILLED_USER':  return { ...state, ...initFlags, ...action.payload };
    case 'LOGGED_OUT_USER': return { ...state, ...initFlags, ...action.payload };
    case 'REJECTED_USER':   return { ...state, isFetching: false, failure: true };
    default: return state;
  }
}
