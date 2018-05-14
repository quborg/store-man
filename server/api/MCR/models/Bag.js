var mongoose   = require('mongoose')

  , UserSchema = mongoose.Schema({
      name      : { type: String, required: true    },
      image     : { type: String, required: true    },
      volume    : { type: Number, default: 0        },
      created_at: { type: Date,   default: Date.now },
      updated_at: { type: Date,   default: Date.now }
    })
  ;

module.exports = mongoose.model('Bag', UserSchema)
