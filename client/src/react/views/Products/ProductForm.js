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
    let { product, theme } = this.props
    const toAdd    = theme == 'primary'
        , toDelete = theme == 'danger'
    if (toAdd) product = {}
    this.setState({product, toDelete})
  }

  componentWillReceiveProps({action:nextAction, product}) {
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

  setProductState = e => {
    let $Form   = document.getElementById('product-form')
    var product = Object.assign(this.state.product, serialize($Form, {hash:true}))
      , file    = e.target.files ? e.target.files[0] : null
      , reader  = new FileReader()
      ;

    file && file.type.match('image.*')
    ? (
        reader.readAsDataURL(file),
        reader.onload = ev => {
          product.image = { src: reader.result, name: file.name }
          this.setState({product})
          this.props.progress(100)
        }
        // reader.onerror = err => {}
        // reader.onprogress = p => {}
      )
    : this.setState({product})
  }

  render() {
    let { product, toDelete } = this.state

    return toDelete
    ? <Row className='fx fx-jc'>
        <h4 className='color-danger pb-2'>Vous êtes sur le point de supprimer le produit suivant :</h4>
        <div className='entity-del'>
          <div className='b'>
            {product.name} ( {(product.price/100).toFixed(2)} DH )
          </div>
          <div>
            <Image src={product.image} id='product-preview' width='50' height='50' alt='Image aperçu' className='product-preview' />
          </div>
        </div>
      </Row>
    : <form id="product-form" className="form-horizontal" onChange={this.setProductState}>
        <Row className={`form-${this.props.theme}`}>
          <Col xs='12'>
            <Input hidden type='text' name='_id' defaultValue={product._id}/>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Nom :</Label>
              </Col>
              <Col xs='12' md='9'>
                <Input type='text' name='name' defaultValue={product.name} placeholder='Entrez le nom du produit'/>
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Image :</Label>
              </Col>
              <Col xs='12' md='9'>
                <Image src={product.image} id='product-preview' width='75' height='75' alt='Image aperçu' className='product-preview' />
                <Input type='file' accept='image/*' name='image' defaultValue={product.image} />
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Prix par KG :</Label>
              </Col>
              <Col xs='12' md='9'>
                <InputGroup>
                  <InputGroupAddon addonType="prepend"><InputGroupText>CENT</InputGroupText></InputGroupAddon>
                  <Input type='number' name='price' defaultValue={product.price} placeholder='00' />
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Unité Familiale :</Label>
              </Col>
              <Col xs='12' md='9'>
                <InputGroup>
                  <InputGroupAddon addonType="prepend"><InputGroupText>KG</InputGroupText></InputGroupAddon>
                  <Input type='number' name='family_unit' defaultValue={product.family_unit} placeholder='Le poid unitaire dans un panier familiale' />
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Unité Découverte :</Label>
              </Col>
              <Col xs='12' md='9'>
                <InputGroup>
                  <InputGroupAddon addonType="prepend"><InputGroupText>KG</InputGroupText></InputGroupAddon>
                  <Input type='number' name='discovery_unit' defaultValue={product.discovery_unit} placeholder='Le poid unitaire dans un panier découverte' />
                </InputGroup>
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </form>
    ;
  }

}
