var mongoose   = require('mongoose')
  , UserSchema = mongoose.Schema({
      firstname : { type: String, required: true  },
      lastname  : { type: String, required: true  },
      civility  : { type: String, enum: ['mr', 'mme', 'mlle'] },
      image     : { type: String                  },
      email     : { type: String                  },
      phone     : { type: String, required: true  },
      nidc      : { type: String                  },
      adress    : { type: String, required: true  },
      birdday   : { type: String                  },
      city      : { type: String, required: true  },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
    })
  ;

module.exports = mongoose.model('Client', UserSchema);
