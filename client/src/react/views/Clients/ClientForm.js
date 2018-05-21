import React, { Component } from 'react'
import {saveClient, delClient} from 'ayla-client/redux/actions/api'
import {Row, Col, FormGroup, Input, Label} from 'reactstrap'
import {Image, ImageFileLoader} from 'ayla-client/react/components/Media'
import PlacesAutocomplete from 'react-places-autocomplete'
import RaisedButton from 'material-ui/RaisedButton'
import {ERRORS_STACK} from 'ayla-client/react/views/settings'
import validateFields from 'ayla-client/react/plugins/form-validator'

const REQUIRED_KEYS = { firstname:'',lastname:'',phone:'',adress:'',city:'' }


export default class ClientForm extends Component {

  static defaultProps = {
    client: REQUIRED_KEYS,
    theme: '',
    setAction: () => {},
    initModal: () => {},
    progress: () => 0,
  }

  state = {
    client: REQUIRED_KEYS,
    toDelete: undefined,
    errorsFlag: { ...REQUIRED_KEYS, email:'', image:'' },
    errorRuntime: false
  }

  componentWillMount() {
    let [client, { theme }] = [{...this.state.client, ...this.props.client}, this.props]
    const toAdd    = theme == 'primary'
        , toDelete = theme == 'danger'
    if (toAdd) delete client._id
    this.setState({client, toDelete})
  }

  componentWillReceiveProps({action:nextAction}) {
    if (nextAction && nextAction !== 'revision') this.actionsStarter(nextAction)
  }

  actionsStarter = action => {
    switch (action) {
      case 'NEW': this.saveClient()  ;break
      case 'PUT': this.saveClient()  ;break
      case 'DEL': this.delClient()   ;break
    }
  }

  saveClient = () => {
    let [client, _errorsFlag] = [{...this.state.client}, {...this.state.errorsFlag}]
    if (this.props.theme == 'primary') delete client._id
    let {errorsFlag, errorRuntime} = validateFields(client, _errorsFlag)
    if (!errorRuntime) {
      this.props.dispatch( saveClient(client) )
      this.props.resetSelection()
      this.props.initModal()
    } else this.props.setAction('revision')
    this.setState({ errorsFlag, errorRuntime })
  }

  delClient = () => {
    this.props.dispatch( delClient(this.state.client._id) )
    this.props.resetSelection()
    this.props.initModal()
  }

  clientHandler = nextClient => {
    let errorsFlag = { ...this.state.errorsFlag }
    let client = { ...this.state.client, ...nextClient }
    // if (nextClient.email && !nextClient.email) delete nextClient.email
    if (this.state.errorRuntime) {
      errorsFlag = validateFields(nextClient, errorsFlag).errorsFlag
    }
    this.setState({ client, errorsFlag })
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
    this.clientHandler({ adress })
  }

  adressSelector = adress => {
    console.log('adress selector', adress)
    this.clientHandler({ adress })
  }

  formGroupLabelButton = (key, value) => {
    const dico = {firstname:'Prénom',lastname:'Nom',image:'Image',email:'E-mail',phone:'Téléphone',nidc:'CIN',adress:'Addresse',city:'Ville'}
    return <FormGroup row key={`del-cli-form-${key}`}>
      <Col xs='3'>
        <Label>{dico[key]}</Label>
      </Col>
      <Col xs='9'>
        {
          key=='image'
          ? value
          : <RaisedButton label={value||'(vide)'} disabled={true} />
        }
      </Col>
    </FormGroup>
  }

