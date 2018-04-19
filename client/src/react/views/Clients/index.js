import React, { Component } from 'react'
import {connect} from 'react-redux'
import serialize from 'form-serialize'
import {getClients, saveClient, delClient} from 'ayla-client/react/actions'
import {Container, Row, Col, Button,
        Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import ClientForm from './ClientForm'

const selectRowProp = cb => ({
  mode: 'radio',
  clickToSelect: true,
  onSelect: cb,
})

const options = {
  sizePerPageList: [ 10, 100 ],
  sizePerPage: 10,
  sortName: 'firstname',
  sortOrder: 'desc',
  noDataText: 'Aucun client enregistré.'
}


class Clients extends Component {

  state = {
    modal: false,
    modalTheme: 'primary',
    modalAction: '',
    client: {},
    selected: false
  }

  componentWillMount() {
    this.props.dispatch(getClients())
  }

  setModal(isOpen, theme, action) {
    this.setState({
      modal: isOpen,
      modalTheme: theme,
      modalAction: action
    })
  }

  onSelectClient = (client, selected) => {
    selected
    ? this.setState({client, selected})
    : this.setState({client: {}, selected})
  }

  saveClient = () => {
    this.props.dispatch(
      saveClient(this.state.client)
    )
    this.setState({modal: false})
  }

  delClient = () => {
    this.props.dispatch(
      delClient(this.state.client._id)
    )
    this.setState({modal: false})
  }

  clientHandler = () => {
    let form = document.getElementById('client-form')
      , data = serialize(form,{ hash: true })
    this.setState({client: data})
  }

  getModalAction() {
    switch(this.state.modalTheme) {
      case 'primary': return <Button color="primary" onClick={this.saveClient}>
                               <i className='fa fa-plus'></i> Ajouter
                             </Button>
      case 'warning': return <Button color="warning" onClick={this.saveClient}>
                               <i className='fa fa-save'></i> Sauvegarder
                             </Button>
      case 'danger': return <Button color="danger" onClick={this.delClient}>
                               <i className='fa fa-trash'></i> Supprimer
                             </Button>
    }
  }

  getClientsActions = () => [
    <button key='add-cli-board' type='button' className='fx fx-ae px-4 btn btn-primary'
      onClick={() => this.setModal(true, 'primary', 'Ajouter')}>
      <i className='fa fa-plus lead'></i>
    </button>,
    <button key='edit-cli-board' type='button' className='fx fx-ae px-4 btn btn-warning' {...{disabled: !this.state.selected}}
      onClick={() => this.setModal(true, 'warning', 'Modifier')}>
      <i className='fa fa-edit lead'></i>
    </button>,
    <button key='del-cli-board' type='button' className='fx fx-ae px-4 btn btn-danger' {...{disabled: !this.state.selected}}
      onClick={() => this.setModal(true, 'danger', 'Supprimer')}>
      <i className='fa fa-trash lead'></i>
    </button>
  ]

  render() {
    const Obj = {}
        , isAjout = this.state.modalAction == 'Ajouter'
        , clientData = isAjout ? Obj : this.state.client
    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les clients</h2>
            </div>
            <div className='fx fx-je fx-rev pt-3'>
              {this.getClientsActions()}
            </div>
          </Row>
          <Row className='pt-5'>
            <BootstrapTable striped hover
                maxHeight='376'
                containerClass='main-table'
                trClassName='pointer'
                data={this.props.data}
                selectRow={selectRowProp(this.onSelectClient)}
                pagination options={options} >
              <TableHeaderColumn dataField='_id' isKey width='200'>#</TableHeaderColumn>
              <TableHeaderColumn dataField='firstname' dataSort={true}>Prénom</TableHeaderColumn>
              <TableHeaderColumn dataField='lastname' dataSort={true}>Nom</TableHeaderColumn>
              <TableHeaderColumn dataField='phone'>Tél</TableHeaderColumn>
              <TableHeaderColumn dataField='adress'>Addresse</TableHeaderColumn>
              <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
            </BootstrapTable>
          </Row>
        </Container>
        <Modal isOpen={this.state.modal} toggle={() => this.setState({modal: false})} className={`modal-${this.state.modalTheme}`}>
          <ModalHeader>{this.state.modalAction} un client</ModalHeader>
            <ModalBody>
              <form id="client-form" className="form-horizontal" onChange={this.clientHandler}>
                <ClientForm data={clientData} styleType={this.state.modalTheme}/>
              </form>
            </ModalBody>
            <ModalFooter>
              {this.getModalAction()}
              <Button color="secondary" onClick={() => this.setState({modal: false})}>
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
