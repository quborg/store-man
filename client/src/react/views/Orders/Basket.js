import React, { PureComponent } from 'react'
import {Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import {computeTotalPrice} from './helper'



export default class Basket extends PureComponent {

  state = {
    basket_type: '',
    leftBasket: [],
    selectedProducts: [],
    addMode: false,
    focusBasketId: null
  }

  componentWillMount() {
    this.props.theme == 'primary'
    ? this.setBasket()
    : this.setBasket(this.props.order.basket)
  }

  componentWillReceiveProps({order:{basket_type:nextType, basket:nextBasket}}) {
    console.log(this.state.basket_type=='special', nextType!='special', this.state.basket_type, nextType)
    if (this.state.basket_type != nextType) {
      nextType == 'special'
      ? this.props.order.basket != nextBasket
        ? this.setBasket(nextBasket)
        : null
      : this.setBasket([], nextType)
    }
  }

  setBasket(basket=[], basket_type=this.state.basket_type, leftBasket=[]) {
    // on update an order (or on custumize order type), we get products basket order, typed or less
    if (basket.length) {
      leftBasket =  this.props.products.reduce( (leftProducts, {_id, name, ...product}) => {
                      let notInBasket = true
                      basket.map( basketProduct => {
                        if (basketProduct._id == _id) notInBasket = false
                      })
                      if (notInBasket) leftProducts.push({ _id, name, quantity:0 })
                      return leftProducts
                    }, [])
    }
    // typefull basket on Mount or Receive Props
    if (basket_type && !basket.length) {
      basket = this.props.products.reduce( (products, {_id, name, ...product}) => {
                 let quantity = product[basket_type+'_unit']
                 quantity
                 ? products.push({ _id, name, quantity })
                 : leftBasket.push({ _id, name, quantity })
                 return products
               }, [])
    }
    // if (basket_type && basket_type!='special' && basket.length) {
    //
    // }
    // on Create new order, if basket form used before basket type, we take all products to leftBasket
    if (!basket_type && !basket.length) {
      leftBasket = this.props.products
    }
    this.setState({leftBasket, basket_type})
    let total_price = computeTotalPrice(basket, this.props.products)
    this.props.orderHandler({basket, total_price})
  }

  basketProductHandler = (selectedProduct, e) => {
    let selectedProducts = [...this.state.selectedProducts]
    if (e.target.checked) {
      selectedProducts = [...selectedProducts, selectedProduct]
    }
    else {
      selectedProducts =  selectedProducts.reduce( (products, item) => {
                            if (item._id!=selectedProduct._id) products.push(item)
                            return products
                          }, [])
    }
    this.setState({selectedProducts})
  }

  addModeBasket = () => {
    this.setState({addMode: true})
  }

  closeAddMode = () => {
    this.setState({addMode: false, selectedProducts: []})
  }

  saveSelectedToBasket = () => {
    let basket      = [ ...this.props.order.basket, ...this.state.selectedProducts ]
      , leftBasket  = this.state.leftBasket.reduce( (leftProducts, leftItem) => {
                        let itemNotInSelection = true
                        this.state.selectedProducts.map(selectedItem => {
                          if (leftItem._id == selectedItem._id) itemNotInSelection = false
                        })
                        if (itemNotInSelection) leftProducts.push(leftItem)
                        return leftProducts
                      }, [])
    this.setState({leftBasket})
    this.props.orderHandler({basket})
    this.closeAddMode()
  }

  removeBasketItem(productEvent) {
    let leftBasket  = [ ...this.state.leftBasket, productEvent ]
      , basket      = this.props.order.basket.reduce( (products, {_id, ...product}) => {
                        if (_id!==productEvent._id) products = [...products, {_id, ...product}]
                        return products
                      }, [])
    this.setState({leftBasket})
    this.props.orderHandler({basket})
  }

  basketHandler = (id, eventQuantity) => {
    let basket = []
    if (id) basket  = this.props.order.basket.map(product => {
                        if (product._id == id) product.quantity = Number(eventQuantity)
                        return product
                      })
    let total_price = computeTotalPrice(basket, this.props.products)

    this.setState({focusBasketId: id})
    this.props.orderHandler({basket, total_price, basket_type: 'special'})
  }

  render() {
    let {selectedProducts} = this.state
    return this.state.addMode
    ? <div className='basket-form'>
        <div className='basket-form-unit box-border fx fx-col'>
          {
            this.state.leftBasket.map( product =>
              <FormGroup check inline key={product._id}>
                <input className='form-check-input' type='checkbox' onChange={e => this.basketProductHandler(product,e)} />
                <label className='form-check-label'>{product.name}</label>
              </FormGroup>
            )
          }
        </div>
        {
          selectedProducts.length
          ? <button type='button' className='btn btn-warning' onClick={() => this.saveSelectedToBasket()}>
              <i className='fa fa-save lead' />
            </button>
          : null
        }
        <button type='button' className='btn btn-light' onClick={() => this.closeAddMode()}>
          <i className='fa fa-close lead' />
        </button>
      </div>
    : <div className='basket-form'>
        <div className='basket-form-unit'>
          {
            this.props.order.basket.length
            ? this.props.order.basket.map( product =>
                <InputGroup key={'key-basket-item-'+this.props.order.basket_type+'-'+product._id}>
                  <input hidden name='basket[][_id]' defaultValue={product._id||''} />
                  <InputGroupAddon addonType='prepend' style={{width:'220px'}}><InputGroupText style={{width:'100%'}}>{product.name}</InputGroupText></InputGroupAddon>
                  <input  type='number' step='0.1'
                          name='basket[][quantity]'
                          defaultValue={product.quantity||''}
                          onChange={e => this.basketHandler(product._id, e.target.value)}
                          autoFocus={this.state.focusBasketId==product._id}
                          placeholder='Quantité ..'
                          style={{width:'66px'}}
                          className='text-right' />
                  <InputGroupAddon addonType="append"><InputGroupText>DH</InputGroupText></InputGroupAddon>
                  <InputGroupAddon addonType='append' onClick={() => this.removeBasketItem(product)}><InputGroupText className='close-line'><i className='fa fa-close'/></InputGroupText></InputGroupAddon>
                </InputGroup>
              )
            : null
          }
        </div>
        <button type='button' className='btn btn-primary' onClick={() => this.addModeBasket()}>
          <i className='fa fa-plus lead' />
        </button>
      </div>
  }

}