  render() {
    let {client, toDelete}  = this.state

    if (toDelete) {
      let keys =  Object.keys(client).reduce((keys, key) => {
        let safeKey = ['__v','updated_at','created_at','_id','civility','birdday'].indexOf(key) === -1
        safeKey && keys.push(key)
        return keys
      }, [])

      return <Row className='fx fx-jc'>
        <h5 className='color-danger pb-2'>Vous êtes sur le point de supprimer le client suivant :</h5>
        <div className='entity-del collection'>
          {
            keys.map( key =>
              key == 'image'
              ? this.formGroupLabelButton(key, <Image src={client.image} width='50' height='50' alt='Image aperçu' className='image-preview' />)
              : this.formGroupLabelButton(key, client[key])
            )
          }
        </div>
      </Row>
    }

    return <form id='client-form' className='form-horizontal' >
      <Row className={`form-${this.props.theme}`}>
        <Col xs='12'>
          <Input hidden type='text' name='_id' defaultValue={client._id}/>
          <FormGroup row className='fx fx-ac'>
            <Col md='3'>
              <Label>Civilité</Label>
            </Col>
            <Col md='9'>
              <FormGroup check inline>
                <Input className='form-check-input' type='radio' name='civility' checked={client.civility=='mr'} value='mr' onChange={e => this.clientHandler({ civility: e.target.value })} />
                <Label className='form-check-label' check>Mr</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className='form-check-input' type='radio' name='civility' checked={client.civility=='mme'} value='mme' onChange={e => this.clientHandler({ civility: e.target.value })} />
                <Label className='form-check-label' check>Mme</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className='form-check-input' type='radio' name='civility' checked={client.civility=='mlle'} value='mlle' onChange={e => this.clientHandler({ civility: e.target.value })} />
                <Label className='form-check-label' check>Mlle</Label>
              </FormGroup>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.firstname}`}>
            <Col md='3'>
              <Label>Prénom <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='firstname' className='danger' defaultValue={client.firstname} onChange={e => this.clientHandler({firstname: e.target.value})} placeholder='Entrez le prénom ..'/>
              <div className='invalid-feedback'>{ERRORS_STACK.firstname}</div>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.lastname}`}>
            <Col md='3'>
              <Label>Nom <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='lastname'  defaultValue={client.lastname} onChange={e => this.clientHandler({lastname: e.target.value})} placeholder='Entrez le nom ..'/>
              <div className='invalid-feedback'>{ERRORS_STACK.lastname}</div>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.image}`}>
            <Col md='3'>
              <Label>Photo</Label>
            </Col>
            <Col xs='12' md='9'>
              <ImageFileLoader src={client.image} handler={this.clientHandler} progress={this.props.progress} />
              <div className='invalid-feedback'>{ERRORS_STACK.image}</div>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.email}`}>
            <Col md='3'>
              <Label>Email</Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='email' name='email' defaultValue={client.email} onChange={e => this.clientHandler({email: e.target.value})} placeholder={'Entrez l\'email ..'}/>
              <div className='invalid-feedback'>{ERRORS_STACK.email}</div>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.phone}`}>
            <Col md='3'>
              <Label>Téléphone <i className='fa fa-star font-xs ml-1 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='tel' name='phone'  defaultValue={client.phone} onChange={e => this.clientHandler({phone: e.target.value})} placeholder='Entrez le numero de téléphone ..'/>
              <div className='invalid-feedback'>{ERRORS_STACK.phone}</div>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md='3'>
              <Label>CIN</Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='nidc' defaultValue={client.nidc} onChange={e => this.clientHandler({nidc: e.target.value})} placeholder='Entrez le CIN ..'/>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.adress}`}>
            <Col md='3'>
              <Label>Adresse <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='adress' defaultValue={client.adress} onChange={e => this.clientHandler({ adress: e.target.value })} placeholder={'Entrez l\'addresse ..'} />
              <div className='invalid-feedback'>{ERRORS_STACK.adress}</div>
              {
                // <PlacesAutocomplete
                //     value={client.adress}
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
              <Input type='date' name='birdday' defaultValue={client.birdday} onChange={e => this.clientHandler({birdday: e.target.value})} placeholder='Entrez la date de naissance ..'/>
            </Col>
          </FormGroup>
          <FormGroup row className={`fx fx-ac form-${this.state.errorsFlag.city}`}>
            <Col md='3'>
              <Label>Ville <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
            </Col>
            <Col xs='12' md='9'>
              <Input type='text' name='city'  defaultValue={client.city} onChange={e => this.clientHandler({city: e.target.value})} placeholder='Entrez le nom de la ville ..'/>
              <div className='invalid-feedback'>{ERRORS_STACK.city}</div>
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </form>
  }

}
