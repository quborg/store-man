'use strict';

const path  = require('path')
    , fs    = require('fs')

    , appDirectory  = path.resolve(__dirname, '../../')
    , resolveApp    = relativePath => path.resolve(appDirectory, relativePath)



module.exports = {
  appStatic: resolveApp('static/html'),
  appPublic: resolveApp('client/public'),
  defaultImageURL: './img/empty-preview.png'
};
