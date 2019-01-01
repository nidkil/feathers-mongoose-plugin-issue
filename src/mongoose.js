const mongoose = require('mongoose');

const mongooseOptions = {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true
};

module.exports = function (app) {
  const config = app.get('mongodb');
  mongoose.connect(config.connection, mongooseOptions);
  mongoose.Promise = global.Promise;

  mongoose.set('debug', config.debug);

  app.set('mongooseClient', mongoose);
};
