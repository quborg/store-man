import React, { Component } from 'react';
import {connect} from 'react-redux'
import {getBags} from 'ayla-client/redux/actions/api'
import BagCard from './BagCard'
import BagForm from './BagForm'
import {Container, Row} from 'reactstrap'
import {Modal} from 'ayla-client/react/components/Notifications'
import {ButtonsControl} from 'ayla-client/react/components/Buttons'
import {MSG} from 'ayla-client/react/views/settings'

const DISPLAY = 'embalage'


class Bags extends Component {

  static defaultProps = {
    data: []
  }

  state = {
    bag: {},
    selected: false,
    isOpen: false,
    theme: '',
    display: DISPLAY
  }

  componentWillMount() {
    this.props.dispatch(getBags())
  }

  onSelectBag(bag, isTheSame=bag._id==this.state.bag._id) {
    isTheSame
    ? this.resetSelection()
    : this.setState({bag, selected: true})
  }

  resetSelection  = () => {
    this.setState({ bag: {}, selected: false })
  }

  openModal       = theme => {
    this.setState({ isOpen: true, theme })
  }

  closeModal      = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const [
            {isOpen, theme, display, bag, selected},
            {data, dispatch},
            {closeModal, openModal, resetSelection}
          ] = [this.state, this.props, this]
        , modalProps  = {isOpen, theme, display, modalWillClose: closeModal}
        , bagProps    = {dispatch, bag, resetSelection}

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les embalages</h2>
            </div>
            <ButtonsControl {...{selected, openModal}} />
          </Row>
          <Row className='pt-5 items-history fx fx-wrap'>
            {
              data.length
              ? data.map((item, i) => <BagCard  key={'key-bag-card-'+item._id}
                                                    _class={(i+1)%4?'i-right':''}
                                                    {...{...item, selected: selected&&item._id==bag._id}}
                                                    onClick={() => this.onSelectBag(item)} />)
              : MSG.load.bag
            }
          </Row>
        </Container>
        <Modal {...modalProps}>
          <BagForm {...bagProps} />
        </Modal>
      </div>
    )
  }
}

const mapState = ({bags:{data}}, ownProps) => {
  ownProps = {...ownProps, data}
  return ownProps
}

export default connect(mapState)(Bags)
