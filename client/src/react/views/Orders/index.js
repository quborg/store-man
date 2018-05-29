import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getOrders, getBaskets, getClients, getProducts, getBags} from 'ayla-client/redux/actions/api'
import {Container, Row, Col, Button} from 'reactstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Modal} from 'ayla-client/react/components/Notifications'
import {ButtonsControl} from 'ayla-client/react/components/Buttons'
import OrderForm from './OrderForm'
import {Image} from 'ayla-client/react/components/Media'
import RaisedButton from 'material-ui/RaisedButton'
import moment from 'moment'
import {getCollectionById} from 'ayla-helper/ext'
import {MSG} from 'ayla-client/react/views/settings'

const DISPLAY = 'order'

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
  noDataText: MSG.load.order
}

class Orders extends Component {

  state = {
    order: {},
    selected: false,
    isOpen: false,
    theme: '',
    display: DISPLAY
  }

  componentWillMount() {
    this.props.dispatch(getOrders())
    this.props.dispatch(getBaskets())
    this.props.dispatch(getClients())
    this.props.dispatch(getProducts())
    this.props.dispatch(getBags())
  }

  onSelectOrder = (order, selected) => {
    selected
    ? this.setState({order, selected})
    : this.setState({order: {}, selected})
  }

  resetSelection  = () => {
    this.setState({ product: {}, selected: false })
  }

  openModal  = (theme) => {
    this.setState({ isOpen: true, theme })
  }

  closeModal = () => {
    this.setState({isOpen:false})
  }

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
    const [
            {isOpen, theme, display, order, selected},
            {data, clients, products, baskets, dispatch},
            {closeModal, openModal, resetSelection, basketFormater, statusFormater}
          ] = [this.state, this.props, this]
        , modalProps     = {isOpen, theme, display, modalWillClose:closeModal}
        , orderFormProps = {order, clients, products, baskets, dispatch, resetSelection, basketFormater, statusFormater}

    return (
      <div className='animated slide'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Toutes les commandes</h2>
            </div>
            <ButtonsControl {...{selected, openModal}} />
          </Row>
          <Row className='pt-5'>
            <BootstrapTable hover bordered={false}
                maxHeight='398'
                containerClass='main-table'
                trClassName='pointer tr-tdvertical'
                {...{data}}
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
        <Modal {...modalProps}>
          <OrderForm {...orderFormProps} />
        </Modal>
      </div>
    )
  }
}

const mapState = ({orders:{data}, clients:{data:clients}, products:{data:products}, baskets:{data:baskets}}, ownProps) => {
  ownProps = { ...ownProps, data, clients, products, baskets }
  return ownProps
}

export default connect(mapState)(Orders)
