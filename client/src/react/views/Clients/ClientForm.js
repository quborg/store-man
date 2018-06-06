import React, { Component } from 'react'
import moment from 'moment'
import {saveClient, delClient, arcClient, unaClient} from 'ayla-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label} from 'reactstrap'
import {Image, ImageFileLoader} from 'ayla-client/react/components/Media'
import PlacesAutocomplete from 'react-places-autocomplete'
import RaisedButton from 'material-ui/RaisedButton'
import {ERRORS_STACK, MSG} from 'ayla-client/react/views/settings'
import validateFields from 'ayla-client/react/plugins/form-validator'

const REQUIRED_KEYS = { firstname:'',lastname:'',phone:'',adress:'',city:'' }


export default class ClientForm extends Component {

  static defaultProps = {
    item: REQUIRED_KEYS,
    theme: '',
    setAction: () => {},
    initModal: () => {},
    progress: () => 0,
  }

  state = {
    item: REQUIRED_KEYS,
    toArch: undefined,
    toUnar: undefined,
    toDel: undefined,
    toInfo: undefined,
    errorsFlag: { ...REQUIRED_KEYS, email:'', image:'' },
    errorRuntime: false
  }

  componentWillMount() {
    let [item, { theme }] = [{...this.state.item, ...this.props.item}, this.props]
    const toAdd  = theme == 'primary'
        , toArch = theme == 'secondary'
        , toUnar = theme == 'success'
        , toDel  = theme == 'danger'
        , toInfo = theme == 'info'
    if (toAdd) delete item._id
    this.setState({item, toDel, toInfo, toArch, toUnar})
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
    let [item, _errorsFlag] = [{...this.state.item}, {...this.state.errorsFlag}]
      , toAdd                 = this.props.theme == 'primary'
    if (toAdd) delete item._id
    let {errorsFlag, errorRuntime} = validateFields(item, _errorsFlag)
    if (!errorRuntime) {
      this.props.dispatch( saveClient(item) )
      this.props.resetSelection()
      this.props.initModal()
    } else this.props.setAction('REV')
    this.setState({ errorsFlag, errorRuntime })
  }

