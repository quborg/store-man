import React, { Component } from 'react'
import {saveOrder, delOrder, arcOrder, unaOrder} from 'store-man-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText, Collapse} from 'reactstrap'
import {Image} from 'store-man-client/react/components/Media'
import {getCollectionById, getCollectionByKeyValue} from 'store-man-helper/ext'
import {BasketEditor} from 'store-man-client/react/components/Widgets'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import {ERRORS_STACK, MSG} from 'store-man-client/react/views/settings'
import validateFields from 'store-man-client/react/plugins/form-validator'

const REQUIRED_KEYS = { client_id:'',basket:{} }


export default class OrderForm extends Component {

  static defaultProps = {
    item: REQUIRED_KEYS,
    theme: '',
    setAction: () => {},
    initModal: () => {},
    progress: () => 0,
  }

  state = {
    item: { ...REQUIRED_KEYS },
    toArch: undefined,
    toUnar: undefined,
    toDel: undefined,
    toInfo: undefined,
    errorsFlag: { ...REQUIRED_KEYS, email:'', image:'' },
    errorRuntime: false,
    clientName: '',
    activeSearch: false,
    searchList: [],
    basket: {},
    basketName: '',
    basket_id: '',
    calculator: false,
    totalAutomatic: 0,
    pl_active: false
  }

  componentWillMount() {
    let [item, {baskets, clients, theme}] = [{...this.state.item, ...this.props.item}, this.props]
      , toAdd  = theme == 'primary'
      , toArch = theme == 'secondary'
      , toUnar = theme == 'success'
      , toDel  = theme == 'danger'
      , toInfo = theme == 'info'
      , clientName  = ''
      , basket      = {}
    if (toAdd) delete item._id
    if (item.basket_id) basket = getCollectionById(baskets, item.basket_id)
    if (item.client_id) {
      let {firstname, lastname} = getCollectionById(clients, item.client_id)
        , clientName            = this.cleanNameAdress({firstname, lastname})
      this.setState({clientName})
    }
    item = { ...item, basket }
    this.setState({item, toDel, toInfo, toArch, toUnar}, this.basketEditorHandler(item.basket, item.basket.name, 'mount'))
  }

  componentWillReceiveProps({action:nextAction}) {
    if (nextAction && nextAction !== 'REV') this.actionsStarter(nextAction)
  }

  actionsStarter = action => {
    switch (action) {
      case 'NEW': this.saveItem()  ;break
      case 'PUT': this.saveItem()  ;break
      case 'ARC': this.arcItem()   ;break
      case 'UNA': this.unaItem()   ;break
      case 'DEL': this.delItem()   ;break
    }
  }

  saveItem = () => {
    let [item, _errorsFlag]  = [{...this.state.item}, {...this.state.errorsFlag}]
      , toAdd                 = this.props.theme == 'primary'
    if (toAdd) delete item._id
    let {errorsFlag, errorRuntime} = validateFields(item, _errorsFlag)
    if (!errorRuntime) {
      this.props.dispatch( saveOrder(item) )
      this.props.resetSelection()
      this.props.initModal()
    } else this.props.setAction('REV')
    this.setState({errorsFlag, errorRuntime})
  }

