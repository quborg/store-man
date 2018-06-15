'use strict'


var paths   = require('config/paths')
  , fs      = require('fs')


/**
    saveImage, save image in local public file and returns the path
    @param {Object| String} image
    @param String folderName
    @return {String} image path
*/
// TODO write a script to make folder if not exist
function saveImage(image, folderName='unnamed') {
  if (image && typeof image !== 'string' && image.src && image.name) {
    let base64Data      = image.src.split('base64,')[1]
      , publicPath      = '/img/'+ folderName
      , imagePublicPath = publicPath +'/'+ image.name
      , modePath        = process.env.NODE_ENV == 'production' ? paths.appStatic : paths.appPublic
      , imageFullPath   = modePath + publicPath +'/'+ image.name

    fs.writeFile(imageFullPath, base64Data, 'base64', function(err) {
      console.log(err)
    })

    return imagePublicPath
  }
  return image
}


/**
    sortBy, uses Array.prototype.sort
    @param Array arr
    @param String key
    @param String order
    @return sorted arr Array
*/
function sortByDate(arr, key, order) {
  switch (key) {
    case 'created_at':
      return arr.sort(function(obj1, obj2) {
        let date1 = new Date(obj1[key]).getTime()
          , date2 = new Date(obj2[key]).getTime()
          , resume = date1 - date2
        return  order == 'asc' ? resume : - resume
      })
      break;
    default: return;
  }
}

module.exports = {
  saveImage,
  sortByDate
}
