'use strinct'

var _ = require('lodash')

module.exports = {

  getAll: function(req, res, next) {
    req.models.order.find(req.query, function(err, orders){
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(_.orderBy(orders, 'created_at', 'desc'));
    })
  },

  findOne: function(req, res, next) {
    req.models.order.findOne(req.params.id, function(err, order) {
      if (order === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(order);
    });
  },

  create: function(req, res, next) {
    req.models.order.create(req.body, function(err, order) {
      if (err) res.status(err.status||500).json(err);
      res.status(201).json(order);
    });
  },

  update: function(req, res, next) {
    var id       = req.params.id
      , criteria = _.merge({}, req.params, req.body);
    if (!id) res.status(400).json({msg:'No id provided.', err});
    req.models.order.update(id, criteria, function(err, order) {
      if (order === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.json(order);
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
