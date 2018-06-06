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


export const getBaskets = () => dispatch => {
  dispatch({ type: 'PENDING_BASKETS' })

  const url = urls.basket + 's'
  fetch(url, {headers})
    .then(res  => res.json())
    .then(data => {
      dispatch({
        type: 'FULFILLED_BASKETS',
        payload: data
      })
    })
    .catch(e   => { dispatch({ type:'REJECTED_BASKETS', payload: e }) })
}


export const saveBasket = data => dispatch => {
  dispatch({ type: 'PENDING_BASKET' })

  let {_id} = data
    , url = urls.basket +'/'+ (_id||'')
    , method = _id ? 'PUT' : 'POST'
    , _options = options.ppt(method, data)

  return  fetch(url, _options)
            .then(res  => res.json())
            .then(json => { dispatch({ type: 'FULFILLED_BASKET' }); dispatch(getBaskets()); return json._id })
            .catch(e   => { dispatch({ type:'REJECTED_BASKET', payload: e }) })
}


export const delBasket = id => dispatch => {
  dispatch({ type: 'PENDING_BASKET' })

  const url = urls.basket +'/'+ id
  fetch(url, options.del)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_BASKET' }); dispatch(getBaskets()) })
    .catch(e   => { dispatch({ type:'REJECTED_BASKET', payload: e }) })
}
