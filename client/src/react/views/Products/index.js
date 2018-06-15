import React, { Component } from 'react';
import {connect} from 'react-redux'
import {getProducts} from 'store-man-client/redux/actions/api'
import ProductCard from './ProductCard'
import ProductForm from './ProductForm'
import {Container, Row} from 'reactstrap'
import {Modal} from 'store-man-client/react/components/Notifications'
import {ButtonsControl} from 'store-man-client/react/components/Buttons'
import {MSG} from 'store-man-client/react/views/settings'

const DISPLAY = 'produit'


class Products extends Component {

  static defaultProps = {
    data: []
  }

  state = {
    product: {},
    selected: false,
    isOpen: false,
    theme: '',
    display: DISPLAY
  }

  componentWillMount() {
    this.props.dispatch(getProducts())
  }

  onSelectProduct(product, isTheSame=product._id==this.state.product._id) {
    isTheSame
    ? this.resetSelection()
    : this.setState({product, selected: true})
  }

  resetSelection  = () => {
    this.setState({ product: {}, selected: false })
  }

  openModal       = theme => {
    this.setState({ isOpen: true, theme })
  }

  closeModal      = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const [
            {isOpen, theme, display, product, selected},
            {data, dispatch},
            {closeModal, openModal, resetSelection}
          ] = [this.state, this.props, this]
        , modalProps        = {isOpen, theme, display, modalWillClose:closeModal}
        , productFormProps  = {dispatch, product, resetSelection}

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les produits</h2>
            </div>
            <ButtonsControl {...{selected, openModal}} />
          </Row>
          <Row className='pt-5 items-history fx fx-wrap fx-ja'>
            {
              data.length
              ? data.map((item, i) => <ProductCard  key={'key-prod-card-'+item._id}
                                                    _class={(i+1)%4?'i-right':''}
                                                    {...{...item, selected: selected&&item._id==product._id}}
                                                    onClick={() => this.onSelectProduct(item)} />)
              : MSG.load.product
            }
          </Row>
        </Container>
        <Modal {...modalProps}>
          <ProductForm {...productFormProps} />
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
