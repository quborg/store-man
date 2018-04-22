'use strinct'


var paths = require('config/paths')
  , fs    = require('fs')

/**
    saveProductImage, save image in local public file and returns the path
    @param {Object| String} image
    @return image path
*/
function saveProductImage(image) {
  if (image && image.src && image.name) {
    let base64Data     = image.src.split('base64,')[1]
      , imageWebPath   = '/img/products/'+ image.name
      , imageLocalPath = paths.appPublic + imageWebPath
    fs.writeFile(imageLocalPath, base64Data, 'base64', function(err) {
      console.log(err)
    })
    return imageWebPath
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
function sortBy(arr, key, order) {
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
  saveProductImage,
  sortBy
}
