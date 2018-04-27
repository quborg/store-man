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
    })
    .catch(e   => {
      dispatch({ type:'REJECTED_USER', payload: e })
    })
}


export const logout = () => dispatch => {
  // dispatch({ type: 'PENDING_USER' })
  // let url = urls.user + '/logout'
  // fetch(url, options.logout)
  //   .then(res  => res.json())
  //   .then(data => {
      dispatch({
        type: 'FULFILLED_USER',
        payload: {loggedIn: false}
      })
      localStorage.setItem('loggedIn', false)
    // })
    // .catch(e   => {
    //   dispatch({ type:'REJECTED_USER', payload: e })
    // })
}
