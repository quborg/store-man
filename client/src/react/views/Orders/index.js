import React, { Component } from 'react'
import {connect} from 'react-redux'
import serialize from 'form-serialize'
import {saveOrder, delOrder} from 'ayla-client/redux/actions'
import {Container, Row, Col, Button,
        Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import OrderForm from './OrderForm'

const selectRowProp = cb => ({
  mode: 'radio',
  clickToSelect: true,
  onSelect: cb,
})

const options = {
  sizePerPageList: [ 10, 100 ],
  sizePerPage: 10,
  sortName: 'created_at',
  sortOrder: 'desc',
  noDataText: 'Aucune commande n\'a été prise.'
}


class Orders extends Component {

  state = {
    order: {},
    selected: false,
    isOpen: false,
    theme: '',
    action: ''
  }

  setModal(theme, action, isOpen=true) {
    this.setState({ isOpen, theme, action })
  }

  onSelectOrder = (order, selected) => {
    selected
    ? this.setState({order, selected})
    : this.setState({order: {}, selected})
  }

  saveOrder = () => {
    this.props.dispatch( saveOrder(this.state.client) )
    this.setState({isOpen: false})
  }

  delClient = () => {
    this.props.dispatch( delClient(this.state.client._id) )
    this.setState({isOpen: false, selected: false, client: {}})
  }

  orderHandler = () => {
    let form = document.getElementById('order-form')
      , data = serialize(form,{ hash: true })
    this.setState({order: data})
  }

  getModalAction() {
    switch(this.state.theme) {
      case 'primary': return <Button color="primary" onClick={this.saveOrder}>
                               <i className='fa fa-plus'></i> Ajouter
                             </Button>
      case 'warning': return <Button color="warning" onClick={this.saveOrder}>
                               <i className='fa fa-save'></i> Sauvegarder
                             </Button>
      case 'danger': return <Button color="danger" onClick={this.delClient}>
                               <i className='fa fa-trash'></i> Supprimer
                             </Button>
    }
  }

  getOrdersActions = () => [
    <button key='add-cli-board' type='button' className='fx fx-ae px-4 btn btn-primary'
      onClick={() => this.setModal('primary', 'Ajouter')}>
      <i className='fa fa-plus lead'></i>
    </button>,
    <button key='edit-cli-board' type='button' className='fx fx-ae px-4 btn btn-warning' {...{disabled: !this.state.selected}}
      onClick={() => this.setModal('warning', 'Modifier')}>
      <i className='fa fa-edit lead'></i>
    </button>,
    <button key='del-cli-board' type='button' className='fx fx-ae px-4 btn btn-danger' {...{disabled: !this.state.selected}}
      onClick={() => this.setModal('danger', 'Supprimer')}>
      <i className='fa fa-trash lead'></i>
    </button>
  ]

  render() {
    const isAjout = this.state.action == 'Ajouter'
        , orderData = isAjout ? {} : this.state.client

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Toutes les commandes</h2>
            </div>
            <div className='fx fx-je fx-rev pt-3'>
              {this.getOrdersActions()}
            </div>
          </Row>
          <Row className='pt-5'>
            <BootstrapTable striped hover
                maxHeight='376'
                containerClass='main-table'
                trClassName='pointer'
                data={this.props.data}
                selectRow={selectRowProp(this.onSelectOrder)}
                pagination options={options} >
              <TableHeaderColumn dataField='_id' isKey hidden>#</TableHeaderColumn>
              <TableHeaderColumn dataField='created_at' dataSort={true}>Date</TableHeaderColumn>
              <TableHeaderColumn dataField='client_id' dataSort={true}>Client id</TableHeaderColumn>
              <TableHeaderColumn dataField='basket_type'>Type de panier</TableHeaderColumn>
              <TableHeaderColumn dataField='total_price'>Total</TableHeaderColumn>
              <TableHeaderColumn dataField='status'>Status</TableHeaderColumn>
            </BootstrapTable>
          </Row>
        </Container>
        <Modal isOpen={this.state.isOpen} toggle={() => this.setState({isOpen: false})} className={`modal-${this.state.theme}`}>
          <ModalHeader>{this.state.action} une commande</ModalHeader>
            <ModalBody>
              <form id="order-form" className="form-horizontal" onChange={this.orderHandler}>
                <OrderForm data={orderData} clients={this.props.clients} theme={this.state.theme}/>
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

const mapState = ({orders:{data}, clients:{data:clients}}, ownProps) => {
  ownProps = { ...ownProps, data, clients }
  return ownProps
}

export default connect(mapState)(Orders)

export WeekOrders from './WeekOrders'
