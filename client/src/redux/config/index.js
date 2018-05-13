const HOST = '132.148.157.82'
    , PORT = process.env.NODE_ENV == 'production' ? '8081' : '3031'
    , BASE = `http://${HOST}:${PORT}`
    , API  = `${BASE}/api`
;


export default {
  user    : `${API}/user`,
  client  : `${API}/client`,
  product : `${API}/product`,
  bag     : `${API}/bag`,
  basket  : `${API}/basket`,
  order   : `${API}/order`,
}
