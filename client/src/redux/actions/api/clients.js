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


export const getClients = () => dispatch => {
  dispatch({ type: 'PENDING_CLIENTS' })

  const url = urls.client + 's'
  fetch(url, {headers})
    .then(res  => res.json())
    .then(data => {
      dispatch({
        type: 'FULFILLED_CLIENTS',
        payload: data
      })
    })
    .catch(e   => { dispatch({ type:'REJECTED_CLIENTS', payload: e }) })
}


export const saveClient = data => dispatch => {
  dispatch({ type: 'PENDING_CLIENT' })

  let {_id} = data
    , url = urls.client +'/'+ (_id||'')
    , method = _id ? 'PUT' : 'POST'
    , _options = options.ppt(method, data)

  fetch(url, _options)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_CLIENT' }); dispatch(getClients()) })
    .catch(e   => { dispatch({ type:'REJECTED_CLIENT', payload: e }) })
}


export const arcClient = _id => dispatch => {

  const data = {_id, archived: true}
  dispatch( saveClient(data) )

}

export const unaClient = _id => dispatch => {

  const data = {_id, archived: false}
  dispatch( saveClient(data) )

}


export const delClient = id => dispatch => {
  dispatch({ type: 'PENDING_CLIENT' })

  const url = urls.client +'/'+ id
  fetch(url, options.del)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_CLIENT' }); dispatch(getClients()) })
    .catch(e   => { dispatch({ type:'REJECTED_CLIENT', payload: e }) })
}
