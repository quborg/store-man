
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
    case 'PENDING_BASKETS':    return { ...state, ...initFlags, isFetching: true };
    case 'FULFILLED_BASKETS':  return { ...state, ...initFlags, data: action.payload };
    case 'REJECTED_BASKETS':   return { ...state, isFetching: false, failure: true, error: action.payload };
    default: return state;
  }
}
