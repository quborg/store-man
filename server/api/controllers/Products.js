'use strinct'

var _     = require('lodash')
  , fs    = require('fs')
  , paths = require('config/paths')

/**
    saveProductImage, save image in local public file and returns the path
    @param {Object| String} image
    @return image path
*/
function saveProductImage(image) {
  if (image.src && image.name) {
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


module.exports = {

  getAll: function(req, res, next) {
    req.models.product.find(req.query, function(err, result){
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(_.orderBy(result, 'created_at', 'desc'));
    })
  },

  findOne: function(req, res, next) {
    req.models.product.findById(req.params.id, function(err, result) {
      if (result === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(result);
    });
  },

  create: function(req, res, next) {
    let data  = _.merge({}, req.body);

    data.image = saveProductImage(data.image)
    req.models.product.create(data, function(err, result) {
      if (err) res.status(err.status||500).json(err);
      res.status(201).json(result)
    })
  },

  update: function(req, res, next) {
    let id    = req.params.id
      , data  = _.merge({}, req.body);

    if (!id) res.status(400).json({msg:'No id provided.', err});
    data.image = saveProductImage(data.image)
    delete data._id
    console.log('put -----> ',id, data)
    req.models.product.findByIdAndUpdate(id, data, function(err, result) {
      if (result === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.json(result);
    });
  },

  destroy: function(req, res, next) {
    var id = req.params.id
    if (!id) res.status(400).json({msg:'No id provided.', err});
    req.models.product.findByIdAndRemove(id, req.body, function (err, result) {
      if (err) res.status(err.status||500).json(err);
      res.json(result);
    });
  }

}
