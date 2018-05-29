var mongoose    = require('mongoose')

  , OrderSchema = new mongoose.Schema({
                    client_id  : { type: String, required: true },
                    basket_id  : { type: String, required: true },
                    bags       : [{
                                    pid       : String,
                                    items     : [{
                                                  bid       : String,
                                                  quantity  : Number
                                                }]
                                 }],
                    total      : { type: Number, default: 0 },
                    status     : { type: String, default: 'open', enum: ['open','stock','payment','close'] },
                    archived   : { type: Boolean,default: false },
                    created_at : { type: Date, default: Date.now },
                    updated_at : { type: Date, default: Date.now }
                  })


module.exports = mongoose.model('Order', OrderSchema);
