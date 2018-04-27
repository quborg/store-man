import React, { Component } from 'react'
import {Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'



export default class Basket extends Component {

  state = {
    basket: [],
    leftBasket: [],
    selectedProducts: [],
    addMode: false,
    stack: 0,
  }

  inputBasket = []

  componentWillMount() {
    this.props.theme == 'primary'
    ? this.setBasket()
    : this.setBasket(this.props.basket)
  }

  componentWillReceiveProps({type:nextType, basket:nextBasket}) {
    if(this.props.type != nextType) {
      nextType == 'special'
      ? this.setBasket(nextBasket)
      : this.setBasket([], nextType)
    }
  }

  setBasket(basket=[], type=this.state.basketType, leftBasket=[]) {
    if (basket.length) { // on update an order (or on custumize type), we get products basket order, typed or less
      leftBasket =  this.props.products.reduce( (leftProducts, {_id, name, ...product}) => {
                      let notInBasket = true
                      basket.map( basketProduct => {
                        if (basketProduct._id == _id) notInBasket = false
                      })
                      if (notInBasket) leftProducts.push({ _id, name, quantity:0 })
                      return leftProducts
                    }, [])
    }
    if (type && !basket.length) { // typefull basket on Add order
      basket = this.props.products.reduce( (products, {_id, name, ...product}) => {
                 let quantity = product[type+'_unit']
                 quantity
                 ? products.push({ _id, name, quantity })
                 : leftBasket.push({ _id, name, quantity })
                 return products
               }, [])
    }
    if (!type && !basket.length) { // on Create new order, if basket form used before basket type, we take all to leftBasket
      leftBasket = this.props.products
    }
    this.setState({basket, leftBasket})
    this.props.updateTotalPrice(basket)
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
    let basket      = [ ...this.state.basket, ...this.state.selectedProducts ]
      , leftBasket  = this.state.leftBasket.reduce( (leftProducts, leftItem) => {
                        let itemNotInSelection = true
                        this.state.selectedProducts.map(selectedItem => {
                          if (leftItem._id == selectedItem._id) itemNotInSelection = false
                        })
                        if (itemNotInSelection) leftProducts.push(leftItem)
                        return leftProducts
                      }, [])
    this.setState({basket, leftBasket})
    this.closeAddMode()
    this.props.updatedBasketType(basket)
  }

  removeBasketItem(productEvent) {
    let leftBasket  = [ ...this.state.leftBasket, productEvent ]
      , basket      = this.state.basket.reduce( (products, {_id, ...product}) => {
                        if (_id!==productEvent._id) products = [...products, {_id, ...product}]
                        return products
                      }, [])
    this.setState({basket, leftBasket})
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
            this.state.basket.map( product =>
              <InputGroup key={'key-basket-item-'+this.props.type+'-'+product._id}>
                <input hidden name='basket[][_id]' defaultValue={product._id} />
                <InputGroupAddon addonType='prepend' style={{width:'220px'}}><InputGroupText style={{width:'100%'}}>{product.name}</InputGroupText></InputGroupAddon>
                <input  type='number' step='0.1'
                        name='basket[][quantity]'
                        defaultValue={product.quantity}
                        onChange={e => this.props.updatedBasketType(this.state.basket, product._id, e.target.value)}
                        autoFocus={this.props.focusBasketId==product._id}
                        placeholder='Quantité ..'
                        style={{width:'66px'}}
                        className='text-right' />
                <InputGroupAddon addonType="append"><InputGroupText>DH</InputGroupText></InputGroupAddon>
                <InputGroupAddon addonType='append' onClick={() => this.removeBasketItem(product)}><InputGroupText className='close-line'><i className='fa fa-close'/></InputGroupText></InputGroupAddon>
              </InputGroup>
            )
          }
        </div>
        <button type='button' className='btn btn-primary' onClick={() => this.addModeBasket()}>
          <i className='fa fa-plus lead' />
        </button>
      </div>
  }

}
