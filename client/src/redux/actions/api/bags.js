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


export const getBags = () => dispatch => {
  dispatch({ type: 'PENDING_BAGS' })

  const url = urls.bag + 's'
  fetch(url, {headers})
    .then(res  => res.json())
    .then(data => {
      dispatch({
        type: 'FULFILLED_BAGS',
        payload: data
      })
    })
    .catch(e   => { dispatch({ type:'REJECTED_BAGS', payload: e }) })
}


export const saveBag = data => dispatch => {
  dispatch({ type: 'PENDING_BAG' })
  let {_id} = data
    , url = urls.bag +'/'+ (_id||'')
    , method = _id ? 'PUT' : 'POST'
    , _options = options.ppt(method, data)

  fetch(url, _options)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_BAG' }); dispatch(getBags()) })
    .catch(e   => { dispatch({ type:'REJECTED_BAG', payload: e }) })
}

export const arcBag = _id => dispatch => {

  const data = {_id, archived: true}
  dispatch( saveBag(data) )

}

export const delBag = id => dispatch => {
  dispatch({ type: 'PENDING_BAG' })

  const url = urls.bag +'/'+ id
  fetch(url, options.del)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_BAG' }); dispatch(getBags()) })
    .catch(e   => { dispatch({ type:'REJECTED_BAG', payload: e }) })
}
