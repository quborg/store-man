import React, { Component } from 'react';
import {connect} from 'react-redux'
import {getBaskets} from 'ayla-client/redux/actions/api'
import BasketCard from './BasketCard'
import BasketForm from './BasketForm'
import {Container, Row} from 'reactstrap'
import {Modal} from 'ayla-client/react/components/Notifications'
import {ButtonControl} from 'ayla-client/react/components/Buttons'
import {getCollectionById, getCollectionByKeyValue} from 'ayla-helper/ext'


const DISPLAY         = 'panier'
    , NO_BASKET_MSG   = `Aucun ${DISPLAY} enregistré !`
    , CTL             = {
                          primary: { icon: 'plus',  title: `Ajouter un ${DISPLAY}`   },
                          warning: { icon: 'save',  title: `Modifier un ${DISPLAY}`  },
                          danger:  { icon: 'trash', title: `Supprimer un ${DISPLAY}` }
                        }


class Baskets extends Component {

  static defaultProps = {
    data: []
  }

  state = {
    basket: { price: 0 },
    selected: false,
    isOpen: false,
    theme: 'primary',
    title: `Ajouter un ${DISPLAY}`
  }

  componentWillMount() {
    this.props.dispatch(getBaskets())
  }

  onBagClick(basket, isTheSame=basket._id==this.state.basket._id) {
    isTheSame
    ? this.resetSelection()
    : this.setState({basket, selected: true})
  }

  basketFormHandler(basket) {
    this.setState({basket})
  }

  resetSelection = () => {
    this.setState({basket: {}, selected: false})
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
        , disabled = selected ? !ctl.title.match('^Modifier') : true
      return <ButtonControl {...{disabled, theme, ...ctl}}
                            onClick={this.openModal}
                            key={`${ctl.icon}-${DISPLAY}-board`} />
    }
  )

  render() {
    const [
            {isOpen, theme, title, basket, selected},
            {data, products, dispatch},
            {closeModal, resetSelection}
          ] = [this.state, this.props, this]
        , modalProps  = {isOpen, theme, title, modalWillClose: closeModal, noProgress: true}
        , basketProps = {dispatch, basket, products, resetSelection}

    return (
      <div className='animated fadeIn'>
        <Container>
          <Row className='fx fx-jb'>
            <div>
              <h2 className='flat-burn mb-0'>Tous les paniers</h2>
            </div>
            <div className='fx fx-je fx-rev pt-3 ops-btns'>
              {this.boardControls(selected)}
            </div>
          </Row>
          <Row className={'pt-5 basket-history fx fx-wrap fx-' + (data.length>3 ?'jb':'ja')}>
            {
              data.length
              ? data.map((item, i) => <BasketCard  key={'key-basket-card-'+item._id}
                                                    _class={(i+1)%4?'i-right':''}
                                                    {...{...item, selected: selected&&item._id==basket._id}}
                                                    onClick={() => this.onBagClick(item)} />)
              : NO_BASKET_MSG
            }
          </Row>
        </Container>
        <Modal {...modalProps}>
          <BasketForm {...basketProps} />
        </Modal>
      </div>
    )
  }

}

const mapState = ({baskets:{data}, products:{data:products}}, ownProps) => {
  if (data && data.length) {
    let basketFamily      = getCollectionByKeyValue(data, 'name', 'Familiale')
      , basketDecouverte  = getCollectionByKeyValue(data, 'name', 'Decouverte')
    data = [{...basketFamily}, {...basketDecouverte}]
  }
  data.map( (basket, b) => {
    if (basket && basket.products && basket.products.length)
      basket.products.map( (product, p) => {
        let {image, name, price} = getCollectionById(products, product._id)
        data[b].products[p] = {...product, image, name, price}
      })
  })

  ownProps =  { ...ownProps, data, products }
  return ownProps
}

export default connect(mapState)(Baskets)
