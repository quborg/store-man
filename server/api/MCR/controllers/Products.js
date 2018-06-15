'use strict'

var _       = require('lodash')
  , helper  = require('helper')



module.exports = {

  getAll: function(req, res, next) {
    req.models.product.find(req.query, function(err, result){
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(helper.sortByDate(result, 'created_at', 'desc'))
    })
  },

  findOne: function(req, res, next) {
    req.models.product.findById(req.params.id, function(err, result) {
      if (result === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(result)
    });
  },

  create: function(req, res, next) {
    let body  = _.merge({}, req.body);
    body.image = helper.saveImage(body.image, 'products');
    req.models.product.create(body, function(err, result) {
      if (err) res.status(err.status||500).json(err);
      res.status(201).json(result)
    })
  },

  update: function(req, res, next) {
    let id    = req.params.id
      , body  = _.merge({}, req.body);

    if (!id) res.status(400).json({msg:'No id provided.'});
    if (body.image) body.image = helper.saveImage(body.image, 'products');
    delete body._id;

    req.models.product.findByIdAndUpdate(id, body, function(err, result) {
      if (result === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.json(result)
    });
  },

  destroy: function(req, res, next) {
    var id = req.params.id
    if (!id) res.status(400).json({msg:'No id provided.'});
    req.models.product.findByIdAndRemove(id, req.body, function (err, result) {
      if (err) res.status(err.status||500).json(err);
      res.json(result)
    })
  }

}
