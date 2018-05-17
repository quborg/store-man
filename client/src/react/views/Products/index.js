import React, { Component } from 'react';
import {connect} from 'react-redux'
import {getProducts} from 'ayla-client/redux/actions/api'
import ProductCard from './ProductCard'
import ProductForm from './ProductForm'
import {Container, Row} from 'reactstrap'
import {Modal} from 'ayla-client/react/components/Notifications'
import {ButtonControl} from 'ayla-client/react/components/Buttons'
import {MSG} from 'ayla-client/react/views/settings'


const DISPLAY         = 'product'
    , CTL             = {
                          primary: { icon: 'plus',  title: `Ajouter un ${DISPLAY}`   },
                          warning: { icon: 'save',  title: `Modifier un ${DISPLAY}`  },
                          danger:  { icon: 'trash', title: `Supprimer un ${DISPLAY}` }
                        }


class Products extends Component {

  static defaultProps = {
    data: []
  }

  state = {
    product: {},
    selected: false,
    isOpen: false,
    theme: '',
    title: ''
  }

  componentWillMount() {
    this.props.dispatch(getProducts())
  }

  onProductClick(product, isTheSame=product._id==this.state.product._id) {
    isTheSame
    ? this.resetSelection()
    : this.setState({product, selected: true})
  }

  productFormHandler(product) {
    this.setState({product})
  }

  resetSelection = () => {
    this.setState({product: {}, selected: false})
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
            {isOpen, theme, title, product, selected},
            {data, dispatch},
            {closeModal, resetSelection}
          ] = [this.state, this.props, this]
        , modalProps    = {isOpen, theme, title, modalWillClose: closeModal}
        , productProps  = {dispatch, product, resetSelection}

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les produits</h2>
            </div>
            <div className='fx fx-je fx-rev pt-3 ops-btns'>
              {this.boardControls(selected)}
            </div>
          </Row>
          <Row className={'pt-5 product-history fx fx-wrap fx-' + (data.length>3 ?'jb':'ja')}>
            {
              data.length
              ? data.map((item, i) => <ProductCard  key={'key-prod-card-'+item._id}
                                                    _class={(i+1)%4?'i-right':''}
                                                    {...{...item, selected: selected&&item._id==product._id}}
                                                    onClick={() => this.onProductClick(item)} />)
              : MSG.load.product
            }
          </Row>
        </Container>
        <Modal {...modalProps}>
          <ProductForm {...productProps} />
        </Modal>
      </div>
    )
  }
}

const mapState = ({products:{data}}, ownProps) => {
  ownProps = {...ownProps, data}
  return ownProps
}

export default connect(mapState)(Products)
