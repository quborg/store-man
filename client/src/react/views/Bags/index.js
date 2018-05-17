import React, { Component } from 'react';
import {connect} from 'react-redux'
import {getBags} from 'ayla-client/redux/actions/api'
import BagCard from './BagCard'
import BagForm from './BagForm'
import {Container, Row} from 'reactstrap'
import {Modal} from 'ayla-client/react/components/Notifications'
import {ButtonControl} from 'ayla-client/react/components/Buttons'
import {MSG} from 'ayla-client/react/views/settings'

const DISPLAY         = 'embalage'
    , CTL             = {
                          primary: { icon: 'plus',  title: `Ajouter un ${DISPLAY}`   },
                          warning: { icon: 'save',  title: `Modifier un ${DISPLAY}`  },
                          danger:  { icon: 'trash', title: `Supprimer un ${DISPLAY}` }
                        }


class Bags extends Component {

  static defaultProps = {
    data: []
  }

  state = {
    bag: {},
    selected: false,
    isOpen: false,
    theme: '',
    title: ''
  }

  componentWillMount() {
    this.props.dispatch(getBags())
  }

  onBagClick(bag, isTheSame=bag._id==this.state.bag._id) {
    isTheSame
    ? this.resetSelection()
    : this.setState({bag,     selected: true})
  }

  bagFormHandler(bag) {
    this.setState({bag})
  }

  resetSelection = () => {
    this.setState({bag: {}, selected: false})
  }

  openModal = (theme, title, isOpen=true) => {
    this.setState({ isOpen, theme, title })
  }

  closeModal = () => {
    this.setState({isOpen:false})
  }

  boardControls = selected =>
    Object.keys(CTL).map( theme => {
      let ctl = CTL[theme]
        , disabled = !selected && !ctl.title.match('^Ajouter')
      return <ButtonControl {...{disabled, theme, ...ctl}}
                            onClick={this.openModal}
                            key={`${ctl.icon}-${DISPLAY}-board`} />
    }
  )

  render() {
    const [
            {isOpen, theme, title, bag, selected},
            {data, dispatch},
            {closeModal, resetSelection}
          ] = [this.state, this.props, this]
        , modalProps  = {isOpen, theme, title, modalWillClose: closeModal}
        , bagProps    = {dispatch, bag, resetSelection}

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les embalages</h2>
            </div>
            <div className='fx fx-je fx-rev pt-3 ops-btns'>
              {this.boardControls(selected)}
            </div>
          </Row>
          <Row className={'pt-5 bag-history fx fx-wrap fx-' + (data.length>3 ?'jb':'ja')}>
            {
              data.length
              ? data.map((item, i) => <BagCard  key={'key-bag-card-'+item._id}
                                                    _class={(i+1)%4?'i-right':''}
                                                    {...{...item, selected: selected&&item._id==bag._id}}
                                                    onClick={() => this.onBagClick(item)} />)
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
