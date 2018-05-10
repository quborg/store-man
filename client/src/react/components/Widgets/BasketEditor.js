import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import {Image} from 'ayla-client/react/components/Media'
import {getCollectionById} from 'ayla-helper/ext'


class BasketEditor extends Component {

  static defaultProps = {
    basket: [],
    basketHandler: () => {}
  }

  state = {
    leftBasket: [],
    selectedProducts: [],
    addMode: false
  }

  componentWillMount() {
    this.setBasket()
  }

  componentWillReceiveProps(nextProps) {
    this.setBasket(nextProps.basket)
  }

  setBasket(basket=[...this.props.basket]) {
    let products = [...this.props.products]
    let leftBasket =  products.reduce( (leftProducts, {_id, name, image, price, ...product}) => {
                        let notInBasket = true
                        basket.map( basketProduct => {
                          if (basketProduct._id == _id) notInBasket = false
                        })
                        if (notInBasket) leftProducts.push({ _id, name, image, price, quantity:0 })
                        return leftProducts
                      }, [])
    this.setState({leftBasket})
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
    let basket      = [ ...this.props.basket, ...this.state.selectedProducts ]
      , leftBasket  = this.state.leftBasket.reduce( (leftProducts, leftItem) => {
                        let itemNotInSelection = true
                        this.state.selectedProducts.map(selectedItem => {
                          if (leftItem._id == selectedItem._id) itemNotInSelection = false
                        })
                        if (itemNotInSelection) leftProducts.push(leftItem)
                        return leftProducts
                      }, [])
    this.setState({leftBasket})
    this.props.basketHandler({products: basket})
    this.closeAddMode()
  }

  removeBasketItem(productEvent) {
    let leftBasket  = [ ...this.state.leftBasket, productEvent ]
      , basket      = this.props.basket.reduce( (products, {_id, ...product}) => {
                        if (_id!==productEvent._id) products = [...products, {_id, ...product}]
                        return products
                      }, [])
    this.setState({leftBasket})
    this.props.basketHandler({products: basket})
  }

  productHandler = (id, eventQuantity) => {
    let basket = []
    if (id) basket  = this.props.basket.map( product => {
                        if (product._id == id) product.quantity = Number(eventQuantity)
                        return product
                      })
    this.setState({focusBasketId: id})
    this.props.basketHandler({products: basket})
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
    : <div>
        <div className='basket-form-unit'>
          {
            this.props.basket.map( product =>
              <InputGroup key={'key-basket-item-'+product._id}>
                <input hidden defaultValue={product._id||''} />
                <InputGroupAddon addonType='prepend' style={{width:'203px'}}>
                  <InputGroupText style={{width:'100%', padding: '0'}}>
                    <span className='sm-inline-image'>
                      <Image src={product.image} alt='Image aperçu' className='sm-image-preview' />
                    </span>
                    <span style={{padding:'0.375rem 0.75rem', width:'118px'}} className='ellipse text-left pl-2'>{product.name}</span>
                    <span className='ml-auto mr-2'>{(product.price||0).toFixed(2)}DH</span>
                  </InputGroupText>
                </InputGroupAddon>
                <input  type='number' step='0.1'
                        name='basket[][quantity]'
                        defaultValue={product.quantity||''}
                        onChange={e => this.productHandler(product._id, e.target.value)}
                        placeholder='.. 0Kg'
                        style={{width:'66px'}}
                        className='text-right' />
                <InputGroupAddon addonType='append'><InputGroupText>KG</InputGroupText></InputGroupAddon>
                <InputGroupAddon addonType='append' onClick={() => this.removeBasketItem(product)}><InputGroupText className='close-line pointer'><i className='fa fa-close'/></InputGroupText></InputGroupAddon>
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

const mapState = ({products:{data:products}}, {basket, ...ownProps}) => {
  if (basket && basket.length) {
    basket.map( (product, p) => {
      let {image, name, price} = getCollectionById(products, product._id)
      basket[p] = {...product, image, name, price}
    })
  }
  ownProps = {...ownProps, basket, products}
  return ownProps
}

export default connect(mapState)(BasketEditor)
