import React, { Component } from 'react'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText, ListGroup, ListGroupItem} from 'reactstrap'
import {Image} from 'ayla-client/react/components/Media'
import {getCollectionById, getCollectionByKeyValue} from 'ayla-helper/ext'
import {BasketEditor} from 'ayla-client/react/components/Widgets'
import Toggle from 'material-ui/Toggle'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'


export default class OrderForm extends Component {

  state = {
    clientName: '',
    activeSearch: false,
    searchList: [],
    basket: {},
    basketName: '',
    basket_id: '',
    calculator: false,
    totalAutomatic: 0,
    total: 0
  }

  componentWillMount() {
    let {order, baskets, clients, theme} = this.props
      , basketFamily      = getCollectionByKeyValue(baskets, 'name', 'Familiale')
      , basketDecouverte  = getCollectionByKeyValue(baskets, 'name', 'Decouverte')
      , basket            = getCollectionById(baskets, order.basket_id)
      , basketName        = basket.name
    if (theme=='primary') delete order._id
    if (order.client_id) {
      let {firstname, lastname} = getCollectionById(clients, order.client_id)
        , clientName = this.cleanNameAdress({firstname, lastname})
      this.setState({clientName})
    }
    this.basketEditorHandler(basket, basket.name, true)
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
    else this.selectedClient({})
  }

  cleanNameAdress = ({firstname, lastname, adress}) =>
    (firstname?firstname+' ':'') +
    (lastname||'') +
    (adress?', '+adress:'')

  selectedClient = ({_id, firstname, lastname}) => {
    this.props.orderHandler({client_id: _id})
    this.setState({
      clientName: this.cleanNameAdress({ firstname, lastname }),
      searchList: [],
      activeSearch: false
    })
  }

  basketNameHandler = (event, index, value) => {
    if (!value && this.state.basketName) {
      this.props.orderHandler({ basket: {}, basket_id: '' })
      this.setState({ basketName: '' })
    }
    else {
      let basket = getCollectionByKeyValue(this.props.baskets, 'name', value)
      this.basketEditorHandler(basket, basket.name, true)
    }
  }

  basketEditorHandler = (nextProducts, basketName=this.state.basketName, escapeName=false) => {
    let basket            = { ...this.props.order.basket, products:[], ...nextProducts }
      , {products,theme}  = this.props
      , {total}           = this.props.order
      , totalAutomatic    = 0
    if (basket.products && basket.products.length) {
      totalAutomatic  = basket.products.reduce(
                        (total, p) => {
                          total += Number(getCollectionById(products, p._id).price) * Number(p.quantity)
                          return total
                        }, 0)
    }
    if (escapeName)             total = this.props.order.total || basket.total
    if (this.state.calculator)  total = totalAutomatic
    if (!escapeName && basketName) {
      basketName = ''
      basket.name = ''
      delete basket._id
    }
    let basket_id = basketName ? basket._id : theme=='warning' ? basket._id : ''
    this.props.orderHandler({basket_id, basket, total})
    this.setState({ basket_id, basketName, totalAutomatic, total })
  }

  toggleCalculator = calculator => {
    this.setState({calculator})
    if (calculator) this.manualTotalHandler(this.state.totalAutomatic)
  }

  manualTotalHandler = total => {
    this.props.orderHandler({total})
    this.setState({ total })
  }

