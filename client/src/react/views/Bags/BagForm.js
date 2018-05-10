import React, { Component } from 'react'
import serialize from 'form-serialize'
import {saveBag, delBag} from 'ayla-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import {Image} from 'ayla-client/react/components/Media'


export default class BagForm extends Component {

  static defaultProps = {
    theme: '',
    bag: {},
    action: '',
    initModal: () => {},
    progress: () => 0
  }

  state = {
    bag: {},
    toDelete: undefined
  }

  componentWillMount() {
    let [bag, { theme }] = [{...this.props.bag}, this.props]
    const toAdd    = theme == 'primary'
        , toDelete = theme == 'danger'
    if (toAdd) delete bag._id
    this.setState({bag, toDelete})
  }

  componentWillReceiveProps({action:nextAction}) {
    if (nextAction) this.actionsStarter(nextAction)
  }

  actionsStarter = action => {
    this.setState({action})
    switch (action) {
      case 'NEW': this.saveBag()  ;break
      case 'PUT': this.saveBag()  ;break
      case 'DEL': this.delBag()   ;break
    }
  }

  saveBag() {
    this.props.dispatch( saveBag(this.state.bag) )
    this.props.initModal()
  }

  delBag() {
    this.props.dispatch( delBag(this.state.bag._id) )
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
        this.bagHandler({ image })
        this.props.progress(100)
      }
      // reader.onerror = err => {}
      // reader.onprogress = p => {}

  }

  bagHandler = nextProduct => {
    let bag = { ...this.state.bag, ...nextProduct }
    this.setState({ bag })
  }

  render() {
    let { bag, toDelete } = this.state

    return toDelete
    ? <Row className='fx fx-jc'>
        <h5 className='color-danger pb-2'>{'Vous êtes sur le point de supprimer l\'embalege suivant :'}</h5>
        <div className='entity-del'>
          <div>
            <Image src={bag.image} width='50' height='50' alt='Image aperçu' className='image-preview' />
          </div>
          <div className='b'>
            {bag.name} ( {bag.volume} KG )
          </div>
        </div>
      </Row>
    : <form id="bag-form" className="form-horizontal" >
        <Row className={`form-${this.props.theme}`}>
          <Col xs='12'>
            <Input hidden type='text' name='_id' defaultValue={bag._id}/>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Nom :</Label>
              </Col>
              <Col xs='12' md='9'>
                <Input type='text' name='name' defaultValue={bag.name} onChange={e => this.bagHandler({name: e.target.value})} placeholder='Entrez le nom du produit'/>
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Image :</Label>
              </Col>
              <Col xs='12' md='9'>
                <Image src={bag.image} width='75' height='75' alt='Image aperçu' className='image-preview' />
                <Input type='file' accept='image/*' name='image' defaultValue={bag.image} onChange={this.imageHandler} />
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Volume par KG :</Label>
              </Col>
              <Col xs='12' md='9'>
                <InputGroup>
                  <Input type='number' name='volume' defaultValue={bag.volume} onChange={e => this.bagHandler({volume: e.target.value})} placeholder={'Volume de l\'embalage'} className='text-right' />
                  <InputGroupAddon addonType="append"><InputGroupText>KG</InputGroupText></InputGroupAddon>
                </InputGroup>
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </form>
    ;
  }

}
