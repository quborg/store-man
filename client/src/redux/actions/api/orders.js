import urls from 'ayla-client/redux/config'

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


export const getOrders = () => dispatch => {
  dispatch({ type: 'PENDING_ORDERS' })

  const url = urls.order + 's'
  fetch(url, {headers})
    .then(res  => res.json())
    .then(data => {
      dispatch({
        type: 'FULFILLED_ORDERS',
        payload: data
      })
    })
    .catch(e   => { dispatch({ type:'REJECTED_ORDERS', payload: e }) })
}


export const saveOrder = data => dispatch => {
  console.log('save order', data);
  return;
  dispatch({ type: 'PENDING_ORDER' })

  let {_id} = data
    , url = urls.order +'/'+ (_id||'')
    , method = _id ? 'PUT' : 'POST'
    , _options = options.ppt(method, data)

  fetch(url, _options)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_ORDER' }); dispatch(getOrders()) })
    .catch(e   => { dispatch({ type:'REJECTED_ORDER', payload: e }) })
}


export const delOrder = id => dispatch => {
  dispatch({ type: 'PENDING_ORDER' })

  const url = urls.order +'/'+ id
  fetch(url, options.del)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_ORDER' }); dispatch(getOrders()) })
    .catch(e   => { dispatch({ type:'REJECTED_ORDER', payload: e }) })
}
