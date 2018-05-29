import urls from 'ayla-client/redux/config'
import {saveBasket, arcBasket, delBasket} from './baskets'
import {getCollectionByKeyValue} from 'ayla-helper/ext'


let   baskets           = []
const basketFamily      = getCollectionByKeyValue(baskets, 'name', 'Familiale')
    , basketDecouverte  = getCollectionByKeyValue(baskets, 'name', 'Decouverte')

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

function saveOrderOneCall(url, options) {
  fetch(url, options)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_ORDER' }); dispatch(getOrders()) })
    .catch(e   => { dispatch({ type:'REJECTED_ORDER', payload: e }) })
}


/**/
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


/**/
export const saveOrder = (data, archive) => dispatch => {
  dispatch({ type: 'PENDING_ORDER' })
  let bags = []
    , {basket, bags:storeBags} = data
  delete data.basket
  delete data.bags

  if (storeBags && storeBags.length) { // desc sort
    storeBags =  storeBags.sort( ({volume:vol1},{volume:vol2}) => vol2 > vol1 )
  }
  // TODO bags calcule not proper
  if (basket && basket.products) {
    basket.products.map( ({_id:pid, name:pname, quantity, ...product}) => {
      let bag = {pid, pname, items: []}
      if (storeBags && storeBags.length) {
        storeBags.map( ({_id:bid, volume, name}, i) => {
          let coeff  = quantity/volume
            , result = Math.round(quantity/volume)
          if (result) {
            bag.items.push({name, bid, quantity:result})
            quantity = quantity % volume
          } else {
            if (storeBags.length==i+1 && coeff>0) { // last loop
              bag.items.push({name, bid, quantity:1})
            }
          }
        })
      }
      bags.push(bag)
    })
  }

  if (basket && !basket.name) basket.total = data.total

  let _id       = data ? data._id : ''
    , _data     = {...data, bags, basket}
    , url       = urls.order +'/'+ (_id||'')
    , method    = _id ? 'PUT' : 'POST'
    , _options  = options.ppt(method, _data)

  if (basket && basket.name) {
    saveOrderOneCall(url, _options)
  } else {
    if (basket._id) {
      dispatch(saveBasket(basket))
      saveOrderOneCall(url, _options)
    } else {
      saveOrderTwoCalls()
    }
  }

  function saveOrderTwoCalls() {
    dispatch(saveBasket(basket))
      .then(id => {
        let __data = {..._data, basket_id: id}
        _options  = options.ppt(method, __data)
        saveOrderOneCall(url, _options)
      })
  }

}


/**/
export const arcOrder = ({_id, basket_id}, _baskets) => dispatch => {
  dispatch({ type: 'PENDING_ORDER' })

  let data      = {_id, archived: true}
    , url       = urls.order +'/'+ _id
    , method    = 'PUT'
    , _options  = options.ppt(method, data)

  baskets = _baskets
  if (basket_id!=basketFamily._id && basket_id!=basketDecouverte._id)
    dispatch( arcBasket(basket_id) )
      .then(id => { if (id) saveOrderOneCall(url, _options) })
  else
    saveOrderOneCall(url, _options)

}


/**/
export const delOrder = ({_id, basket_id}, _baskets) => dispatch => {
  dispatch({ type: 'PENDING_ORDER' })

  baskets = _baskets
  if (basket_id!=basketFamily._id && basket_id!=basketDecouverte._id)
    dispatch(delBasket(basket_id))

  const url = urls.order +'/'+ _id
  fetch(url, options.del)
    .then(res  => res.json())
    .then(data => { dispatch({ type: 'FULFILLED_ORDER' }); dispatch(getOrders()) })
    .catch(e   => { dispatch({ type:'REJECTED_ORDER', payload: e }) })
}
