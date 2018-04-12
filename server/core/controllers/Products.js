'use strinct'

var _ = require('lodash')

module.exports = {

  getAll: function(req, res, next) {
    req.models.product.find(req.query, function(err, result){
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(_.orderBy(result, 'created_at', 'desc'));
    })
  },

  findOne: function(req, res, next) {
    req.models.product.findOne(req.params.id, function(err, result) {
      if (result === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(result);
    });
  },

  create: function(req, res, next) {
    req.models.product.create(req.body, function(err, result) {
      if (err) res.status(err.status||500).json(err);
      res.status(201).json(result);
    });
  },

  update: function(req, res, next) {
    var id       = req.params.id
      , criteria = _.merge({}, req.params, req.body);
    if (!id) res.status(400).json({msg:'No id provided.', err});
    req.models.product.update(id, criteria, function(err, result) {
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
