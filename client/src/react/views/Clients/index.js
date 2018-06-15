import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getClients} from 'store-man-client/redux/actions/api'
import {Container, Row, Col, Button} from 'reactstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Modal} from 'store-man-client/react/components/Notifications'
import {ButtonsControl} from 'store-man-client/react/components/Buttons'
import ClientForm from './ClientForm'
import {Image} from 'store-man-client/react/components/Media'
import moment from 'moment'
import {TableConf} from 'store-man-client/react/views/settings'
import CommonCycles from 'store-man-client/react/views/CommonCycles'

const DISPLAY = 'client'

class Clients extends Component {

  static defaultProps = {
    data: [],
    dataArch: [],
    display: DISPLAY
  }

  componentWillMount() {
    this.props.dispatch(getClients())
  }

  imageFormater = cell => <Image src={cell} width='30' height='30' alt='Image aperçu' className='image-preview radius-2' />

  dateFormater = cell => moment(cell).format('dddd DD MMMM, HH:mm')

  fullNameFormater = (cell, row) => (row.firstname +' '+ row.lastname).trim()

  render() {
    const [
            {isOpen, theme, item, selected, isArch},
            {display, dispatch, data, dataArch},
            {closeModal, openModal, resetSelection, toggleArc}
          ] = [this.state, this.props, this]
        , modalProps      = {isOpen, theme, display, modalWillClose:closeModal}
        , clientFormProps = {item, dispatch, resetSelection}
        , {archived}      = item
        , buttonsControlProps = {display, archived, selected, openModal, toggleArc, isArch}

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les clients</h2>
            </div>
            <ButtonsControl {...buttonsControlProps} />
          </Row>
          <Row className='pt-5'>
            <BootstrapTable hover bordered={false} condensed
                ref='table'
                maxHeight='398'
                containerClass='main-table'
                trClassName='pointer tr-tdvertical'
                data={isArch?dataArch:data}
                selectRow={TableConf.selectRowProp(isArch,this.onSelectItem)}
                pagination options={TableConf.options(DISPLAY)} >
              <TableHeaderColumn dataField='_id' isKey hidden>#</TableHeaderColumn>
              <TableHeaderColumn dataField='created_at' dataFormat={this.dateFormater} dataSort={true}>{'Date d\'ajout'}</TableHeaderColumn>
              <TableHeaderColumn dataField='image' dataFormat={this.imageFormater} thStyle={{width:'64px'}} tdStyle={{padding:'2px 16px', width:'64px'}}>Image</TableHeaderColumn>
              <TableHeaderColumn dataField='firstname' dataFormat={this.fullNameFormater} dataSort={true}>Nom Complet</TableHeaderColumn>
              <TableHeaderColumn dataField='phone'>Tél</TableHeaderColumn>
              <TableHeaderColumn dataField='adress'>Addresse</TableHeaderColumn>
              <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
            </BootstrapTable>
          </Row>
        </Container>
        <Modal {...modalProps}>
          <ClientForm {...clientFormProps} />
        </Modal>
      </div>
    )
  }
}

const mapState = ({clients:{data}}, ownProps) => {
  let dataArch = []
  data =  data.reduce( (data, item) => {
            item.archived
            ? dataArch.push(item)
            : data.push(item)
            return data
          }, [])
  ownProps = { ...ownProps, data, dataArch }
  return ownProps
}

export default connect(mapState)(CommonCycles(Clients))
