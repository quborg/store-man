var mongoose   = require('mongoose')
  , UserSchema = mongoose.Schema({
      firstname : String,
      lastname  : String,
      civility  : { type: String, enum: ['mr', 'mme', 'mlle'] },
      email     : String,
      phone     : String,
      nidc      : String,
      adress    : String,
      birdday   : { type: Date },
      city      : String,
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
    })
  ;

module.exports = mongoose.model('Client', UserSchema);
