var mongoose = require('mongoose')
  , passportLocalMongoose = require('passport-local-mongoose')
  , UserSchema = mongoose.Schema({
      username  : String,
      fullname  : String,
      email     : String,
      password  : String,
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
    })
  ;

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
