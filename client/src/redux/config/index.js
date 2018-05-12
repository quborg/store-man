const HOST = 'localhost'
    , PORT = process.env.NODE_ENV == 'production' ? '8888' : '3031'
    , BASE = `http://${HOST}:${PORT}`
    , API  = `${BASE}/api`
;

console.log('BASE', BASE);
export default {
  user    : `${API}/user`,
  client  : `${API}/client`,
  product : `${API}/product`,
  bag     : `${API}/bag`,
  basket  : `${API}/basket`,
  order   : `${API}/order`,
}
