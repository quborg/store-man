var mongoose   = require('mongoose')
  , notEmpty   = function(products) { return products.length > 0 ? true : false }

  , UserSchema = mongoose.Schema({
      name      : { type: String },
      products  : { type: [{
                            _id       : { type: String, required: true },
                            quantity  : { type: Number, default: 0 }
                          }],
                    required: true,
                    validate: [notEmpty, 'Please add at least one product in the basket'] },
      total     : { type: Number, default: 0 },
      created_at: { type: Date,   default: Date.now },
      updated_at: { type: Date,   default: Date.now }
    })
  ;


module.exports = mongoose.model('Basket', UserSchema)
