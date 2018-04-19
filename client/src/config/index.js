const HOST = 'localhost'
    , PORT = '3031'
    , BASE = `http://${HOST}:${PORT}`
    , API  = `${BASE}/api`
;


export default {
  user : `${API}/user`,
  client : `${API}/client`,
  product : `${API}/product`
}
