import React, { Component } from 'react'
import {Row, Col, FormGroup, Input, Label} from 'reactstrap'
import {Image} from 'ayla-client/react/components/Media'
import PlacesAutocomplete from 'react-places-autocomplete'
import RaisedButton from 'material-ui/RaisedButton'

const ERRORS_STACK = {
  firstname : 'SVP, choisir un prénom correcte !',
  lastname  : 'SVP, choisir un nom correcte !',
  phone     : 'SVP, choisir un numero valide !',
  email     : 'SVP, choisir un e-mail valide !',
  adress    : 'SVP, choisir une adress valide !',
  city      : 'SVP, choisir le nom d\'une ville valide !'
}


export default class ClientForm extends Component {


  imageHandler = e => {
    let file    = e.target.files ? e.target.files[0] : null
      , reader  = new FileReader()

    if (file && file.type.match('image.*'))
      reader.readAsDataURL(file),
      reader.onload = ev => {
        let image = { src: reader.result, name: file.name }
        this.props.clientHandler({ image })
        // this.props.progress(100)
      }
      // reader.onerror = err => {}
      // reader.onprogress = p => {}

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
    this.props.clientHandler({ adress })
  }

  adressSelector = adress => {
    console.log('adress selector', adress)
    this.props.clientHandler({ adress })
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
    let {client}  = this.props
      , toDelete  = this.props.theme == 'danger'
      , toAdd     = this.props.theme == 'primary'

    if (toAdd) delete client._id

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

    return <Row className={`form-${this.props.theme}`}>
      <Col xs="12">
        <Input hidden type="text" name="_id" defaultValue={client._id}/>
        <FormGroup row className='fx fx-ac'>
          <Col md="3">
            <Label>Civilité</Label>
          </Col>
          <Col md="9">
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="civility" checked={client.civility=='mr'} value="mr" onChange={e => this.props.clientHandler({ civility: e.target.value })} />
              <Label className="form-check-label" check>Mr</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="civility" checked={client.civility=='mme'} value="mme" onChange={e => this.props.clientHandler({ civility: e.target.value })} />
              <Label className="form-check-label" check>Mme</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" name="civility" checked={client.civility=='mlle'} value="mlle" onChange={e => this.props.clientHandler({ civility: e.target.value })} />
              <Label className="form-check-label" check>Mlle</Label>
            </FormGroup>
          </Col>
        </FormGroup>
        <FormGroup row className={`fx fx-ac form-${this.props.errorsFlag.firstname}`}>
          <Col md="3">
            <Label>Prénom <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
          </Col>
          <Col xs="12" md="9">
            <Input type="text" name="firstname" className='danger' defaultValue={client.firstname} onChange={e => this.props.clientHandler({firstname: e.target.value})} placeholder="Entrez le prénom .."/>
            <div className="invalid-feedback">{ERRORS_STACK.firstname}</div>
          </Col>
        </FormGroup>
        <FormGroup row className={`fx fx-ac form-${this.props.errorsFlag.lastname}`}>
          <Col md="3">
            <Label>Nom <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
          </Col>
          <Col xs="12" md="9">
            <Input type="text" name="lastname"  defaultValue={client.lastname} onChange={e => this.props.clientHandler({lastname: e.target.value})} placeholder="Entrez le nom .."/>
            <div className="invalid-feedback">{ERRORS_STACK.lastname}</div>
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac'>
          <Col md='3'>
            <Label>Photo</Label>
          </Col>
          <Col xs='12' md='9'>
            <Image src={client.image} width='75' height='75' alt='Image aperçu' className='image-preview' />
            <Input type='file' accept='image/*' name='image' defaultValue={client.image} onChange={this.imageHandler} />
          </Col>
        </FormGroup>
        <FormGroup row className={`fx fx-ac form-${this.props.errorsFlag.email}`}>
          <Col md="3">
            <Label>Email</Label>
          </Col>
          <Col xs="12" md="9">
            <Input type="email" name="email" defaultValue={client.email} onChange={e => this.props.clientHandler({email: e.target.value})} placeholder="Entrez l'email .."/>
            <div className="invalid-feedback">{ERRORS_STACK.email}</div>
          </Col>
        </FormGroup>
        <FormGroup row className={`fx fx-ac form-${this.props.errorsFlag.phone}`}>
          <Col md="3">
            <Label>Téléphone <i className='fa fa-star font-xs ml-1 info-clr' title='Champ obligatoire'/></Label>
          </Col>
          <Col xs="12" md="9">
            <Input type="tel" name="phone"  defaultValue={client.phone} onChange={e => this.props.clientHandler({phone: e.target.value})} placeholder="Entrez le numero de téléphone .."/>
            <div className="invalid-feedback">{ERRORS_STACK.phone}</div>
          </Col>
        </FormGroup>
        <FormGroup row className='fx fx-ac'>
          <Col md="3">
            <Label>CIN</Label>
          </Col>
          <Col xs="12" md="9">
            <Input type="text" name="nidc" defaultValue={client.nidc} onChange={e => this.props.clientHandler({nidc: e.target.value})} placeholder="Entrez le CIN .."/>
          </Col>
        </FormGroup>
        <FormGroup row className={`fx fx-ac form-${this.props.errorsFlag.adress}`}>
          <Col md="3">
            <Label>Adresse <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
          </Col>
          <Col xs="12" md="9">
            <Input type='text' name='adress' defaultValue={client.adress} onChange={e => this.props.clientHandler({ adress: e.target.value })} placeholder={'Entrez l\'addresse ..'} />
            <div className="invalid-feedback">{ERRORS_STACK.adress}</div>
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
              //             className: `location-search-input form-control form-${this.props.errorsFlag.adress}`
              //           })}
              //         />
              //         <div className="autocomplete-dropdown-container">
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
          <Col md="3">
            <Label>Date de naissance</Label>
          </Col>
          <Col xs="12" md="9">
            <Input type="date" name="birdday" defaultValue={client.birdday} onChange={e => this.props.clientHandler({birdday: e.target.value})} placeholder="Entrez la date de naissance .."/>
          </Col>
        </FormGroup>
        <FormGroup row className={`fx fx-ac form-${this.props.errorsFlag.city}`}>
          <Col md="3">
            <Label>Ville <i className='fa fa-star font-xs ml-3 info-clr' title='Champ obligatoire'/></Label>
          </Col>
          <Col xs="12" md="9">
            <Input type="text" name="city"  defaultValue={client.city} onChange={e => this.props.clientHandler({city: e.target.value})} placeholder="Entrez le nom de la ville .."/>
            <div className="invalid-feedback">{ERRORS_STACK.city}</div>
          </Col>
        </FormGroup>
      </Col>
    </Row>
  }

}
