import urls from 'store-man-client/redux/config'

const headers = { 'Content-Type': 'application/json' }
    , options = {
        ppt: (method, data) => ({
          method,
          body: JSON.stringify(data),
          headers
        }),
        del: {
          method: 'DELETE',
          headers
        }
      }


export const getProducts = () => dispatch => {
  dispatch({ type: 'PENDING_PRODUCTS' })

  const url = urls.product + 's'
  fetch(url, {headers})
    .then(res  => res.json())
    .then(data => {
      dispatch({
        type: 'FULFILLED_PRODUCTS',
        payload: data
      })
    })
    .catch(e   => { dispatch({ type:'REJECTED_PRODUCTS', payload: e }) })
}


export const saveProduct = data => dispatch => {
  dispatch({ type: 'PENDING_PRODUCT' });

  let {_id} = data
    , url = urls.product +'/'+ (_id||'')
    , method = _id ? 'PUT' : 'POST'
    , _options = options.ppt(method, data)

  fetch(url, _options)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_PRODUCT' }); dispatch(getProducts()) })
    .catch(e   => { dispatch({ type:'REJECTED_PRODUCT', payload: e }) })
}


export const delProduct = id => dispatch => {
  dispatch({ type: 'PENDING_PRODUCT' });

  const url = urls.product +'/'+ id
  fetch(url, options.del)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_PRODUCT' }); dispatch(getProducts()) })
    .catch(e   => { dispatch({ type:'REJECTED_PRODUCT', payload: e }) })
}
