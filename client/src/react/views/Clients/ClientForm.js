import React, { Component } from 'react'
import {Row, Col, FormGroup, Input, Label} from 'reactstrap'


export default class ClientForm extends Component {

  state = {
    civility: ''
  }

  componentWillMount() {
    this.props.styleType == 'warning' &&
    this.setState({
      civility: this.props.data.civility
    })
  }

  civilityHandler = e => {
    this.setState({civility: e.target.value})
  }

  render() {
    let keys =  Object.keys(this.props.data).reduce((keys, key) => {
                  let safeKey = ['__v','updated_at','created_at','_id','civility','birdday'].indexOf(key) === -1
                  safeKey && keys.push(key)
                  return keys
                }, [])
    return this.props.styleType == 'danger'
    ? <Row className='fx fx-jc'>
        <h4 className='color-danger pb-2'>Vous êtes sur le point de supprimer le client suivant :</h4>
        <div className='entity-del'>
          {
            keys.map( key =>
              <div key={`key-${key}`} className='b'>
                {this.props.data[key]}
              </div>
            )
          }
        </div>
      </Row>
    : <Row className={`form-${this.props.styleType}`}>
        <Col xs="12">
          <Input hidden type="text" name="_id" defaultValue={this.props.data._id}/>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Civilité</Label>
            </Col>
            <Col md="9">
              <FormGroup check inline>
                <Input className="form-check-input" type="radio" name="civility" checked={this.state.civility=='mr'} value="mr" onChange={this.civilityHandler} />
                <Label className="form-check-label" check>Mr</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className="form-check-input" type="radio" name="civility" checked={this.state.civility=='mme'} value="mme" onChange={this.civilityHandler} />
                <Label className="form-check-label" check>Mme</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className="form-check-input" type="radio" name="civility" checked={this.state.civility=='mlle'} value="mlle" onChange={this.civilityHandler} />
                <Label className="form-check-label" check>Mlle</Label>
              </FormGroup>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Prénom</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" name="firstname" defaultValue={this.props.data.firstname} placeholder="Entrez votre prénom"/>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Nom</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" name="lastname" defaultValue={this.props.data.lastname} placeholder="Entrez votre nom"/>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Email</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="email" name="email" defaultValue={this.props.data.email} placeholder="Entrez votre email"/>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Téléphone</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="tel" name="phone" defaultValue={this.props.data.phone} placeholder="Entrez votre numero de téléphone"/>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>CIN</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" name="nidc" defaultValue={this.props.data.nidc} placeholder="Entrez votre CIN"/>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Adresse</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" name="adress" defaultValue={this.props.data.adress} placeholder="Entrez votre addresse"/>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Date de naissance</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="date" name="birdday" defaultValue={this.props.data.birdday} placeholder="Entrez votre date de naissance"/>
            </Col>
          </FormGroup>
          <FormGroup row className='fx fx-ac'>
            <Col md="3">
              <Label>Ville</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" name="city" defaultValue={this.props.data.city} placeholder="Entrez le nom de votre ville"/>
            </Col>
          </FormGroup>
        </Col>
      </Row>
    ;
  }

}
