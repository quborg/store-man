'use strinct'

var _     = require('lodash')
  , help  = require('api/helper')



module.exports = {

  getAll: function(req, res, next) {
    req.models.order.find(req.query, function(err, result){
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(help.sortBy(result, 'created_at', 'desc'));
    })
  },

  findOne: function(req, res, next) {
    req.models.order.findById(req.params.id, function(err, result) {
      if (result === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(result)
    });
  },

  create: function(req, res, next) {
    req.models.order.create(req.body, function(err, result) {
      if (err) res.status(err.status||500).json(err);
      res.status(201).json(result);
    });
  },

  update: function(req, res, next) {
    let id   = req.params.id
      , data = _.merge({}, req.body);

    if (!id) res.status(400).json({msg:'No id provided.', err});
    delete data._id

    req.models.order.findByIdAndUpdate(id, data, function(err, result) {
      if (result === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.json(result)
    });
  },

  destroy: function(req, res, next) {
    var id = req.params.id
    if (!id) res.status(400).json({msg:'No id provided.', err});
    req.models.order.findByIdAndRemove(id, req.body, function (err, result) {
      if (err) res.status(err.status||500).json(err);
      res.json(result);
    });
  }

}
