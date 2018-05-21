import React, { Component } from 'react'
import {saveProduct, delProduct} from 'ayla-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import {Image, ImageFileLoader} from 'ayla-client/react/components/Media'
import validateFields from 'ayla-client/react/plugins/form-validator'
import {ERRORS_STACK} from 'ayla-client/react/views/settings'

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
    toDelete: undefined,
    errorsFlag: { ...REQUIRED_KEYS, image:'' },
    errorRuntime: false
  }

  componentWillMount() {
    let [product, { theme }] = [{...this.state.product, ...this.props.product}, this.props]
    const toAdd    = theme == 'primary'
        , toDelete = theme == 'danger'
    if (toAdd) delete product._id
    this.setState({product, toDelete})
  }

  componentWillReceiveProps({action:nextAction}) {
    if (nextAction && nextAction !== 'revision') this.actionsStarter(nextAction)
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
    } else this.props.setAction('revision')
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
    let { product, toDelete } = this.state

    return toDelete
    ? <Row className='fx fx-jc'>
        <h5 className='color-danger pb-2'>Vous êtes sur le point de supprimer le produit suivant :</h5>
        <div className='entity-del'>
          <div>
            <Image src={product.image} width='50' height='50' alt='Image aperçu' className='image-preview' />
          </div>
          <div className='b'>
            {product.name} ( {product.price.toFixed(2)} DH )
          </div>
        </div>
      </Row>
    : <form id="product-form" className="form-horizontal">
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
    ;
  }

}
