'use strinct'

var _         = require('lodash')
  , passport  = require('passport')
  , helper    = require('helper')


module.exports = {

  getAll: function(req, res, next) {
    req.models.user.find(req.query, function(err, users){
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(helper.sortByDate(result, 'created_at', 'desc'));
    })
  },

  profile: (req, res, next) => {
    if (req.isAuthenticated())
      res.status(202).json({user:'miloudi'});
      res.status(202).json({user:req.user});
    res.status(401).json({msg:'Unauthorized ! Unauthenticated !!'});
  },

  findOne: function(req, res, next) {
    req.models.user.findById(req.params.id, function(err, user) {
      if (user === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(user);
    });
  },

  create: function(req, res, next) {
    const userLabels = { username: req.body.username, fullname: req.body.fullname, email: req.body.email };
    req.models.user.register(new req.models.user(userLabels), req.body.password, function(err, user) {
      if (err) res.status(409).json(err);
      passport.authenticate('local')(req, res, function(){
        req.session.save(function (err) {
          if (err) res.status(err.status||500).json(err);
          res.status(201).json(user);
        });
      });
    })
  },

  login: function(req, res, next) {
    req.session.save(function (err) {
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(req.user);
    });
  },

  logout: function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
      if (err) res.status(err.status||500).json(err);
      res.status(201).json(req.user);
    });
  },

  update: function(req, res, next) {
    var id       = req.params.id
      , criteria = _.merge({}, req.body);
    if (!id) res.status(400).json({msg:'No id provided.'});
    delete criteria._id
    req.models.user.findByIdAndUpdate(id, criteria, function(err, user) {
      if (user === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.json(user);
    });
  },

  destroy: function(req, res, next) {
    var id = req.params.id
    if (!id) res.status(400).json({msg:'No id provided.'});
    req.models.user.findByIdAndRemove(id, req.body, function (err, result) {
      if (err) res.status(err.status||500).json(err);
      res.json(result);
    });
  }

}
