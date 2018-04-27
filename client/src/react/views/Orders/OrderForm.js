import React, { Component } from 'react'
import {Row, Col, FormGroup, Input, Label, ListGroup, ListGroupItem} from 'reactstrap'
import Basket from './Basket'


export default class OrderForm extends Component {

  state = {
    basket: [],
    basketType: '',
    familyBasket: [],
    discoveryBasket: [],
    focusBasketId: null,
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
        clientId: this.props.data.client_id
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
    if (id) {
      basket =  basket.map(product => {
                  if (product._id == id) product.quantity = eventQuantity
                  return product
                })
    }
    this.setState({basket, basketType: 'special', focusBasketId: id})
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
                    products={this.props.products} />
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac'>
          <Col md="3">
            <Label>Prix totale</Label>
          </Col>
          <Col xs="12" md="9">
            <Input type="number" name="total_price" defaultValue={this.props.data.total_price} disabled />
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac'>
          <Col md="3">
            <Label>Status</Label>
          </Col>
          <Col xs="12" md="9">
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.state.status=='open'} value="open" onChange={this.statusHandler} />
              <Label className="form-check-label" check>ouvert</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.state.status=='pending'} value="pending" onChange={this.statusHandler} />
              <Label className="form-check-label" check>en attente</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.state.status=='close'} value="close" onChange={this.statusHandler} />
              <Label className="form-check-label" check>fermé</Label>
            </FormGroup>
          </Col>
        </FormGroup>
      </Col>
    </Row>
  }

}
