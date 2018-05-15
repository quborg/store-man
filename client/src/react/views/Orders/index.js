import React, { Component } from 'react'
import {connect} from 'react-redux'
import serialize from 'form-serialize'
import {getOrders, saveOrder, delOrder, getBaskets, getClients, getProducts, getBags} from 'ayla-client/redux/actions/api'
import {Container, Row, Col, Button,
        Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import OrderForm from './OrderForm'
import {Image} from 'ayla-client/react/components/Media'
import RaisedButton from 'material-ui/RaisedButton'
import moment from 'moment'
import {getCollectionById} from 'ayla-helper/ext'
import {LOAD_ORDERS_MSG} from 'ayla-client/react/views/Static/Messages'
import validateFields from 'ayla-client/react/plugins/form-validator'

const selectRowProp = cb => ({
  mode: 'radio',
  clickToSelect: true,
  bgColor: '#B2EBF2',
  onSelect: cb,
})
const options = {
  sizePerPageList: [ 10, 100 ],
  sizePerPage: 10,
  sortName: 'created_at',
  sortOrder: 'desc',
  noDataText: LOAD_ORDERS_MSG
}

const REQUIRED_KEYS = { client_id:'',basket:'' }


class Orders extends Component {

  state = {
    order: REQUIRED_KEYS,
    selected: false,
    isOpen: false,
    theme: '',
    action: '',
    errorsFlag: REQUIRED_KEYS,
    errorRuntime: false
  }

  componentWillMount() {
    this.props.dispatch(getOrders())
    this.props.dispatch(getBaskets())
    this.props.dispatch(getClients())
    this.props.dispatch(getProducts())
    this.props.dispatch(getBags())
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
    let [order, _errorsFlag]  = [{...this.state.order}, {...this.state.errorsFlag}]
      , isOpen                = true
      , toAdd                 = this.state.theme == 'primary'
    if (toAdd) delete order._id
    let {errorsFlag, errorRuntime} = validateFields(order, _errorsFlag)
    if (!errorRuntime) {
      this.props.dispatch( saveOrder(order) )
      isOpen = false
    }
    this.setState({errorRuntime, errorsFlag, isOpen})
  }

  delOrder = () => {
    this.props.dispatch( delOrder(this.state.order, this.props.baskets) )
    this.setState({isOpen: false, selected: false, order: {}})
  }

  orderHandler = nextOrder => {
    let errorsFlag = { ...this.state.errorsFlag }
    if (this.state.errorRuntime) {
      errorsFlag = validateFields(nextOrder, errorsFlag).errorsFlag
    }
    let order = { ...this.state.order, ...nextOrder }
    this.setState({ order, errorsFlag })
  }

  getModalAction() {
    switch(this.state.theme) {
      case 'primary': return <Button color='primary' onClick={this.saveOrder}>
                               <i className='fa fa-plus'></i> Ajouter
                             </Button>
      case 'warning': return <Button color='warning' onClick={this.saveOrder}>
                               <i className='fa fa-save'></i> Sauvegarder
                             </Button>
      case 'danger': return  <Button color='danger' onClick={this.delOrder}>
                               <i className='fa fa-trash'></i> Supprimer
                             </Button>
    }
  }

  getOrdersActions = () => [
    <RaisedButton key='add-ord-board'
                  onClick={() => this.setModal('primary', 'Ajouter')}
                  backgroundColor='#00bcd4'
                  icon={<i className="fa fa-plus lead" />}
    />,
    <RaisedButton key='edit-ord-board'
                  onClick={() => this.setModal('warning', 'Modifier')}
                  className={this.state.selected.toString()}
                  backgroundColor={this.state.selected?'#FFC107':'#FFD54F'}
                  icon={<i className='fa fa-edit lead' />}
    />,
    <RaisedButton key='del-ord-board'
                  onClick={() => this.setModal('danger', 'Supprimer')}
                  className={this.state.selected.toString()}
                  backgroundColor={this.state.selected?'#E91E63':'#F06292'}
                  icon={<i className='fa fa-trash lead' />}
    />
  ]

  dateFormater = cell => moment(cell).format('dddd DD MMMM YYYY, HH:mm')

  clientFormater = cId => {
    let {firstname, lastname, image} = getCollectionById(this.props.clients, cId)
    return <div className="clients-order">
      <Image src={image} width='36' height='36' alt='Image aperçu' className='image-preview radius-2 mr-1' />
      <span className="b dark-clr">{(firstname?firstname+' ':'') + (lastname||'')}</span>
    </div>
  }

  basketFormater = bId => {
    let {name} = getCollectionById(this.props.baskets, bId)
    switch (name) {
      case 'Familiale'  : return <RaisedButton label={name} primary={true} className='dis-btn formule-w' width='150' icon={<i className="fa fa-shopping-basket white-clr" />} />
      case 'Decouverte' : return <RaisedButton label={name} secondary={true} className='dis-btn formule-w' width='150' icon={<i className="fa fa-shopping-basket white-clr" />} />
      default           : return <RaisedButton label='Personalisé' className='dis-btn formule-w' width='150' icon={<i className="fa fa-shopping-basket dark-clr" />} />
    }
  }

  totalFormater = total => <span>{Number(total||0).toFixed(2)}<span className="ml-1">DH</span></span>

  statusFormater = status => {
    switch (status) {
      case 'open'   : return <RaisedButton label='Ouvert' backgroundColor='#4CAF50' className='dis-btn status-w' />
      case 'stock'  : return <RaisedButton label='Stock' backgroundColor='#FFEB3B' className='dis-btn status-w' />
      case 'payment': return <RaisedButton label='Payement' backgroundColor='#03A9F4' className='dis-btn status-w' />
      default       : return <RaisedButton label='Cloturé' backgroundColor='#9E9E9E' className='dis-btn status-w' />
    }
  }

  render() {
    const [ order,
            {orderHandler, basketFormater, statusFormater},
            {clients, products, baskets},
            {theme, action, isOpen, errorsFlag} ] = [{ ...this.state.order }, this, this.props, this.state]

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Toutes les commandes</h2>
            </div>
            <div className='fx fx-je fx-rev pt-3 ops-btns'>
              {this.getOrdersActions()}
            </div>
          </Row>
          <Row className='pt-5'>
            <BootstrapTable hover bordered={false}
                maxHeight='398'
                containerClass='main-table'
                trClassName='pointer tr-tdvertical'
                data={this.props.data}
                selectRow={selectRowProp(this.onSelectOrder)}
                pagination options={options} >
              <TableHeaderColumn dataField='_id' isKey hidden>#</TableHeaderColumn>
              <TableHeaderColumn dataField='created_at' dataFormat={this.dateFormater} dataSort={true}>Date</TableHeaderColumn>
              <TableHeaderColumn dataField='client_id' dataFormat={this.clientFormater} dataSort={true}>Client</TableHeaderColumn>
              <TableHeaderColumn dataField='basket_id' dataFormat={this.basketFormater}>Formule</TableHeaderColumn>
              <TableHeaderColumn dataField='total' dataFormat={this.totalFormater} width='130' tdStyle={{fontWeight:'bold',color:'#3e515b'}} headerAlign='center' dataAlign='right'>Total</TableHeaderColumn>
              <TableHeaderColumn dataField='status' dataFormat={this.statusFormater} width='180'>Status</TableHeaderColumn>
            </BootstrapTable>
          </Row>
        </Container>
        <Modal {...{isOpen}} toggle={() => this.setState({isOpen: false})} className={`modal-${theme}`}>
          <ModalHeader>{action} une commande</ModalHeader>
            <ModalBody>
              <form id='order-form' className='form-horizontal'>
                <OrderForm {...{order, clients, products, baskets, theme, orderHandler, basketFormater, statusFormater, errorsFlag}} />
              </form>
            </ModalBody>
            <ModalFooter>
              {this.getModalAction()}
              <Button color='secondary' onClick={() => this.setState({isOpen: false})}>
                <i className='fa fa-ban'></i> Annuler
              </Button>
            </ModalFooter>
        </Modal>
      </div>
    )
  }
}

const mapState = ({orders:{data}, clients:{data:clients}, products:{data:products}, baskets:{data:baskets}, bags:{data:bags}}, ownProps) => {
  ownProps = { ...ownProps, data, clients, products, baskets, bags }
  return ownProps
}

export default connect(mapState)(Orders)
