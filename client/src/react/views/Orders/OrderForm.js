import React, { Component } from 'react'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText, ListGroup, ListGroupItem} from 'reactstrap'
import Basket from './Basket'


export default class OrderForm extends Component {

  state = {
    basket: [],
    basketType: '',
    familyBasket: [],
    discoveryBasket: [],
    focusBasketId: null,
    totalPrice: 0,
    status: '',
    clientId: '',
    clientName: '',
    activeSearch: false,
    searchList: []
  }

  componentWillMount() {
    if (this.props.theme == 'warning')
      this.setState({
        basket: this.props.data.basket,
        basketType: this.props.data.basket_type,
        status: this.props.data.status,
        clientId: this.props.data.client_id,
        totalPrice: this.props.data.total_price
      })
  }

  basketTypeHandler = e => {
    this.setState({basketType: e.target.value})
  }

  statusHandler = e => {
    this.setState({status: e.target.value})
  }

  searchListHandler = e => {
    let searchList  = []
      , keyword     = e.target.value
    if (keyword) {
      searchList  = this.props.clients.reduce(
                      (result, client) => {
                        let {firstname, lastname, adress} = client
                          , searchIn   = this.cleanNameAdress(client).toLowerCase()
                          , isMatching = searchIn.indexOf(keyword.toLowerCase()) > -1
                        if (isMatching) result.push(client)
                        return result
                      }, []
                    )
      this.setState({searchList, activeSearch: true, clientName: keyword})
    }
    else {
      this.setState({
        clientId: '',
        clientName: '',
        searchList: [],
        activeSearch: false
      })
    }
  }

  cleanNameAdress = ({firstname, lastname, adress}) =>
    (firstname?firstname+' ':'') +
    (lastname||'') +
    (adress?', '+adress:'')

  selectedClient = ({_id, firstname, lastname}) => {
    this.setState({
      clientId: _id,
      clientName: this.cleanNameAdress({firstname, lastname}),
      searchList: [],
      activeSearch: false
    })
  }

  updatedBasketType = (basket=[], id, eventQuantity) => {
    let {totalPrice} = this.state
    if (id) // save input basket event on component receives props
      basket =  basket.map(product => {
                  if (product._id == id) product.quantity = Number(eventQuantity)
                  return product
                })

    this.setState({
      basket,
      totalPrice,
      basketType: 'special',
      focusBasketId: id
    })
    this.updateTotalPrice(basket) // update totalPrice too
  }

  updateTotalPrice = basket => {
    let {totalPrice} = this.state
    if (basket.length) { // update totalPrice
      totalPrice = this.getTotalPrice(basket)
    }
    this.setState({totalPrice})
  }

  getTotalPrice(basketProducts) {
    return  basketProducts.reduce(
              (total, {_id, quantity}) => {
                let price = this.getProductKey(_id, 'price')
                total += Number(quantity||0) * price
                return total
              }, 0
            )
            || 0
  }

  getProductKey(id, key) {
    let result = 0
      , {products} = this.props

    if (products && !products.length) return 0
    for(let i in products) {
      if (products[i]._id == id) result = products[i].price
    }
    return result
  }

  render() {
    const keys      = ['client_id', 'basket_type', 'total_price']
        , listClass = this.state.activeSearch ? 'active' : ''

    if (this.props.theme == 'danger') {
      return <Row className='fx fx-jc'>
        <h4 className='color-danger pb-2'>Vous êtes sur le point de supprimer la Commande suivante :</h4>
        <div className='entity-del'>
          {
            keys.map( key =>
              <div key={`key-del-order-${key}`} className='b'>
                {this.props.data[key]}
              </div>
            )
          }
        </div>
      </Row>
    }

    return <Row className={`form-${this.props.theme}`}>
      <Col xs="12">
        <Input hidden type="text" name="_id" defaultValue={this.props.data._id}/>
        <FormGroup row className='fx fx-ac'>
          <Col md="3">
            <Label>Client</Label>
          </Col>
          <Col xs="12" md="9">
            <Input hidden type="text" name="client_id" value={this.state.clientId} />
            <Input type="text" value={this.state.clientName} onChange={this.searchListHandler} placeholder="Nom du client" />
            <div className={`search-list-wrapper ${listClass}`}>
              <ListGroup className="search-list-box">
                {
                  this.state.searchList.map( client =>
                    <ListGroupItem key={client._id} className='pointer' onClick={() => this.selectedClient(client)}>
                      {this.cleanNameAdress(client)}
                    </ListGroupItem>
                  )
                }
              </ListGroup>
            </div>
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac'>
          <Col md="3">
            <Label>Formule</Label>
          </Col>
          <Col md="9">
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="basket_type" checked={this.state.basketType=='family'} value="family" onChange={this.basketTypeHandler} />
              <Label className="form-check-label" check>Familiale</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="basket_type" checked={this.state.basketType=='discovery'} value="discovery" onChange={this.basketTypeHandler} />
              <Label className="form-check-label" check>Découverte</Label>
            </FormGroup>
          </Col>
        </FormGroup>
        <FormGroup row className='fx'>
          <Col md="3">
            <Label>Panier</Label>
          </Col>
          <Col xs="12" md="9">
            <Basket theme={this.props.theme}
                    basket={this.state.basket}
                    updatedBasketType={this.updatedBasketType}
                    focusBasketId={this.state.focusBasketId}
                    type={this.state.basketType}
                    updateTotalPrice={this.updateTotalPrice}
                    products={this.props.products} />
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac'>
          <Col md="3">
            <Label>Prix totale</Label>
          </Col>
          <Col xs="12" md="9">
            <InputGroup>
              <Input type="number" name="total_price" value={this.state.totalPrice} disabled className='b text-right' />
              <InputGroupAddon addonType="append"><InputGroupText style={{width:'64px'}}>DH</InputGroupText></InputGroupAddon>
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac order-status-groups'>
          <Col md="3">
            <Label>Status</Label>
          </Col>
          <Col xs="12" md="9" className='status-group'>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.state.status=='open'} value="open" onChange={this.statusHandler} />
              <Label className="form-check-label" check>Ouvert</Label>
            </FormGroup>
          </Col>
          <Col md="3"></Col>
          <Col xs="12" md="9" className='status-group'>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.state.status=='pending'} value="pending" onChange={this.statusHandler} />
              <Label className="form-check-label" check>En attente de verification de stock</Label>
            </FormGroup>
          </Col>
          <Col md="3"></Col>
          <Col xs="12" md="9" className='status-group'>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.state.status=='stock'} value="stock" onChange={this.statusHandler} />
              <Label className="form-check-label" check>En attente de payement</Label>
            </FormGroup>
          </Col>
          <Col md="3"></Col>
          <Col xs="12" md="9" className='status-group'>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.state.status=='close'} value="close" onChange={this.statusHandler} />
              <Label className="form-check-label" check>Cloturé</Label>
            </FormGroup>
          </Col>
        </FormGroup>
      </Col>
    </Row>
  }

}
