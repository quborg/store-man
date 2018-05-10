import React, { Component } from 'react'
import serialize from 'form-serialize'
import {saveProduct, delProduct} from 'ayla-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import {Image} from 'ayla-client/react/components/Media'


export default class ProductForm extends Component {

  static defaultProps = {
    theme: '',
    product: {},
    action: '',
    initModal: () => {},
    progress: () => 0
  }

  state = {
    product: {},
    toDelete: undefined
  }

  componentWillMount() {
    let [product, { theme }] = [{...this.props.product}, this.props]
    const toAdd    = theme == 'primary'
        , toDelete = theme == 'danger'
    if (toAdd) delete product._id
    this.setState({product, toDelete})
  }

  componentWillReceiveProps({action:nextAction}) {
    if (nextAction) this.actionsStarter(nextAction)
  }

  actionsStarter = action => {
    this.setState({action})
    switch (action) {
      case 'NEW': this.saveProduct()  ;break
      case 'PUT': this.saveProduct()  ;break
      case 'DEL': this.delProduct()   ;break
    }
  }

  saveProduct() {
    this.props.dispatch( saveProduct(this.state.product) )
    this.props.initModal()
  }

  delProduct() {
    this.props.dispatch( delProduct(this.state.product._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  imageHandler = e => {
    let file    = e.target.files ? e.target.files[0] : null
      , reader  = new FileReader()

    if (file && file.type.match('image.*'))
      reader.readAsDataURL(file),
      reader.onload = ev => {
        let image = { src: reader.result, name: file.name }
        this.productHandler({ image })
        this.props.progress(100)
      }
      // reader.onerror = err => {}
      // reader.onprogress = p => {}

  }

  productHandler = nextProduct => {
    let product = { ...this.state.product, ...nextProduct }
    this.setState({ product })
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
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Nom :</Label>
              </Col>
              <Col xs='12' md='9'>
                <Input type='text' name='name' defaultValue={product.name} onChange={e => this.productHandler({name: e.target.value})} placeholder='Entrez le nom du produit'/>
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Image :</Label>
              </Col>
              <Col xs='12' md='9'>
                <Image src={product.image} width='75' height='75' alt='Image aperçu' className='image-preview' />
                <Input type='file' accept='image/*' name='image' defaultValue={product.image} onChange={this.imageHandler} />
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Prix par KG :</Label>
              </Col>
              <Col xs='12' md='9'>
                <InputGroup>
                  <Input type='number' name='price' defaultValue={product.price} onChange={e => this.productHandler({price: e.target.value})} placeholder='.. 0.00Dh' className='text-right' />
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
