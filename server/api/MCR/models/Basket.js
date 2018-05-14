var mongoose   = require('mongoose')

  , UserSchema = mongoose.Schema({
      name      : { type: String, required: true },
      products  : { type: [{
                            _id       : { type: String, required: true },
                            quantity  : { type: Number, default: 0 }
                          }],     required: true    },
      total     : { type: Number, default: 0 },
      created_at: { type: Date,   default: Date.now },
      updated_at: { type: Date,   default: Date.now }
    })
  ;

module.exports = mongoose.model('Basket', UserSchema)
