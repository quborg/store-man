import React, { Component } from 'react';
import  { Progress, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const THEME_OPS  =  {
                      primary: { label: 'Ajouter',     action: 'NEW', icon: 'plus'  },
                      warning: { label: 'Sauvegarder', action: 'PUT', icon: 'save'  },
                      danger:  { label: 'Supprimer',   action: 'DEL', icon: 'trash' },
                      icon: '', action: '', label: ''
                    }
    , INIT_MODAL =  { isOpen: false, theme: '', title: '', progress: 0, action: '', noProgress: false }


export default class CustomModal extends Component {

  static defaultProps = {
    modalWillClose: () => {}
  }

  state = INIT_MODAL

  initModal = () => {
    if (this.state.isOpen) this.props.modalWillClose()
    this.setState(INIT_MODAL)
  }

  componentWillReceiveProps({isOpen, theme, title, noProgress}) {
    this.setState({isOpen, theme, title, noProgress})
  }

  shouldComponentUpdate(nextProps, nextState) {
    let actionIsRevision = nextState.action === 'revision'
    return actionIsRevision ? false : true
  }

  getOp = (op, OPS=THEME_OPS[this.state.theme]) => OPS ? OPS[op] : ''

  setAction = (val) => {
    let op = 'action', OPS= THEME_OPS[this.state.theme]
    this.setState({ [op]: val||OPS[op] })
  }

  render() {
    const [{isOpen, title, theme, progress, action, noProgress}, {initModal, setAction}] = [this.state, this]

    return (
        <Modal isOpen={isOpen} toggle={() => this.initModal()} className={`modal-${theme}`}>
          <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              {
                React.cloneElement(
                  this.props.children,
                  {
                    action,
                    theme,
                    initModal,
                    setAction,
                    progress: p => this.setState({progress: p})
                  }
                )
              }
            </ModalBody>
            <ModalFooter>
              {
                !noProgress
                ? theme !== 'danger' && <Progress animated={progress!=100} value={progress} className="w-100">{`${progress>0?progress+'%':''}`}</Progress>
                : null
              }
              <Button color={theme} onClick={() => this.setAction()}>
                <i className={'fa fa-'+this.getOp('icon')}></i> {this.getOp('label')}
              </Button>
              <Button color="secondary" onClick={() => this.initModal()}>
                <i className='fa fa-ban'></i> Annuler
              </Button>
            </ModalFooter>
        </Modal>
    )
  }
}
