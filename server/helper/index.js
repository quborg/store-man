'use strinct'


var paths   = require('config/paths')
  , fs      = require('fs')
  // , mkdirp  = require('mkdirp')


/**
    saveImage, save image in local public file and returns the path
    @param {Object| String} image
    @param String folderName
    @return {String} image path
*/
function saveImage(image, folderName='unnamed') {
  if (image && typeof image !== 'string' && image.src && image.name) {
    let base64Data      = image.src.split('base64,')[1]
      , publicPath      = '/img/'+ folderName
      , imagePublicPath = publicPath +'/'+ image.name
      , fullPath        = paths.appPublic + publicPath
      , imageFullPath   = fullPath +'/'+ image.name

    // mkdirp(fullPath, function (f_err) {
    //   if (f_err) { console.log(err); return '' }

      fs.writeFile(imageFullPath, base64Data, 'base64', function(err) {
        console.log(err)
        return ''
      })
      return imagePublicPath
    // })
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