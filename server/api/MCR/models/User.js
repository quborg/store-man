var mongoose = require('mongoose')
  , passportLocalMongoose = require('passport-local-mongoose')
  , UserSchema = mongoose.Schema({
      username  : { type: String, required: true },
      fullname  : { type: String, required: true },
      email     : { type: String, required: true },
      password  : { type: String, required: true },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
    })
  ;

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
