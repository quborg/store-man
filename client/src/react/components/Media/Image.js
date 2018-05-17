import React from 'react'

export const PREVIEW_IMG_SRC = '/img/empty-preview.png'

const srcHandler      = src =>  src
                                ? src==='error-file-type'
                                  ? PREVIEW_IMG_SRC
                                  : src.src||src
                                : PREVIEW_IMG_SRC



export const Image = ({src, ...props}) => <img src={decodeURIComponent(srcHandler(src))} {...props} />
