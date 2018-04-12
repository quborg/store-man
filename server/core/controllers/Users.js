'use strinct'

var _        = require('lodash')
  , passport = require('passport')


module.exports = {

  getAll: function(req, res, next) {
    req.models.user.find(req.query, function(err, users){
      if (err) res.status(err.status||500).json(err);
      res.status(200).json(_.orderBy(users, 'created_at', 'desc'));
    })
  },

  profile: (req, res, next) => {
    if (req.isAuthenticated())
      res.status(202).json({user:'miloudi'});
      res.status(202).json({user:req.user});
    res.status(401).json({msg:'Unauthorized ! Unauthenticated !!'});
  },

  findOne: function(req, res, next) {
    req.models.user.findOne(req.params._id, function(err, user) {
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
    var id       = req.params._id
      , criteria = _.merge({}, req.params, req.body);
    if (!id) res.status(400).json({msg:'No id provided.', err});
    req.models.user.update(id, criteria, function(err, user) {
      if (user === undefined) res.status(404).json(err);
      if (err) res.status(err.status||500).json(err);
      res.json(user);
    });
  },

  destroy: function(req, res, next) {
    var id = req.params._id
    if (!id) res.status(400).json({msg:'No id provided.', err});
    req.models.user.findByIdAndRemove(id, req.body, function (err, result) {
      if (err) res.status(err.status||500).json(err);
      res.json(result);
    });
  }

}
