import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getOrders, getBaskets, getClients, getProducts, getBags} from 'store-man-client/redux/actions/api'
import {Container, Row, Col, Button} from 'reactstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Modal} from 'store-man-client/react/components/Notifications'
import {ButtonsControl} from 'store-man-client/react/components/Buttons'
import OrderForm from './OrderForm'
import {Image} from 'store-man-client/react/components/Media'
import RaisedButton from 'material-ui/RaisedButton'
import moment from 'moment'
import {getCollectionById} from 'store-man-helper/ext'
import {TableConf} from 'store-man-client/react/views/settings'
import CommonCycles from 'store-man-client/react/views/CommonCycles'

const DISPLAY = 'commande'

class Orders extends Component {

  static defaultProps = {
    data: [],
    dataArch: [],
    display: DISPLAY
  }

  componentWillMount() {
    this.props.dispatch(getOrders())
    this.props.dispatch(getBaskets())
    this.props.dispatch(getClients())
    this.props.dispatch(getProducts())
    this.props.dispatch(getBags())
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
      default       : return <RaisedButton label='Livré' backgroundColor='#9E9E9E' className='dis-btn status-w' />
    }
  }

  render() {
    const [
            {isOpen, theme, item, selected, isArch},
            {display, dispatch, data, dataArch, clients, products, baskets},
            {closeModal, openModal, resetSelection, basketFormater, statusFormater, toggleArc}
          ] = [this.state, this.props, this]
        , modalProps     = {isOpen, theme, display, modalWillClose:closeModal}
        , orderFormProps = {item, dispatch, resetSelection, basketFormater, statusFormater, clients, products, baskets}
        , {archived}      = item
        , buttonsControlProps = {display, archived, selected, openModal, toggleArc, isArch}

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Toutes les commandes</h2>
            </div>
            <ButtonsControl {...buttonsControlProps} />
          </Row>
          <Row className='pt-5'>
            <BootstrapTable hover bordered={false}
                ref='table'
                maxHeight='398'
                containerClass='main-table'
                trClassName='pointer tr-tdvertical'
                data={isArch?dataArch:data}
                selectRow={TableConf.selectRowProp(isArch,this.onSelectItem)}
                pagination options={TableConf.options('order')} >
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
  let dataArch = []
  data =  data.reduce( (data, item) => {
            item.archived
            ? dataArch.push(item)
            : data.push(item)
            return data
          }, [])
  ownProps = { ...ownProps, data, dataArch, clients, products, baskets }
  return ownProps
}

export default connect(mapState)(CommonCycles(Orders))
