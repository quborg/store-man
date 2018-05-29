import React, { Component } from 'react';
import  { Progress, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const THEME_OPS  =  {
                      primary   : { label: 'Ajouter',     action: 'NEW', icon: 'plus',        operation: 'Ajouter'           },
                      warning   : { label: 'Sauvegarder', action: 'PUT', icon: 'edit',        operation: 'Sauvegarder'       },
                      secondary : { label: 'Archiver',    action: 'ARC', icon: 'folder',      operation: 'Archiver'          },
                      success   : { label: 'Désarchiver', action: 'UNA', icon: 'folder-open', operation: 'Désarchiver'       },
                      danger    : { label: 'Supprimer',   action: 'DEL', icon: 'trash',       operation: 'Supprimer'         },
                      info      : { label: 'Info',        action: 'INF', icon: 'check',       operation: 'Fermer la fenêtre' },
                      icon: '', action: '', label: ''
                    }
    , INIT_MODAL =  { isOpen:false, theme:'', label:'', display:'', progress:0, action:'', noProgress:false }


export default class CustomModal extends Component {

  static defaultProps = {
    modalWillClose: () => {}
  }

  state = INIT_MODAL

  initModal = () => {
    if (this.state.isOpen) this.props.modalWillClose()
    this.setState(INIT_MODAL)
  }

  componentWillReceiveProps({isOpen, theme, display, noProgress}) {
    let {label} = THEME_OPS[theme] || THEME_OPS
    this.setState({isOpen, theme, label, display, noProgress})
  }

  shouldComponentUpdate(nextProps, nextState) {
    let actionIsRevision = nextState.action === 'REV'
      , actionIsInfo     = nextState.action === 'INF'
    actionIsInfo && this.initModal()
    return actionIsRevision ? false : true
  }

  getOp = (op, OPS=THEME_OPS[this.state.theme]) => OPS ? OPS[op] : ''

  setAction = (val) => {
    let op = 'action', OPS= THEME_OPS[this.state.theme]
    this.setState({ [op]: val||OPS[op] })
  }

  render() {
    const [
            {isOpen, label, display, theme, progress, action, noProgress},
            {initModal, setAction}
          ] = [this.state, this]
        , toInfo = theme == 'info'
        , toDel  = theme == 'danger'
        , toArch = theme == 'secondary'
        , toUnar = theme == 'success'

    return (
        <Modal isOpen={isOpen} toggle={() => this.initModal()} className={`modal-${theme}`}>
          <ModalHeader>{`${label} ${display}`}</ModalHeader>
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
                ? !toDel && !toInfo && !toArch && !toUnar &&
                    <Progress animated={progress!=100} value={progress} className="w-100">{`${progress>0?progress+'%':''}`}</Progress>
                : null
              }
              <Button color={theme} onClick={() => this.setAction()}>
                <i className={'fa fa-'+this.getOp('icon')}></i> {this.getOp('operation')}
              </Button>
              {
                !toInfo && <Button color="secondary" onClick={() => this.initModal()}>
                  <i className='fa fa-ban'></i> Annuler
                </Button>
              }
            </ModalFooter>
        </Modal>
    )
  }
}
