
const initFlags = {
  isFetching: false,
  failure: false,
  error: null
}

const initialState = {
  ...initFlags,
  data: [],
  loggedIn: localStorage.getItem('loggedIn') == 'true'
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'PENDING_USER':    return { ...state, ...initFlags, isFetching: true };
    case 'FULFILLED_USER':  return { ...state, ...initFlags, ...action.payload };
    case 'REJECTED_USER':   return { ...state, isFetching: false, failure: true, error: action.payload };
    default: return state;
  }
}
