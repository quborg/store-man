import React, { Component } from 'react'
import {connect} from 'react-redux'
import serialize from 'form-serialize'
import {getClients, saveClient, delClient} from 'ayla-client/redux/actions/api'
import {Container, Row, Col, Button,
        Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import ClientForm from './ClientForm'
import {Image} from 'ayla-client/react/components/Media'
import RaisedButton from 'material-ui/RaisedButton'
import moment from 'moment'
import {NO_CLIENTS_MSG} from 'ayla-client/react/views/Static/Messages'
import {reg} from 'ayla-client/react/plugins/form-regex'

const selectRowProp = cb => ({
  mode: 'radio',
  clickToSelect: true,
  bgColor: '#B2EBF2',
  onSelect: cb
})

const options = {
  sizePerPageList: [ 10, 100 ],
  sizePerPage: 10,
  sortName: 'created_at',
  sortOrder: 'desc',
  noDataText: NO_CLIENTS_MSG
}

const REQUIRED_KEYS = { firstname:'',lastname:'',phone:'',adress:'',city:'' }


class Clients extends Component {

  state = {
    client: REQUIRED_KEYS,
    selected: false,
    isOpen: false,
    theme: '',
    action: '',
    errorsFlag: { ...REQUIRED_KEYS, email: '' },
    errorRuntime: false
  }


  componentWillMount() {
    this.props.dispatch(getClients())
  }

  setModal(isOpen, theme, action) {
    this.setState({ isOpen, theme, action })
  }

  onSelectClient = (client, selected) => {
    selected
    ? this.setState({client, selected})
    : this.setState({client: {}, selected})
  }

  saveClient = () => {
    let client = { ...this.state.client }
    if (this.state.theme == 'primary') delete client._id
    if (this.validateClientFields(client)) {
      this.props.dispatch( saveClient(client) )
      this.setState({ isOpen: false, errorRuntime: false })
    }
    else this.setState({errorRuntime: true})
  }

  delClient = () => {
    this.props.dispatch( delClient(this.state.client._id) )
    this.setState({ isOpen: false, selected: false, client: {} })
  }

  validateClientFields = client => {
    let keys = Object.keys(client)
      , errorsFlag = { ...this.state.errorsFlag }
      , flagValid = true
    if (keys.length) {
      keys.map( key => {
        if (client.hasOwnProperty(key) && key in this.state.errorsFlag) {
          const validate = ex => reg[ex](client[key])
          let keyIsValid = true
          switch (key) {
            case 'email': keyIsValid = validate('email'); break
            case 'phone': keyIsValid = validate('phone'); break
            default     : keyIsValid = validate('name');
          }
          errorsFlag[key] = keyIsValid ? '' : 'error'
          !keyIsValid && ( flagValid = false )
        }
      })
    }
    this.setState({ errorsFlag })
    return flagValid
  }

  clientHandler = nextClient => {
    if (nextClient.email && !nextClient.email) delete nextClient.email
    this.state.errorRuntime && this.validateClientFields(nextClient)
    let client = { ...this.state.client, ...nextClient }
    this.setState({ client })
  }

  getModalAction() {
    switch(this.state.theme) {
      case 'primary': return <Button color="primary" onClick={this.saveClient}>
                               <i className='fa fa-plus'></i> Ajouter
                             </Button>
      case 'warning': return <Button color="warning" onClick={this.saveClient}>
                               <i className='fa fa-save'></i> Sauvegarder
                             </Button>
      case 'danger':  return <Button color="danger" onClick={this.delClient}>
                               <i className='fa fa-trash'></i> Supprimer
                             </Button>
    }
  }

  getClientsActions = () => [
    <RaisedButton key='add-cli-board'
                  onClick={() => this.setModal(true, 'primary', 'Ajouter')}
                  backgroundColor='#00bcd4'
                  icon={<i className="fa fa-plus lead" />}
    />,
    <RaisedButton key='edit-cli-board'
                  onClick={() => this.setModal(true, 'warning', 'Modifier')}
                  className={this.state.selected.toString()}
                  backgroundColor={this.state.selected?'#FFC107':'#FFD54F'}
                  icon={<i className='fa fa-edit lead' />}
    />,
    <RaisedButton key='del-cli-board'
                  onClick={() => this.setModal(true, 'danger', 'Supprimer')}
                  className={this.state.selected.toString()}
                  backgroundColor={this.state.selected?'#E91E63':'#F06292'}
                  icon={<i className='fa fa-trash lead' />}
    />
  ]

  imageFormater = cell => <Image src={cell} width='30' height='30' alt='Image aperçu' className='image-preview radius-2' />

  dateFormater = cell => moment(cell).format('dddd DD MMMM, HH:mm')

  fullNameFormater = (cell, row) => (row.firstname +' '+ row.lastname).trim()

  render() {
    const [client, {clientHandler}, {theme, action, isOpen, errorsFlag}] = [{ ...this.state.client }, this, this.state]

    return (
      <div className='animated fadeIn clients-view'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les clients</h2>
            </div>
            <div className='fx fx-je fx-rev pt-3 ops-btns'>
              {this.getClientsActions()}
            </div>
          </Row>
          <Row className='pt-5'>
            <BootstrapTable hover bordered={false} condensed
                maxHeight='398'
                containerClass='main-table'
                trClassName='pointer'
                data={this.props.data}
                selectRow={selectRowProp(this.onSelectClient)}
                pagination options={options} >
              <TableHeaderColumn dataField='_id' isKey hidden>#</TableHeaderColumn>
              <TableHeaderColumn dataField='image' dataFormat={this.imageFormater} thStyle={{width:'64px'}} tdStyle={{padding:'2px 16px', width:'64px'}}>Image</TableHeaderColumn>
              <TableHeaderColumn dataField='firstname' dataFormat={this.fullNameFormater} dataSort={true}>Nom Complet</TableHeaderColumn>
              <TableHeaderColumn dataField='phone'>Tél</TableHeaderColumn>
              <TableHeaderColumn dataField='adress'>Addresse</TableHeaderColumn>
              <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
              <TableHeaderColumn dataField='created_at' dataFormat={this.dateFormater} dataSort={true}>{'Date d\'ajout'}</TableHeaderColumn>
            </BootstrapTable>
          </Row>
        </Container>
        <Modal {...{isOpen}} toggle={() => this.setState({isOpen: false})} className={`modal-${theme}`}>
          <ModalHeader>{action} un client</ModalHeader>
            <ModalBody>
              <form id="client-form" className="form-horizontal" >
                <ClientForm {...{theme, client, clientHandler, errorsFlag}} />
              </form>
            </ModalBody>
            <ModalFooter>
              {this.getModalAction()}
              <Button color="secondary" onClick={() => this.setState({isOpen: false})}>
                <i className='fa fa-ban'></i> Annuler
              </Button>
            </ModalFooter>
        </Modal>
      </div>
    )
  }
}

const mapState = ({clients:{data}}, ownProps) => {
  ownProps = { ...ownProps, data }
  return ownProps
}

export default connect(mapState)(Clients)
