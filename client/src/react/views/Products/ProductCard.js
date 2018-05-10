import React, {Component} from 'react'
import {Image} from 'ayla-client/react/components/Media'


export default class ProductCard extends Component {

  static defaultProps = {
    name: '',
    price: 0,
    image: {
      data: null,
      contentType: ''
    },
    selected: false
  }

  state = { image: '' }

  componentWillMount() {
    this.setState({image: this.props.image})
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.image.src)
      this.setState({image: nextProps.image})
  }

  render() {
    const [{name, price, selected, onClick, _class},{image}] = [this.props,this.state]

    return (
      <div {...{onClick}} className={`item-card mb-30 fx fx-ac pointer ${_class} ${selected?'selected':''}`} >
        <div className='img fx fx-jc fx-ac'>
          <Image src={image} />
        </div>
        <div className='txt pl-2'>
          <div className="fx fx-ac fx-jc h-75 w-100">
            <div className='wgt fx fx-ab'>
              <span className='nbr b font-3xl'>{price.toFixed(2)}</span>
              <span className='uty font-lg b text-uppercase pl-1'>DH</span>
            </div>
          </div>
          <div className='name fx fx-as fx-jc h-25 text-uppercase font-xs b'>
            {name}
          </div>
        </div>
      </div>
    )
  }

}
