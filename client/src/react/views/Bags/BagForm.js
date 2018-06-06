import React, { Component } from 'react'
import {saveBag, delBag} from 'ayla-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap'
import {Image, ImageFileLoader} from 'ayla-client/react/components/Media'
import validateFields from 'ayla-client/react/plugins/form-validator'
import {ERRORS_STACK, MSG} from 'ayla-client/react/views/settings'

const REQUIRED_KEYS = { name : '' }


export default class BagForm extends Component {

  static defaultProps = {
    bag: REQUIRED_KEYS,
    theme: '',
    setAction: () => {},
    initModal: () => {},
    progress: () => 0
  }

  state = {
    bag: REQUIRED_KEYS,
    toDel: undefined,
    toInfo: undefined,
    errorsFlag: { ...REQUIRED_KEYS, image:'' },
    errorRuntime: false
  }

  componentWillMount() {
    let [bag, { theme }] = [{...this.state.bag, ...this.props.bag}, this.props]
    const toAdd    = theme == 'primary'
        , toDel = theme == 'danger'
        , toInfo   = theme == 'info'
    if (toAdd) delete bag._id
    this.setState({bag, toDel, toInfo})
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
    let [bag, _errorsFlag] = [{...this.state.bag}, {...this.state.errorsFlag}]
    if (this.state.theme == 'primary') delete bag._id
    let {errorsFlag, errorRuntime} = validateFields(bag, _errorsFlag)
    if (!errorRuntime) {
      this.props.dispatch( saveBag(bag) )
      this.props.resetSelection()
      this.props.initModal()
    }
    this.setState({ errorsFlag, errorRuntime })
  }

  delBag() {
    this.props.dispatch( delBag(this.state.bag._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  bagHandler = nextBag => {
    let errorsFlag = { ...this.state.errorsFlag }
    if (this.state.errorRuntime) {
      errorsFlag = validateFields(nextBag, errorsFlag).errorsFlag
    }
    let bag = { ...this.state.bag, ...nextBag }
    this.setState({ bag, errorsFlag })
  }

  render() {
    let { bag, toDel, toInfo } = this.state

    if (toDel || toInfo) {
      return <FormGroup row className='fx fx-jc'>
        {toDel && <h5 className='danger-clr pb-2'>{MSG.del.bag}</h5>}
        <Col xs='3'>
          <Image src={bag.image} width='75' height='75' alt='Image aperçu' />
        </Col>
        <Col xs='9'>
          <h3><Label>{bag.name}</Label></h3>
          <div className='fx fx-ab'>Capacité : <b className='font-xl ml-2 mr-1'>{bag.volume}</b> KG</div>
        </Col>
      </FormGroup>
    }

    return <form className="form-horizontal" >
        <Row className={`form-${this.props.theme}`}>
          <Col xs='12'>
            <Input hidden type='text' name='_id' defaultValue={bag._id}/>
            <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.name}`}>
              <Col md='3'>
                <Label>Nom <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
              </Col>
              <Col xs='12' md='9'>
                <Input type='text' name='name' defaultValue={bag.name} onChange={e => this.bagHandler({name: e.target.value})} placeholder={'Entrez le nom de l\'embalage'}/>
                <div className="invalid-feedback">{ERRORS_STACK.name}</div>
              </Col>
            </FormGroup>
            <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.image}`}>
              <Col md='3'>
                <Label>Image</Label>
              </Col>
              <Col xs='12' md='9'>
                <ImageFileLoader src={bag.image} handler={this.bagHandler} progress={this.props.progress}/>
                <div className="invalid-feedback">{ERRORS_STACK.image}</div>
              </Col>
            </FormGroup>
            <FormGroup row className='fx fx-ac'>
              <Col md='3'>
                <Label>Volume</Label>
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
