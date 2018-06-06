import React, {Component} from 'react'
import {saveBasket} from 'ayla-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import {getCollectionById} from 'ayla-helper/ext'
import {BasketEditor} from 'ayla-client/react/components/Widgets'
import Toggle from 'material-ui/Toggle'
import validateFields from 'ayla-client/react/plugins/form-validator'
import {ERRORS_STACK} from 'ayla-client/react/views/settings'


const REQUIRED_KEYS = { products : [] }

export default class BasketForm extends Component {

  static defaultProps = {
    basket: {},
    theme: '',
    setAction: () => {},
    initModal: () => {}
  }

  state = {
    basket: REQUIRED_KEYS,
    calculator: false,
    // toDel: undefined,
    toInfo: undefined,
    totalAutomatic: 0,
    errorsFlag: REQUIRED_KEYS,
    errorRuntime: false
  }

  componentWillMount() {
    let [basket, { theme }] = [{...this.state.basket, ...this.props.basket}, this.props]
    const toAdd    = theme == 'primary'
        // , toDel = theme == 'danger'
        , toInfo   = theme == 'info'
    if (toAdd) delete basket._id
    this.setState({toInfo})
    this.basketHandler(basket)
  }

  componentWillReceiveProps({action:nextAction, basket}) {
    if (nextAction && nextAction !== 'REV') this.actionsStarter(nextAction)
  }

  actionsStarter = action => {
    this.setState({action})
    switch (action) {
      case 'NEW': this.saveBasket()  ;break
      case 'PUT': this.saveBasket()  ;break
      // case 'ARC': this.arcBasket()   ;break
    }
  }

  saveBasket() {
    let [basket, _errorsFlag] = [{...this.state.basket}, {...this.state.errorsFlag}]
      , toAdd                 = this.state.theme == 'primary'
    if (toAdd) delete basket._id
    let {errorsFlag, errorRuntime} = validateFields(basket, _errorsFlag)
    if (!errorRuntime) {
      this.props.dispatch( saveBasket(basket) )
      this.props.resetSelection()
      this.props.initModal()
    } else this.props.setAction('REV')
    this.setState({ errorsFlag, errorRuntime })
  }

  // delBasket() {
  //   this.props.dispatch( delBasket(this.state.basket._id) )
  //   this.props.resetSelection()
  //   this.props.initModal()
  // }

  basketHandler = nextBasket => {
    let [basket, {products}]  = [{ ...this.state.basket, ...nextBasket }, this.props]
      , errorsFlag            = { ...this.state.errorsFlag }
      , totalAutomatic        = 0
    if (basket.products && basket.products.length) {
      totalAutomatic  = basket.products.reduce(
        (total, p) => {
          total += Number(getCollectionById(products, p._id).price) * Number(p.quantity)
          return total
        }, 0)
    }
    if (this.state.calculator) basket = { ...basket, total: totalAutomatic }
    if (this.state.errorRuntime) errorsFlag = validateFields(nextBasket, errorsFlag).errorsFlag
    this.setState({ basket, totalAutomatic, errorsFlag })
  }

  toggleCalculator = calculator => {
    this.setState({calculator})
    if (calculator) this.manualTotalHandler(this.state.totalAutomatic)
  }

  manualTotalHandler = total => {
    this.basketHandler({total})
  }

  render() {
    let [{basket, toInfo, calculator, totalAutomatic}, {products}] = [this.state, this.props]

    return toInfo
    ? <FormGroup row>
        <Col xs='12' className='entity-header'>
          <h3 className='fx fx-jc fx-ac mb-3'>
            <b>Panier {basket.name}<span className='ml-5 mr-1'> {basket.total.toFixed(2)} DH</span></b>
          </h3>
        </Col>
        <Col xs='4'>
          <b>Liste des produits</b>
        </Col>
        <Col xs='8'>
          {
            basket.products.map( p => {
              let name = getCollectionById(products, p._id).name
              return <div key={`basket-prod-danger-${p._id}`} className='fx'>
                <span className='w-100'>{name}</span>
                <span className='ellipse'>............................................</span>
                <span><b className='mr-1'>{p.quantity}</b>kg</span>
              </div>
            } )
          }
        </Col>
      </FormGroup>
    : <form className='form-horizontal basket-form'>
        <Row className={`form-${this.props.theme}`}>
          <Col xs='12'>
            <Input hidden type='text' name='_id' defaultValue={basket._id}/>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Nom</Label>
              </Col>
              <Col xs='12' md='9'>
                {
                  this.props.theme == 'primary'
                  ? <Input type='text' name='name' defaultValue={basket.name} onChange={e => this.basketHandler({name: e.target.value})} placeholder='Entrez le nom du panier'/>
                  : <Label className='b uppercase dark-clr'>{basket.name}</Label>
                }
              </Col>
            </FormGroup>
            <FormGroup row className={`fx fx-as form-${this.state.errorsFlag.products}`}>
              <Col md='3'>
                <Label>Produits <i className='fa fa-plus font-xs ml-3 primary-clr pointer-p' title='un ou plusieurs' /></Label>
              </Col>
              <Col xs='12' md='9'>
                <div className="invalid-feedback">{ERRORS_STACK.products}</div>
                <BasketEditor basket={basket.products} basketHandler={this.basketHandler} />
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Total</Label>
              </Col>
              <Col xs='12' md='9'>
                <InputGroup>
                  <InputGroupAddon addonType='prepend' style={{width:'220px'}}>
                    <InputGroupText style={{width:'100%'}}>
                      <Label className="switch switch-sm switch-icon switch-pill switch-primary mb-0">
                        <Input type="checkbox" className="switch-input" defaultChecked={calculator} onChange={e => this.toggleCalculator(e.target.checked)} />
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
                    ? <Input key='key-automatic-total' type='number' min={0} value={totalAutomatic} onChange={e=>{}} disabled className='text-right total-auto' />
                    : <Input key='key-custom-total' type='number' min={0} value={basket.total} onChange={e => this.manualTotalHandler(e.target.value)} placeholder={'.. 0Dh'} className='text-right total-manual' />
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
