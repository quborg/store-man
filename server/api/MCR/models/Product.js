var mongoose   = require('mongoose')

  , UserSchema = mongoose.Schema({
      name:  String,
      image: String,
      price: { type: Number, default: 0 },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
    })
  ;

module.exports = mongoose.model('Product', UserSchema)
