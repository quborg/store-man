var mongoose   = require('mongoose')
  , paths      = require('config/paths')

  , UserSchema = mongoose.Schema({
      name      : { type: String, required: true                },
      image     : { type: String, default : paths.defaultImageURL  },
      price     : { type: Number, default : 0                   },
      created_at: { type: Date,   default : Date.now            },
      updated_at: { type: Date,   default : Date.now            }
    })
  ;

module.exports = mongoose.model('Product', UserSchema)
