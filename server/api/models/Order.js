var mongoose = require('mongoose');

function getPrice(num) { return (num/100).toFixed(2); }

function setPrice(num) { return num*100; }

var OrderSchema = new mongoose.Schema({
  user_email: String,
  hotel_id  : Number,
  airport_id: {
    id : Number,
    start_date: { type: Date },
    last_date : { type: Date },
    childs    : {
      numberOf  : Number,
      grown_ups : Number,
      ages      : []
    },
    transport : String,
    boarding  : String,
    transfer  : String,
    room_type : String
  },
  offers : [{
    internet: {
      price       : { type: Number, get: getPrice, set: setPrice },
      flight      : Boolean,
      baggage     : Boolean,
      transfer    : Boolean,
      date_from   : { type: Date },
      date_to     : { type: Date },
      boarding    : String,
      room_type   : String,
      link        : String
    },
    special : [{
      price       : { type: Number, get: getPrice, set: setPrice },
      flight      : Boolean,
      baggage     : Boolean,
      transfer    : Boolean,
      date_from   : { type: Date },
      date_to     : { type: Date },
      boarding    : String,
      room_type   : String,
      hotel_url   : String,
      flight_url  : String
    }]
  }],
  push_notifications: { type: Number, default: 0 },
  status    : { type: String, default: 'open' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
