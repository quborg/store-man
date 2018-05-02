import React, { Component } from 'react'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText, ListGroup, ListGroupItem} from 'reactstrap'
import Basket from './Basket'



export default class OrderForm extends Component {

  state = {
    clientName: '',
    activeSearch: false,
    searchList: [],
    familyBasket: [],
    discoveryBasket: []
  }

  componentWillMount() {
    if (this.props.theme == 'warning') // on update order
      this.setState({...this.props.order})
  }

  // shouldComponentUpdate(nextProps) {
  //   console.log('scu form', this.props.order.basket, nextProps.order.basket)
  //   if (this.props.order.basket !== nextProps.order.basket) {
  //     return false
  //   }
  //   return true
  // }

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
    else this.selectedClient({})
  }

  cleanNameAdress = ({firstname, lastname, adress}) =>
    (firstname?firstname+' ':'') +
    (lastname||'') +
    (adress?', '+adress:'')

  selectedClient = ({_id, firstname, lastname}) => {
    this.props.orderHandler({client_id: _id})
    this.setState({
      clientName: this.cleanNameAdress({firstname, lastname}),
      searchList: [],
      activeSearch: false
    })
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
                {this.props.order[key]}
              </div>
            )
          }
        </div>
      </Row>
    }

    return <Row className={`form-${this.props.theme}`}>
      <Col xs="12">
        <Input hidden type="text" name="_id" defaultValue={this.props.order._id}/>
        <FormGroup row className='fx fx-ac'>
          <Col md="3">
            <Label>Client</Label>
          </Col>
          <Col xs="12" md="9">
            <Input hidden type="text" name="client_id" value={this.props.order.client_id} />
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
              <Input className="form-check-input" type="radio" name="basket_type" checked={this.props.order.basket_type=='family'} value="family" onChange={e => this.props.orderHandler({basket_type: e.target.value})} />
              <Label className="form-check-label" check>Familiale</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="basket_type" checked={this.props.order.basket_type=='discovery'} value="discovery" onChange={e => this.props.orderHandler({basket_type: e.target.value})} />
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
                    order={this.props.order}
                    orderHandler={this.props.orderHandler}
                    products={this.props.products} />
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac'>
          <Col md="3">
            <Label>Prix totale</Label>
          </Col>
          <Col xs="12" md="9">
            <InputGroup>
              <Input type="number" name="total_price" value={this.props.order.total_price} disabled className='b text-right' />
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
              <Input className="form-check-input" type="radio" name="status" checked={this.props.order.status=='open'} value="open" onChange={e => this.props.orderHandler({status: e.target.value})} />
              <Label className="form-check-label" check>Ouvert</Label>
            </FormGroup>
          </Col>
          <Col md="3"></Col>
          <Col xs="12" md="9" className='status-group'>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.props.order.status=='pending'} value="pending" onChange={e => this.props.orderHandler({status: e.target.value})} />
              <Label className="form-check-label" check>En attente de verification de stock</Label>
            </FormGroup>
          </Col>
          <Col md="3"></Col>
          <Col xs="12" md="9" className='status-group'>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.props.order.status=='stock'} value="stock" onChange={e => this.props.orderHandler({status: e.target.value})} />
              <Label className="form-check-label" check>En attente de payement</Label>
            </FormGroup>
          </Col>
          <Col md="3"></Col>
          <Col xs="12" md="9" className='status-group'>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="status" checked={this.props.order.status=='close'} value="close" onChange={e => this.props.orderHandler({status: e.target.value})} />
              <Label className="form-check-label" check>Cloturé</Label>
            </FormGroup>
          </Col>
        </FormGroup>
      </Col>
    </Row>
  }

}