  arcItem = () => {
    this.props.dispatch( arcClient(this.state.item._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  unaItem = () => {
    this.props.dispatch( unaClient(this.state.item._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  delItem = () => {
    this.props.dispatch( delClient(this.state.item._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  itemHandler = nextItem => {
    let item       = { ...this.state.item, ...nextItem }
      , errorsFlag = { ...this.state.errorsFlag }
    if (this.state.errorRuntime) {
      errorsFlag = validateFields(nextItem, errorsFlag).errorsFlag
    }
    this.setState({ item, errorsFlag })
  }

  adressHandler = adress => {
    if (navigator.geolocation) {
      console.log('geo')
      // navigator.geolocation.getCurrentPosition(function(position) {
      //   var geolocation = {
      //     lat: position.coords.latitude,
      //     lng: position.coords.longitude
      //   };
      //   var circle = new google.maps.Circle({
      //     center: geolocation,
      //     radius: position.coords.accuracy
      //   });
      //   autocomplete.setBounds(circle.getBounds());
      // });
    }
    this.itemHandler({ adress })
  }

  adressSelector = adress => {
    console.log('adress selector', adress)
    this.itemHandler({ adress })
  }

  itemTitle = ({civility, firstname, lastname} = this.state.item) => [
    civility?civility.toCapitalize()+' ':'',
    firstname?firstname+' ':'',
    lastname||''
  ]


  formGroupEntityRender() {
    const {item}  = this.state
        , DICO      = {
                        phone:'Téléphone',
                        email:'E-mail',
                        adress:'Addresse',
                        city:'Ville',
                        birdday:'Date de naissance',
                        nidc:'CIN'
                      }
    return [
      <FormGroup key='dico-form-head' row className='entity-header'>
        <Col xs='3'>
          <Image src={item.image} width='75' height='75' alt='Image aperçu'/>
        </Col>
        <Col xs='9' className='collection'>
          <h3><Label>{this.itemTitle()}</Label></h3>
          <div>Créer le {moment(item.created_at).format('dddd DD MMMM YYYY à HH:mm')}</div>
        </Col>
      </FormGroup>,
      ...Object.keys(DICO).map( key =>
        <FormGroup row key={`dico-form-${key}`}>
          <Col xs='3'>
            <Label>{DICO[key]}</Label>
          </Col>
          <Col xs='9'>
            {item[key]||'(vide)'}
          </Col>
        </FormGroup>
      )
    ]
  }

  render() {
    let {item, toArch, toUnar, toDel, toInfo}  = this.state
      , msgKey = toArch ? 'arc' : toDel ? 'del' : toUnar ? 'una' : null

    if (toArch || toUnar || toDel || toInfo) {
      return <Row className='fx fx-jc'>
        {msgKey && <h5 className={`${msgKey}-clr pb-2`}>{MSG[msgKey].client}</h5>}
        <Col xs='12'>
          { this.formGroupEntityRender() }
        </Col>
      </Row>
    }

    return <form className='form-horizontal' >
      <Row className={`form-${this.props.theme}`}>
        <Col xs='12'>
          <Input hidden type='text' name='_id' defaultValue={item._id}/>
          <FormGroup row className='fx fx-ac'>
            <Col md='3'>
              <Label>Civilité</Label>
            </Col>
            <Col md='9'>
              <FormGroup check inline>
                <Input className='form-check-input' type='radio' name='civility' checked={item.civility=='mr'} value='mr' onChange={e => this.itemHandler({ civility: e.target.value })} />
                <Label className='form-check-label' check>Mr</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className='form-check-input' type='radio' name='civility' checked={item.civility=='mme'} value='mme' onChange={e => this.itemHandler({ civility: e.target.value })} />
                <Label className='form-check-label' check>Mme</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className='form-check-input' type='radio' name='civility' checked={item.civility=='mlle'} value='mlle' onChange={e => this.itemHandler({ civility: e.target.value })} />
                <Label className='form-check-label' check>Mlle</Label>
              </FormGroup>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.firstname}`}>
            <Col md='3'>
              <Label>Prénom <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='firstname' className='danger' defaultValue={item.firstname} onChange={e => this.itemHandler({firstname: e.target.value})} placeholder='Entrez le prénom ..'/>
              <div className='invalid-feedback'>{ERRORS_STACK.firstname}</div>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.lastname}`}>
            <Col md='3'>
              <Label>Nom <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='lastname'  defaultValue={item.lastname} onChange={e => this.itemHandler({lastname: e.target.value})} placeholder='Entrez le nom ..'/>
              <div className='invalid-feedback'>{ERRORS_STACK.lastname}</div>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.image}`}>
            <Col md='3'>
              <Label>Photo</Label>
            </Col>
            <Col xs='12' md='9'>
              <ImageFileLoader src={item.image} handler={this.itemHandler} progress={this.props.progress} />
              <div className='invalid-feedback'>{ERRORS_STACK.image}</div>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.email}`}>
            <Col md='3'>
              <Label>Email</Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='email' name='email' defaultValue={item.email} onChange={e => this.itemHandler({email: e.target.value})} placeholder={'Entrez l\'email ..'}/>
              <div className='invalid-feedback'>{ERRORS_STACK.email}</div>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.phone}`}>
            <Col md='3'>
              <Label>Téléphone <i className='fa fa-star font-xs ml-1 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='tel' name='phone'  defaultValue={item.phone} onChange={e => this.itemHandler({phone: e.target.value})} placeholder='Entrez le numero de téléphone ..'/>
              <div className='invalid-feedback'>{ERRORS_STACK.phone}</div>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md='3'>
              <Label>CIN</Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='nidc' defaultValue={item.nidc} onChange={e => this.itemHandler({nidc: e.target.value})} placeholder='Entrez le CIN ..'/>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.adress}`}>
            <Col md='3'>
              <Label>Adresse <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='adress' defaultValue={item.adress} onChange={e => this.itemHandler({ adress: e.target.value })} placeholder={'Entrez l\'addresse ..'} />
              <div className='invalid-feedback'>{ERRORS_STACK.adress}</div>
              {
                // <PlacesAutocomplete
                //     value={item.adress}
                //     onChange={this.adressHandler}
                //     onSelect={this.adressSelector} >
                //   {
                //     ({ getInputProps, suggestions, getSuggestionItemProps }) => {
                //       return <div>
                //         <input
                //           {...getInputProps({
                //             name: 'adress',
                //             placeholder: 'Entrez l\'addresse ..',
                //             className: `location-search-input form-control form-${this.state.errorsFlag.adress}`
                //           })}
                //         />
                //         <div className='autocomplete-dropdown-container'>
                //           {suggestions.map(suggestion => {
                //             const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                //             // inline style for demonstration purpose
                //             const style = suggestion.active
                //                         ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                //                         : { backgroundColor: '#ffffff', cursor: 'pointer' };
                //             return (
                //               <div {...getSuggestionItemProps(suggestion, { className, style })}>
                //                 <span>{suggestion.description}</span>
                //               </div>
                //             )
                //           })}
                //         </div>
                //       </div>
                //     }
                //   }
                // </PlacesAutocomplete>
              }
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md='3'>
              <Label>Date de naissance</Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='date' name='birdday' defaultValue={item.birdday} onChange={e => this.itemHandler({birdday: e.target.value})} placeholder='Entrez la date de naissance ..'/>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.city}`}>
            <Col md='3'>
              <Label>Ville <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='city'  defaultValue={item.city} onChange={e => this.itemHandler({city: e.target.value})} placeholder='Entrez le nom de la ville ..'/>
              <div className='invalid-feedback'>{ERRORS_STACK.city}</div>
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </form>
  }

}
