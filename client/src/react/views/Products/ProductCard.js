import React, {Component} from 'react'
import {Image} from 'ayla-client/react/components/Media'


export default class ProductCard extends Component {

  static defaultProps = {
    name: '',
    weight: 280,
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
    const [{name, weight, selected, onClick, _class},{image}] = [this.props,this.state]

    return (
      <div {...{onClick}} className={`product-card mb-30 fx fx-ac pointer ${_class} ${selected?'selected':''}`} >
        <div className='img fx fx-jc fx-ac'>
          <Image src={image} />
        </div>
        <div className='txt pl-2'>
          <div className="fx fx-ac fx-jc h-75 w-100">
            <div className='wgt fx fx-ab'>
              <span className='nbr b font-5xl'>{weight}</span>
              <span className='uty font-lg b text-uppercase pl-1'>Kg</span>
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
