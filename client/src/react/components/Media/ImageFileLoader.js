import React, { Component } from 'react'
import {Input} from 'reactstrap'
import {Image, PREVIEW_IMG_SRC} from 'store-man-client/react/components/Media'
import ImageCompressor from 'image-compressor.js';

const options = {
  quality: .8,
  width: 200,
  height: 200,
  minWidth: 200,
  minHeight: 200,
  maxWidth: 200,
  maxHeight: 200
}


export default class ImageFileLoader extends Component {

  static defaultProps = {
    keyName: 'image',
    handler: () => {},
    progress: () => {},
    src: PREVIEW_IMG_SRC
  }

  imageHandler = e => {
    let file    = e.target.files ? e.target.files[0] : null
      , reader  = new FileReader()
      , image   = ''
      , self    = this
      , {keyName} = this.props

    if (file) {
      if (file.type.match('image\/(jpg|png|jpeg)')) {
        new ImageCompressor(file, {
          ...options,
          beforeDraw: (ctx, cvs) => {
            ctx.fillStyle = 'transparent'
            ctx.fillRect(0, 0, cvs.width, cvs.height)
          },
          success: result => {
            reader.readAsDataURL(result)
            reader.onload = e => {
              image = { src: reader.result, name: file.name }
              this.props.handler({ [keyName]: image })
              this.props.progress(100)
            }
          },
          error: err => {
            console.log('ERROR ImageCompressor() :', err)
            this.props.handler({ [keyName]: 'error-file-type' })
          },
        });
      }
      else { this.props.handler({ [keyName]: 'error-file-type' }) }
    } else {
      this.props.handler({ [keyName]: image })
    }
  }

  render() {
    let { src } = this.props

    return <div className='image-file-loader'>
      <Image src={src} width='75' height='75' alt='Image aperçu' className='image-preview' />
      <Input type='file' accept='image\/(jpg|png|jpeg)' name='image' defaultValue={src} onChange={this.imageHandler} />
    </div>
  }

}
