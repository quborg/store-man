var mongoose    = require('mongoose')

  , OrderSchema = new mongoose.Schema({
                    client_id  : String,
                    basket_id  : String,
                    total      : { type: Number, default: 0 },
                    status     : { type: String, default: 'open', enum: ['open','stock','payment','close'] },
                    created_at : { type: Date, default: Date.now },
                    updated_at : { type: Date, default: Date.now }
                  })


module.exports = mongoose.model('Order', OrderSchema);
