var mongoose    = require('mongoose')

  , OrderSchema = new mongoose.Schema({
                    client_id   : String,
                    basket_type : { type: String, enum: ['family', 'discovery'] },
                    basket      : [{
                                    product_id  : String,
                                    price       : Number,
                                    quantity    : Number
                                  }],
                    total_price : { type: Number, default: 0 },
                    status      : { type: String, default: 'close', enum: ['open','pending','close'] },
                    created_at  : { type: Date, default: Date.now },
                    updated_at  : { type: Date, default: Date.now }
                  })


module.exports = mongoose.model('Order', OrderSchema);
