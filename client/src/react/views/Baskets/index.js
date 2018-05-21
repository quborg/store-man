import React, { Component } from 'react';
import {connect} from 'react-redux'
import {getBaskets, getProducts} from 'ayla-client/redux/actions/api'
import BasketCard from './BasketCard'
import BasketForm from './BasketForm'
import {Container, Row} from 'reactstrap'
import {Modal} from 'ayla-client/react/components/Notifications'
import {ButtonsControl} from 'ayla-client/react/components/Buttons'
import {getCollectionById, getCollectionByKeyValue} from 'ayla-helper/ext'
import {MSG} from 'ayla-client/react/views/settings'


const DISPLAY         = 'panier'


class Baskets extends Component {

  static defaultProps = {
    data: []
  }

  state = {
    basket: {},
    selected: false,
    isOpen: false,
    theme: '',
    display: DISPLAY
  }

  componentWillMount() {
    this.props.dispatch(getProducts())
    this.props.dispatch(getBaskets())
  }

  onSelectBasket(basket, isTheSame=basket._id==this.state.basket._id) {
    isTheSame
    ? this.resetSelection()
    : this.setState({basket, selected: true})
  }

  resetSelection  = () => {
    this.setState({basket: {}, selected: false})
  }

  openModal       = theme => {
    this.setState({ isOpen:true, theme })
  }

  closeModal      = () => {
    this.setState({isOpen:false})
  }

  render() {
    const [
            {isOpen, theme, display, basket, selected},
            {data, products, dispatch},
            {closeModal, openModal, resetSelection}
          ] = [this.state, this.props, this]
        , modalProps  = {isOpen, theme, display, modalWillClose:closeModal, noProgress:true}
        , basketProps = {dispatch, basket, products, resetSelection}

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les paniers</h2>
            </div>
            <div className='fx fx-je fx-rev pt-3 ops-btns'>
              <ButtonsControl {...{selected, openModal, display}} />
            </div>
          </Row>
          <Row className='pt-5 fx fx-wrap fx-ja'>
            {
              data.length
              ? data.map((item, i) => <BasketCard  key={'key-basket-card-'+item._id}
                                                    _class={(i+1)%4?'i-right':''}
                                                    {...{...item, selected: selected&&item._id==basket._id}}
                                                    onClick={() => this.onSelectBasket(item)} />)
              : MSG.load.basket
            }
          </Row>
        </Container>
        <Modal {...modalProps}>
          <BasketForm {...basketProps} />
        </Modal>
      </div>
    )
  }

}

const mapState = ({baskets:{data}, products:{data:products}}, ownProps) => {
  if (data && data.length) {
    let basketFamily      = getCollectionByKeyValue(data, 'name', 'Familiale')
      , basketDecouverte  = getCollectionByKeyValue(data, 'name', 'Decouverte')
    data = [{...basketFamily}, {...basketDecouverte}]
  }
  data.map( (basket, b) => {
    if (basket && basket.products && basket.products.length)
      basket.products.map( (product, p) => {
        let {image, name, price} = getCollectionById(products, product._id)
        data[b].products[p] = {...product, image, name, price}
      })
  })

  ownProps =  { ...ownProps, data, products }
  return ownProps
}

export default connect(mapState)(Baskets)
