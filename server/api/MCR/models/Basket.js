var mongoose   = require('mongoose')
  , notEmpty   = function(products) { return products.length > 0 }

  , UserSchema = mongoose.Schema({
      name      : { type: String },
      products  : { type: [{
                            _id       : { type: String, required: true },
                            quantity  : { type: Number, default: 0 }
                          }]
                    // validate: [notEmpty, 'Please add at least one product in the basket']
                  },
      total     : { type: Number, default: 0 },
      archived  : { type: Boolean,default : false },
      created_at: { type: Date,   default: Date.now },
      updated_at: { type: Date,   default: Date.now }
    })
  ;


module.exports = mongoose.model('Basket', UserSchema)
