import React, {Component} from 'react'
import serialize from 'form-serialize'
import {saveBasket, delBasket} from 'ayla-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import {getCollectionById} from 'ayla-helper/ext'
import {BasketEditor} from 'ayla-client/react/components/Widgets'
import Toggle from 'material-ui/Toggle'


export default class BasketForm extends Component {

  static defaultProps = {
    theme: '',
    basket: {},
    action: '',
    initModal: () => {}
  }

  state = {
    basket: {},
    calculator: false,
    toDelete: undefined,
    totalAutomatic: 0
  }

  componentWillMount() {
    let [basket, { theme }] = [{...this.props.basket}, this.props]
    const toAdd    = theme == 'primary'
        , toDelete = theme == 'danger'
    if (toAdd) delete basket._id
    this.setState({toDelete})
    this.basketHandler(basket)
  }

  componentWillReceiveProps({action:nextAction, basket}) {
    if (nextAction) this.actionsStarter(nextAction)
  }

  actionsStarter = action => {
    this.setState({action})
    switch (action) {
      case 'NEW': this.saveBasket()  ;break
      case 'PUT': this.saveBasket()  ;break
      case 'DEL': this.delBasket()   ;break
    }
  }

  saveBasket() {
    this.props.dispatch( saveBasket(this.state.basket) )
    this.props.initModal()
  }

  delBasket() {
    this.props.dispatch( delBasket(this.state.basket._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  basketHandler = nextBasket => {
    let basket          = { ...this.state.basket, ...nextBasket }
      , {products}      = this.props
      , totalAutomatic  = 0
    if (basket.products && basket.products.length) {
      totalAutomatic  = basket.products.reduce(
        (total, p) => {
          total += Number(getCollectionById(products, p._id).price) * Number(p.quantity)
          return total
        }, 0)
    }
    if (this.state.calculator) basket = { ...basket, total: totalAutomatic }
    this.setState({ basket, totalAutomatic })
  }

  toggleCalculator = e => {
    this.setState({calculator: e.target.checked})
  }

  render() {
    let [{basket, toDelete, calculator, totalAutomatic}, {products}] = [this.state, this.props]

    return toDelete
    ? <Row className='fx fx-jc'>
        <h5 className='color-danger pb-2'>Vous êtes sur le point de supprimer le panier suivant :</h5>
        <div className='entity-del'>
          <div className='b'>
            Panier {basket.name} ( {basket.total.toFixed(2)} DH )
          </div>
          <div>
            {
              basket.products.map( p => {
                let name = getCollectionById(products, p._id).name
                return <div key={`basket-prod-danger-${p._id}`}>{name} {p.quantity}Kg</div>
              } )
            }
          </div>
        </div>
      </Row>
    : <form className='form-horizontal basket-form'>
        <Row className={`form-${this.props.theme}`}>
          <Col xs='12'>
            <Input hidden type='text' name='_id' defaultValue={basket._id}/>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Nom :</Label>
              </Col>
              <Col xs='12' md='9'>
                {
                  this.props.theme == 'primary'
                  ? <Input type='text' name='name' defaultValue={basket.name} onChange={e => this.basketHandler({name: e.target.value})} placeholder='Entrez le nom du panier'/>
                  : <Label className='b uppercase dark-clr'>{basket.name}</Label>
                }
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-as'>
              <Col md='3'>
                <Label>Produits :</Label>
              </Col>
              <Col xs='12' md='9'>
                <BasketEditor basket={basket.products} basketHandler={this.basketHandler} />
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Total :</Label>
              </Col>
              <Col xs='12' md='9'>
                <InputGroup>
                  <InputGroupAddon addonType='prepend' style={{width:'220px'}}>
                    <InputGroupText style={{width:'100%'}}>
                      <Label className="switch switch-sm switch-icon switch-pill switch-primary mb-0">
                        <Input type="checkbox" className="switch-input" defaultChecked={calculator} onChange={this.toggleCalculator} />
                        <span className="switch-label" data-on={'\uF1EC'} data-off={'\uF1EC'}></span>
                        <span className="switch-handle"></span>
                      </Label>
                      <span className={`calcul-ico ${calculator.toString()}`}>
                        Calcule {calculator?'automatic':'manuel'}
                      </span>
                    </InputGroupText>
                  </InputGroupAddon>
                  {
                    calculator
                    ? <Input key='key-automatic-total' type='number' value={totalAutomatic} disabled className='text-right total-auto' />
                    : <Input key='key-custom-total' type='number' defaultValue={basket.total} onChange={e => this.basketHandler({total: e.target.value})} placeholder={'.. 0Dh'} className='text-right total-manual' />
                  }
                  <InputGroupAddon addonType="append"><InputGroupText>DH</InputGroupText></InputGroupAddon>
                </InputGroup>
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </form>
    ;
  }

}
