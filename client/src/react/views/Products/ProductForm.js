import React, { Component } from 'react'
import {saveProduct, delProduct} from 'store-man-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import {Image, ImageFileLoader} from 'store-man-client/react/components/Media'
import validateFields from 'store-man-client/react/plugins/form-validator'
import {ERRORS_STACK, MSG} from 'store-man-client/react/views/settings'

const REQUIRED_KEYS = { name : '' }


export default class ProductForm extends Component {

  static defaultProps = {
    product: REQUIRED_KEYS,
    theme: '',
    setAction: () => {},
    initModal: () => {},
    progress: () => 0,
  }

  state = {
    product: REQUIRED_KEYS,
    toDel: undefined,
    toInfo: undefined,
    errorsFlag: { ...REQUIRED_KEYS, image:'' },
    errorRuntime: false
  }

  componentWillMount() {
    let [product, { theme }] = [{...this.state.product, ...this.props.product}, this.props]
    const toAdd    = theme == 'primary'
        , toDel = theme == 'danger'
        , toInfo   = theme == 'info'
    if (toAdd) delete product._id
    this.setState({product, toDel, toInfo})
  }

  componentWillReceiveProps({action:nextAction}) {
    if (nextAction && nextAction !== 'REV') this.actionsStarter(nextAction)
  }

  actionsStarter = action => {
    switch (action) {
      case 'NEW': this.saveProduct()  ;break
      case 'PUT': this.saveProduct()  ;break
      case 'DEL': this.delProduct()   ;break
    }
  }

  saveProduct() {
    let [product, _errorsFlag] = [{...this.state.product}, {...this.state.errorsFlag}]
    if (this.state.theme == 'primary') delete product._id
    let {errorsFlag, errorRuntime} = validateFields(product, _errorsFlag)
    if (!errorRuntime) {
      this.props.dispatch( saveProduct(product) )
      this.props.resetSelection()
      this.props.initModal()
    } else this.props.setAction('REV')
    this.setState({ errorsFlag, errorRuntime })
  }

  delProduct() {
    this.props.dispatch( delProduct(this.state.product._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  productHandler = nextProduct => {
    let errorsFlag = { ...this.state.errorsFlag }
    let product = { ...this.state.product, ...nextProduct }
    if (this.state.errorRuntime) {
      errorsFlag = validateFields(product, errorsFlag).errorsFlag
    }
    this.setState({ product, errorsFlag })
  }

  render() {
    let { product, toDel, toInfo } = this.state

    if (toDel || toInfo) {
      return <FormGroup row className='fx fx-jc'>
        {toDel && <h5 className='danger-clr pb-2'>{MSG.archive.product}</h5>}
        <Col xs='3'>
          <Image src={product.image} width='75' height='75' alt='Image aperçu' />
        </Col>
        <Col xs='9'>
          <h3><Label>{product.name}</Label></h3>
          <div className='fx fx-ab'>Prix : <b className='font-xl ml-2 mr-1'>{product.price.toFixed(2)}</b> DH</div>
        </Col>
      </FormGroup>
    }

    return <form id="product-form" className="form-horizontal">
      <Row className={`form-${this.props.theme}`}>
        <Col xs='12'>
          <Input hidden type='text' name='_id' defaultValue={product._id}/>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.name}`}>
            <Col md='3'>
              <Label>Nom <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='name' defaultValue={product.name} onChange={e => this.productHandler({name: e.target.value})} placeholder='Entrez le nom du produit ..'/>
              <div className="invalid-feedback">{ERRORS_STACK.name}</div>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.image}`}>
            <Col md='3'>
              <Label>Image <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <ImageFileLoader src={product.image} handler={this.productHandler} progress={this.props.progress}/>
              <div className="invalid-feedback">{ERRORS_STACK.image}</div>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md='3'>
              <Label>Prix par KG</Label>
            </Col>
            <Col xs='12' md='9'>
              <InputGroup>
                <Input type='number' name='price' defaultValue={product.price} min={0} onChange={e => this.productHandler({price: e.target.value})} placeholder='.. 0.00Dh' className='text-right' />
                <InputGroupAddon addonType="append"><InputGroupText>DH</InputGroupText></InputGroupAddon>
              </InputGroup>
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </form>
  }

}
