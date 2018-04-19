
const initFlags = {
  isFetching: false,
  failure: false,
  error: null
}

const initialState = {
  ...initFlags,
  data: []
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'PENDING_PRODUCTS':    return { ...state, ...initFlags, isFetching: true };
    case 'FULFILLED_PRODUCTS':  return { ...state, ...initFlags, data: action.payload };
    case 'REJECTED_PRODUCTS':   return { ...state, isFetching: false, failure: true, error: action.payload };
    default: return state;
  }
}
