var mongoose = require('mongoose')
  , passportLocalMongoose = require('passport-local-mongoose')

  , UserSchema = mongoose.Schema({
      username  : { type: String, required: true, unique: true, trim: true },
      fullname  : { type: String, required: true, trim: true },
      email     : { type: String, required: true, trim: true },
      password  : { type: String                  },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
    })
  ;

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
