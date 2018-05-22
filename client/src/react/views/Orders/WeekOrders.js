import React, { Component } from 'react';
import {connect} from 'react-redux'
import moment from 'moment'
import {getProducts, getBags, getBaskets, getOrders} from 'ayla-client/redux/actions/api'
import {getCollectionById, getCollectionByKeyValue} from 'ayla-helper/ext'
import WeekOrdersCard from './WeekOrdersCard'
import {Container, Row} from 'reactstrap'

const NO_PRODUCT_MSG  = 'Aucun produit enregistré !'


class WeekOrders extends Component {

  static defaultProps = {
    data: []
  }

  componentWillMount() {
    this.props.dispatch(getProducts())
    this.props.dispatch(getBags())
    this.props.dispatch(getBaskets())
    this.props.dispatch(getOrders())
  }

  render() {
    const {data} = this.props

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Produits de la semaine</h2>
            </div>
          </Row>
          <Row className={'pt-5 items-history fx fx-wrap'}>
            {
              data.length
              ? data.map((item, i) => <WeekOrdersCard key={'key-prod-card-'+item._id} {...{...item}} _class={(i+1)%4?'i-right':''}/>)
              : NO_PRODUCT_MSG
            }
          </Row>
        </Container>
      </div>
    )
  }
}

const mapState = ({orders:{data:orders}, bags:{data:bags}, baskets:{data:baskets}, products:{data:products}}, ownProps) => {
  let data = [], quantities = {}, tags = {}
  if (bags && bags.length) { // desc bags by volume
    bags = bags.sort( ({volume:vol1},{volume:vol2}) => vol2 > vol1 )
  }
  if (products.length) {
    data = products.map( ({_id, image, name}) => {
      quantities  = {...quantities, [_id]:0 }
      tags        = {...tags, [_id]:[]}
      return {_id, image, name}
    })
  }
  if (orders.length) { // total summary
    const firstDay  = moment().day(0).utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0})
        , lastDay   = moment().day(7).utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0})
    orders =  orders.reduce( (orders, order) => {
                const orderDay = moment(order.created_at)
                if (orderDay>=firstDay && orderDay<lastDay) orders.push(order)
                return orders
              }, [])
    orders.map( ({basket_id, bags:_bags}) => {
      let basket = getCollectionById(baskets, basket_id)
      if (basket.products && basket.products.length) {
        basket.products.map( ({quantity, _id}) => {
          quantities[_id] += Number(quantity)
        })
      }
      if (_bags && _bags.length) {
        _bags.map( ({pid, items}) => {
          if (items && items.length) {
            items.map( ({bid, quantity}) => {
              let {image=''}  = getCollectionById(bags, bid)
              if (tags[pid] && tags[pid].length) {
                // console.log('product tags', pid, tags[pid]);
                tags[pid] = tags[pid].map( tag => {
                              if (tag.bid==bid) tag.quantity += Number(quantity)
                              return tag
                            })
              } else {
                tags[pid].push({bid, image, quantity})
              }
            })
          }
        })
      }
    })
    // console.log('tags', tags);
  }
  if (data.length) { // add bags from orders & total quantities
    data =  data.map( ({_id, ...product}) => {
              return {_id, ...product, totalQuantity:quantities[_id], tags:tags[_id]}
            })
  }

  // console.log('data', data);
  ownProps = {...ownProps, data}
  return ownProps
}

export default connect(mapState)(WeekOrders)
