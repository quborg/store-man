import React from 'react'

const PREVIEW_IMG_SRC = '/img/empty-preview.png'
    , srcHandler      = src => src.src || src || PREVIEW_IMG_SRC



export const Image = ({src, ...props}) => <img src={srcHandler(src)} {...props} />

Image.defaultProps = {
  src: PREVIEW_IMG_SRC
}
