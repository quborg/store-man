'use strinct'

var _       = require('lodash')
  , helper  = require('helper')



module.exports = {

  getAll: function(req, res, next) {
    req.models.basket.find(req.query, function(err, result){
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(helper.sortByDate(result, 'created_at', 'desc'));
    })
  },

  findOne: function(req, res, next) {
    req.models.basket.findById(req.params.id, function(err, result) {
      if (result === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(result)
    });
  },

  create: function(req, res, next) {
    let data = _.merge({}, req.body, req.params)
    req.models.basket.create(data, function(err, result) {
      if (err) res.status(err.status||500).json(err);
      res.status(201).json(result);
    });
  },

  update: function(req, res, next) {
    let id   = req.params.id
      , data = _.merge({}, req.body, req.params);

    if (!id) res.status(400).json({msg:'No id provided.'});
    delete data._id

    req.models.basket.findByIdAndUpdate(id, data, function(err, result) {
      if (result === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.json(result)
    });
  },

  destroy: function(req, res, next) {
    var id = req.params.id
    if (!id) res.status(400).json({msg:'No id provided.'});
    req.models.basket.findById(id, 'name', function (err, result) {
      if (err) res.status(err.status||500).json(err);
      if (result.name != 'Familiale' && result.name != 'Decouverte') {

        req.models.basket.findByIdAndRemove(id, req.body, function (err, item) {
          if (err) res.status(err.status||500).json(err);
          res.json(item);
        })
      }
    })
  }

}