  arcItem = () => {
    this.props.dispatch( arcOrder(this.state.item._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  unaItem = () => {
    this.props.dispatch( unaOrder(this.state.item._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  delItem = () => {
    this.props.dispatch( delOrder(this.state.item) )
    this.props.resetSelection()
    this.props.initModal()
  }

  itemHandler = nextOrder => {
    let item       = { ...this.state.item, ...nextOrder }
      , errorsFlag = { ...this.state.errorsFlag }
    if (this.state.errorRuntime) {
      errorsFlag = validateFields(nextOrder, errorsFlag).errorsFlag
    }
    this.setState({ item, errorsFlag })
  }

  searchListHandler = e => {
    let searchList  = []
      , keyword     = e.target.value.trimStart()
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
    else this.selecteClient({})
  }

  cleanNameAdress = ({firstname, lastname, adress}) =>
    (firstname?firstname+' ':'') +
    (lastname||'') +
    (adress?', '+adress:'')

  selecteClient = ({_id, firstname, lastname}) => {
    this.itemHandler({client_id: _id})
    this.setState({
      clientName: this.cleanNameAdress({ firstname, lastname }),
      searchList: [],
      activeSearch: false
    })
  }

  basketNameHandler = (event, index, nextBasketName) => {
    if (!nextBasketName && this.state.basketName) {
      this.props.theme == 'warning'
      ?
        this.itemHandler({
          basket:this.props.item.basket,
          basket_id:this.props.item.basket_id,
          total:this.props.item.total
        })
      : this.itemHandler({ basket: {}, basket_id: '', total: 0 })
      this.setState({ basketName: '' })
    }
    else {
      let basket = getCollectionByKeyValue(this.props.baskets, 'name', nextBasketName)
      this.basketEditorHandler(basket, basket.name, 'namelist')
    }
  }

  basketEditorHandler = (nextBasket, basketName=this.state.basketName, escapeName='') => {
    let basket            = { ...this.state.item.basket, products:[], ...nextBasket }
      , {products,theme}  = this.props
      , {total}           = this.state.item
      , totalAutomatic    = 0;
    if (basket.products && basket.products.length) {
      totalAutomatic  = basket.products.reduce(
                        (total, p) => {
                          total += Number(getCollectionById(products, p._id).price) * Number(p.quantity)
                          return total
                        }, 0)
    }
    if (escapeName == 'namelist') total = basket.total
    if (this.state.calculator) total = totalAutomatic
    if (!escapeName && basketName) {
      basketName = ''
      basket.name = '';
      delete basket._id
    }
    let basket_id = basketName ? basket._id : theme=='warning' ? basket._id : '';
    this.itemHandler({ basket_id, basket, total })
    this.setState({ basketName, totalAutomatic })
  }

  toggleCalculator = calculator => {
    this.setState({calculator})
    if (calculator) this.manualTotalHandler(this.state.totalAutomatic)
  }

  manualTotalHandler = total => {
    this.itemHandler({total})
  }

  render() {
    const arr = []
        , [{item, toArch, toUnar, toDel, toInfo}, {basket}] = [this.state, this.state.item]
        , basketProducts = basket && basket.products && basket.products.length ? basket.products : arr
        , msgKey = toArch ? 'arc' : toDel ? 'del' : toUnar ? 'una' : null

    if (toArch || toUnar || toDel || toInfo) {
      return <Row className='fx fx-jc'>
        {msgKey && <h5 className={`${msgKey}-clr pb-2`}>{MSG[msgKey].order}</h5>}
        <Col xs='12' className='collection'>
          <FormGroup row>
            <Col xs='3'>
              <Label>ID</Label>
            </Col>
            <Col xs='9'>
              <RaisedButton label={`#${this.state.item._id}`} disabled={true} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs='3'>
              <Label>Client</Label>
            </Col>
            <Col xs='9'>
              <RaisedButton label={this.state.clientName||''} icon={<i className='fa fa-user' />} disabled={true} />
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ab'>
            <Col xs='3'>
              <Label>Formule</Label>
            </Col>
            <Col xs='9'>
              {this.props.basketFormater(this.state.item.basket_id)}
              {
                (toArch || toInfo) && <div className='animated fadeIn pl-card mt-2'>
                  <div className={`pl-btn fx fx-ac fx-jc pointer ${this.state.pl_active?'mb-2':'mb-0'}`} onClick={e=>this.setState({pl_active:!this.state.pl_active})}>
                    <Label>Liste des produits</Label>
                    <i className='material-icons'>{this.state.pl_active?'unfold_less':'unfold_more'}</i>
                  </div>
                  <Collapse isOpen={this.state.pl_active}>
                    {
                      basketProducts.map( (p,i) => {
                        let name = getCollectionById(this.props.products, p._id).name
                        return <div key={`basket-prod-danger-${p._id}`} className='fx'>
                          <span className='ordered-space-3'>{i+1}.</span>
                          <span>{name} <b>{p.quantity}</b>kg</span>
                        </div>
                      } )
                    }
                  </Collapse>
                </div>
              }
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs='3'>
              <Label>Total</Label>
            </Col>
            <Col xs='9'>
              <RaisedButton label={`${this.state.item.total||0} DH`} disabled={true} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs='3'>
              <Label>Status</Label>
            </Col>
            <Col xs='9'>
              {this.props.statusFormater(this.state.item.status)}
            </Col>
          </FormGroup>
        </Col>
      </Row>
    }

    return <Row className={`form-${this.props.theme}`}>
      <Col xs='12'>
        <Input hidden type='text' name='_id' defaultValue={this.state.item._id}/>
        <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.client_id}`}>
          <Col md='3'>
            <Label>Client <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
          </Col>
          <Col xs='12' md='9'>
            <Input hidden type='text' name='client_id' defaultValue={this.state.item.client_id} />
            <Input type='text' value={this.state.clientName} onChange={this.searchListHandler} placeholder='Nom du client ..' />
            <div className='invalid-feedback'>{ERRORS_STACK.client_id}</div>
            <div className={`search-list-wrapper ${this.state.activeSearch?'active':''}`}>
              <div className='search-list-box fx fx-col fx-ac'>
                {
                  this.state.searchList.map( client =>
                    <div key={`search-res-item-${client._id}`} onClick={() => this.selecteClient(client)}>
                      <div>{this.cleanNameAdress(client)}</div>
                    </div>
                  )
                }
              </div>
            </div>
          </Col>
        </FormGroup>
        <FormGroup row className={`fx fx-ac basket-form form-${this.state.errorsFlag.basket}`}>
          <Col md='3'>
            <Label>Formule <i className='fa fa-plus font-xs ml-3 primary-clr pointer-p' title='un ou plusieurs' /></Label>
          </Col>
          <Col md='9'>
            <Input hidden type='text' name='basket_id' defaultValue={this.state.item.basket_id} />
            <SelectField
                value={this.state.basketName}
                onChange={this.basketNameHandler} >
              <MenuItem value='' primaryText='' />
              <MenuItem value='Familiale'  primaryText='Familiale' />
              <MenuItem value='Decouverte' primaryText='Decouverte' />
            </SelectField>
            <div className='invalid-feedback'>{ERRORS_STACK.basket}</div>
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
                  <Label className='switch switch-sm switch-icon switch-pill switch-primary mb-0'>
                    <Input type='checkbox' className='switch-input' defaultChecked={this.state.calculator} onChange={e => this.toggleCalculator(e.target.checked)} />
                    <span className='switch-label' data-on={'\uF1EC'} data-off={'\uF1EC'}></span>
                    <span className='switch-handle'></span>
                  </Label>
                  <span className={`calcul-ico ${this.state.calculator.toString()}`}>
                    Calcule {this.state.calculator?'automatic':'manuel'}
                  </span>
                </InputGroupText>
              </InputGroupAddon>
              {
                this.state.calculator
                ? <Input key='key-automatic-total' type='number' value={this.state.totalAutomatic} onChange={e=>{}} disabled className='text-right total-auto'/>
                : <Input key='key-custom-total' type='number' value={this.state.item.total} onChange={e => this.manualTotalHandler(e.target.value)} placeholder={'.. 0Dh'} className='text-right total-manual' />
              }
              <InputGroupAddon addonType='append'><InputGroupText>DH</InputGroupText></InputGroupAddon>
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac order-status-groups'>
          <Col md='3'>
            <Label>Status</Label>
          </Col>
          <Col xs='12' md='9' className='status-group'>
            <FormGroup check inline>
              <Input className='form-check-input' type='radio' name='status' checked={this.state.item.status=='open'} value='open' onChange={e => this.itemHandler({status: e.target.value})} />
              <Label className='form-check-label' check><span className='open-bg'>Ouvert</span></Label>
            </FormGroup>
          </Col>
          <Col md='3'></Col>
          <Col xs='12' md='9' className='status-group'>
            <FormGroup check inline>
              <Input className='form-check-input' type='radio' name='status' checked={this.state.item.status=='stock'} value='stock' onChange={e => this.itemHandler({status: e.target.value})} />
              <Label className='form-check-label' check>En attente de verification de <span className='stock-bg'>stock</span></Label>
            </FormGroup>
          </Col>
          <Col md='3'></Col>
          <Col xs='12' md='9' className='status-group'>
            <FormGroup check inline>
              <Input className='form-check-input' type='radio' name='status' checked={this.state.item.status=='payment'} value='payment' onChange={e => this.itemHandler({status: e.target.value})} />
              <Label className='form-check-label' check>En attente de <span className='payment-bg'>payement</span></Label>
            </FormGroup>
          </Col>
          <Col md='3'></Col>
          <Col xs='12' md='9' className='status-group'>
            <FormGroup check inline>
              <Input className='form-check-input' type='radio' name='status' checked={this.state.item.status=='close'} value='close' onChange={e => this.itemHandler({status: e.target.value})} />
              <Label className='form-check-label' check><span className='close-bg'>Livré</span></Label>
            </FormGroup>
          </Col>
        </FormGroup>

        <FormGroup row className='fx fx-ac form-test'>
          <Col md='3'>
            <Label><i className='fa fa-info font-xs ml-1 mr-1 info-clr' />Date manuel, pour les testes</Label>
          </Col>
          <Col xs='12' md='9'>
           <Input type='datetime-local' value={this.state.item.created_at} onChange={e => this.itemHandler({created_at:e.target.value})} />
          </Col>
        </FormGroup>
      </Col>
    </Row>
  }

}
