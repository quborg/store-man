var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = db_url => {

  mongoose.connect(db_url)
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));

}
