'use strict';

const path  = require('path')
    , fs    = require('fs')

    , appDirectory  = path.resolve(__dirname, '../../')
    , resolveApp    = relativePath => path.resolve(appDirectory, relativePath)



module.exports = {
  appBuild: resolveApp('client/build'),
  appPublic: resolveApp('client/public')
};