  render() {
    const arr       = []
        , keys      = ['client_id', 'basket_id', 'total']
        , listClass = this.state.activeSearch ? 'active' : ''
        , {basket}  = this.props.order
        , basketProducts = basket && basket.products && basket.products.length ? basket.products : arr

    if (this.props.theme == 'danger') {
      return <Row className='fx fx-jc'>
        <h5 className='color-danger pb-2'>Vous êtes sur le point de supprimer la Commande suivante :</h5>
        <div className='entity-del collection'>
          <FormGroup row>
            <Col xs='3'>
              <Label>ID</Label>
            </Col>
            <Col xs='9'>
              <RaisedButton label={`#${this.props.order._id}`} disabled={true} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs='3'>
              <Label>Client</Label>
            </Col>
            <Col xs='9'>
              <RaisedButton label={this.state.clientName||''} icon={<i className="fa fa-user" />} disabled={true} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs='3'>
              <Label>Formule</Label>
            </Col>
            <Col xs='9'>
              {this.props.basketFormater(this.state.basketName)}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs='3'>
              <Label>Total</Label>
            </Col>
            <Col xs='9'>
              <RaisedButton label={`${this.state.total||0} DH`} disabled={true} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs='3'>
              <Label>Status</Label>
            </Col>
            <Col xs='9'>
              {this.props.statusFormater(this.props.order.status)}
            </Col>
          </FormGroup>
        </div>
      </Row>
    }

    return <Row className={`form-${this.props.theme}`}>
      <Col xs='12'>
        <Input hidden type='text' name='_id' defaultValue={this.props.order._id}/>
        <FormGroup row className='fx fx-ac'>
          <Col md='3'>
            <Label>Client</Label>
          </Col>
          <Col xs='12' md='9'>
            <Input hidden type='text' name='client_id' defaultValue={this.props.order.client_id} />
            <Input type='text' value={this.state.clientName} onChange={this.searchListHandler} placeholder='Nom du client ..' />
            <div className={`search-list-wrapper ${listClass}`}>
              <div className='search-list-box fx fx-col fx-ac'>
                {
                  this.state.searchList.map( client =>
                    <div key={client._id} onClick={() => this.selectedClient(client)}>
                      <div>{this.cleanNameAdress(client)}</div>
                    </div>
                  )
                }
              </div>
            </div>
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-as basket-form'>
          <Col md='3'>
            <Label>Formule</Label>
          </Col>
          <Col md='9'>
            <Input hidden type='text' name='basket_id' defaultValue={this.props.order.basket_id} />
            <SelectField
                value={this.state.basketName}
                onChange={this.basketNameHandler} >
              <MenuItem value='' primaryText='' />
              <MenuItem value='Familiale'  primaryText='Familiale' />
              <MenuItem value='Decouverte' primaryText='Decouverte' />
            </SelectField>
            <BasketEditor basket={basketProducts} basketHandler={this.basketEditorHandler} />
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac basket-form'>
          <Col md='3'>
            <Label>Prix totale</Label>
          </Col>
          <Col xs='12' md='9'>
            <InputGroup>
              <InputGroupAddon addonType='prepend' style={{width:'220px'}}>
                <InputGroupText style={{width:'100%'}}>
                  <Label className="switch switch-sm switch-icon switch-pill switch-primary mb-0">
                    <Input type="checkbox" className="switch-input" defaultChecked={this.state.calculator} onChange={e => this.toggleCalculator(e.target.checked)} />
                    <span className="switch-label" data-on={'\uF1EC'} data-off={'\uF1EC'}></span>
                    <span className="switch-handle"></span>
                  </Label>
                  <span className={`calcul-ico ${this.state.calculator.toString()}`}>
                    Calcule {this.state.calculator?'automatic':'manuel'}
                  </span>
                </InputGroupText>
              </InputGroupAddon>
              {
                this.state.calculator
                ? <Input key='key-automatic-total' type='number' defaultValue={this.state.totalAutomatic} disabled className='text-right total-auto'/>
                : <Input key='key-custom-total' type='number' value={this.state.total} onChange={e => this.manualTotalHandler(e.target.value)} placeholder={'.. 0Dh'} className='text-right total-manual' />
              }
              <InputGroupAddon addonType="append"><InputGroupText>DH</InputGroupText></InputGroupAddon>
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac order-status-groups'>
          <Col md='3'>
            <Label>Status</Label>
          </Col>
          <Col xs='12' md='9' className='status-group'>
            <FormGroup check inline>
              <Input className='form-check-input' type='radio' name='status' checked={this.props.order.status=='open'} value='open' onChange={e => this.props.orderHandler({status: e.target.value})} />
              <Label className='form-check-label' check><span className="open-bg">Ouvert</span></Label>
            </FormGroup>
          </Col>
          <Col md='3'></Col>
          <Col xs='12' md='9' className='status-group'>
            <FormGroup check inline>
              <Input className='form-check-input' type='radio' name='status' checked={this.props.order.status=='stock'} value='stock' onChange={e => this.props.orderHandler({status: e.target.value})} />
              <Label className='form-check-label' check>En attente de verification de <span className="stock-bg">stock</span></Label>
            </FormGroup>
          </Col>
          <Col md='3'></Col>
          <Col xs='12' md='9' className='status-group'>
            <FormGroup check inline>
              <Input className='form-check-input' type='radio' name='status' checked={this.props.order.status=='payment'} value='payment' onChange={e => this.props.orderHandler({status: e.target.value})} />
              <Label className='form-check-label' check>En attente de <span className="payment-bg">payement</span></Label>
            </FormGroup>
          </Col>
          <Col md='3'></Col>
          <Col xs='12' md='9' className='status-group'>
            <FormGroup check inline>
              <Input className='form-check-input' type='radio' name='status' checked={this.props.order.status=='close'} value='close' onChange={e => this.props.orderHandler({status: e.target.value})} />
              <Label className='form-check-label' check><span className="close-bg">Cloturé</span></Label>
            </FormGroup>
          </Col>
        </FormGroup>
        <Input value={this.props.order.created_at} onChange={e => this.props.orderHandler({created_at:e.target.value})} placeholder={'.. 0Dh'} className='text-right total-manual' />
      </Col>
    </Row>
  }

}
