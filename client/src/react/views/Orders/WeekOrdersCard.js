import React, {Component} from 'react'
import {Image} from 'ayla-client/react/components/Media'


export default class WeekOrdersCard extends Component {

  render() {
    const { _id:pid, totalQuantity, name, image, _class, tags } = this.props

    return (
      <div className={`item-card mb-30 fx fx-ac ${_class}`}>
        <div className='img fx fx-jc fx-ac'>
          <Image src={image} />
        </div>
        <div className='txt pl-2'>
          <div className="fx fx-ac fx-col h-100">
            <div className='h-75 pt-2'>
              <span className='nbr b font-3xl'>{totalQuantity}</span>
              <span className='uty font-lg b text-uppercase pl-1'>KG</span>
            </div>
            <div className='name text-uppercase font-xs b h-25 mt-auto'>
              {name}
            </div>
          </div>
            {
              // <div className='fx fx-ac fx-jc w-100'>
              // tags && tags.length
              // ? tags.map( ({bid, image, quantity}) => <span key={`tag-${pid}-${bid}`}>
              //     {quantity}<Image src={image} width='30'/>
              //   </span>)
              // : null
              // </div>
            }
        </div>
      </div>
    )
  }

}
