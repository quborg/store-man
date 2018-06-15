import React, {Component} from 'react'
import {Image} from 'store-man-client/react/components/Media'


export default class BasketCard extends Component {

  static defaultProps = {
    name: '',
    products: [],
    total: 0,
    selected: false
  }

  render() {
    const {name, products, total, onClick, _class, selected} = this.props
    return (
      <div {...{onClick}} className={`item-card basket-card pointer ${_class} ${selected?'selected':''}`} >
        <div className='title b mb-3'>
          Panier {name}
        </div>
        <div className='list b'>
          {
            products.map( p =>  <div key={`product-card-item-${p._id}`} className='w-100 font-xs fx fx-ac fx-jb'>
                                  <span className='sm-inline-image fx fx-jc' style={{boxShadow:'0 0 0 1px #fff',overflow:'visible'}}>
                                    <Image src={p.image} alt='Image aperçu' className='sm-image-preview' />
                                  </span>
                                  <span className='p-name'>{p.name}</span>
                                  <span className='ml-auto text-shadow'>{p.quantity}KG</span>
                                </div>
            )
          }
        </div>
        <div className='footer b mt-3 text-right text-shadow'>
          Total = {total.toFixed(2)} DH
        </div>
      </div>
    )
  }

}
