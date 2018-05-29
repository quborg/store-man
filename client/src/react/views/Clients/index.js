import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getClients} from 'ayla-client/redux/actions/api'
import {Container, Row, Col, Button} from 'reactstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Modal} from 'ayla-client/react/components/Notifications'
import {ButtonsControl} from 'ayla-client/react/components/Buttons'
import ClientForm from './ClientForm'
import {Image} from 'ayla-client/react/components/Media'
import moment from 'moment'
import {MSG} from 'ayla-client/react/views/settings'

const DISPLAY = 'client'

const selectRowProp = (isArch, cb) => ({
  mode: 'radio',
  clickToSelect: true,
  bgColor: isArch ? '#AED581' : '#B2EBF2',
  onSelect: cb
})

const options = {
  sizePerPageList: [ 10, 100 ],
  sizePerPage: 10,
  sortName: 'created_at',
  sortOrder: 'desc',
  noDataText: MSG.load.client
}


class Clients extends Component {

  static defaultProps = {
    data: [],
    dataArch: []
  }

  state = {
    client: {},
    selected: false,
    isOpen: false,
    theme: '',
    display: DISPLAY,
    isArch: false,
  }

  componentWillMount() {
    this.props.dispatch(getClients())
  }

  onSelectClient = (client, selected) => {
    selected
    ? this.setState({client, selected})
    : this.setState({client: {}, selected})
  }

  resetSelection  = () => {
    this.refs.table.cleanSelected()
    this.setState({ client: {}, selected: false })
  }

  openModal  = (theme) => {
    this.setState({ isOpen: true, theme })
  }

  closeModal = () => {
    this.setState({ isOpen: false })
  }

  toggleArc = (e, isArch) => {
    this.setState({ isArch })
    this.resetSelection()
  }

  imageFormater = cell => <Image src={cell} width='30' height='30' alt='Image aperçu' className='image-preview radius-2' />

  dateFormater = cell => moment(cell).format('dddd DD MMMM, HH:mm')

  fullNameFormater = (cell, row) => (row.firstname +' '+ row.lastname).trim()

  render() {
    const [
            {isOpen, theme, display, client, selected, isArch},
            {dispatch, data, dataArch},
            {closeModal, openModal, resetSelection, toggleArc}
          ] = [this.state, this.props, this]
        , modalProps      = {isOpen, theme, display, modalWillClose:closeModal}
        , clientFormProps = {client, dispatch, resetSelection}
        , {archived}      = client

    return (
      <div className='animated fadeIn clients-view'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les clients</h2>
            </div>
            <ButtonsControl {...{archived, selected, openModal, toggleArc, isArch}} />
          </Row>
          <Row className='pt-5'>
            <BootstrapTable hover bordered={false} condensed
                ref='table'
                maxHeight='398'
                containerClass='main-table'
                trClassName='pointer'
                data={isArch?dataArch:data}
                selectRow={selectRowProp(isArch,this.onSelectClient)}
                pagination options={options} >
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

export default connect(mapState)(Clients)
