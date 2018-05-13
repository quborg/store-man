import urls from 'ayla-client/redux/config'

const headers = { 'Content-Type': 'application/json' }
    , options = {
        login: (username, password) => ({
          method: 'POST',
          body: JSON.stringify({username, password}),
          headers
        }),
        logout: {
          headers
        }
      }
    ;


export const login = (username, password) => dispatch => {
  dispatch({ type: 'PENDING_USER' })
  let url = urls.user + '/login'
  fetch(url, options.login(username, password))
    .then(res  => res.json())
    .then(data => {
      dispatch({
        type: 'FULFILLED_USER',
        payload: {data, loggedIn: true}
      })
      localStorage.setItem('loggedIn', true)
      localStorage.setItem('user_id', data._id)
    })
    .catch(e   => {
      dispatch({ type:'REJECTED_USER', payload: e })
    })
}


export const logout = () => dispatch => {
  dispatch({ type: 'PENDING_USER' })
  let url = urls.user + '/logout/' + localStorage.getItem('user_id')
  return fetch(url)
    .then(res  => res.json())
    .then(data => {
      dispatch({
        type: 'LOGGED_OUT_USER',
        payload: {loggedIn: false}
      })
      localStorage.setItem('loggedIn', false)
      localStorage.setItem('user_id', '')
      return true;
    })
    .catch(e   => {
      dispatch({ type:'REJECTED_USER', payload: e })
    })
}
