import React, { Component } from 'react'
import {Row, Col, FormGroup, Input, Label, ListGroup, ListGroupItem} from 'reactstrap'


export default class OrderForm extends Component {

  state = {
    basketType: '',
    status: '',
    clientId: '',
    clientName: ''
  }

  componentWillMount() {
    if (this.props.theme == 'warning')
      this.setState({
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

  clientHandler = e => {
    this.setState({clientName: e.target.value})
  }

  render() {
    const keys      = ['client_id', 'basket_type', 'total_price']
        , toDelete  = this.props.theme == 'danger'
        , toAdd     = this.props.theme == 'primary'

    return toDelete
    ? <Row className='fx fx-jc'>
        <h4 className='color-danger pb-2'>Vous êtes sur le point de supprimer la Commande suivante :</h4>
        <div className='entity-del'>
          {
            keys.map( key =>
              <div key={`key-${key}`} className='b'>
                {this.props.data[key]}
              </div>
            )
          }
        </div>
      </Row>
    : <Row className={`form-${this.props.theme}`}>
        <Col xs="12">
          <Input hidden type="text" name="_id" defaultValue={this.props.data._id}/>
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
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Client</Label>
            </Col>
            <Col xs="12" md="9">
              <Input hidden type="text" name="client_id" value={this.state.clientId} />
              <Input type="text" value={this.state.clientName} onChange={this.clientHandler} placeholder="Nom du client" />
              <ListGroup>
                {
                  this.props.clients.length &&
                  this.props.clients.map(
                    client =>
                      <ListGroupItem key={client._id} {...{client}}>
                        {client.firstname} {client.lastname}
                      </ListGroupItem>
                  )
                }
              </ListGroup>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Panier</Label>
            </Col>
            <Col xs="12" md="9">
              {
                toAdd
                ? 'add product'
                : 'products basket loop'
              }
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label className='b'>Prix totale</Label>
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
    ;
  }

}
