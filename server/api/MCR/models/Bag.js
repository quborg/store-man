var mongoose   = require('mongoose')

  , UserSchema = mongoose.Schema({
      name: String,
      image: String,
      volume: Number,
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
    })
  ;

module.exports = mongoose.model('Bag', UserSchema)
