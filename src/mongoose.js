const mongoose = require('mongoose');
const logger = require('./logger');

const mongooseOptions = {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true
};

function serializer(data, compact = true) {
  if (compact) {
    const query = JSON.stringify(data.query);
    const doc = JSON.stringify(data.doc);
    const options = JSON.stringify(data.options);
    return `db.${data.coll}.${data.method}(${query}, ${doc}, ${options});`;
  } else {
    const query = JSON.stringify(data.query, null, '\t');
    const doc = JSON.stringify(data.doc, null, '\t');
    const options = JSON.stringify(data.options || {}, null, '\t');
    return `db.${data.coll}.${data.method}(${query}, ${doc}, ${options});`;
  }
}

module.exports = function (app) {
  const config = app.get('mongodb');
  mongoose.connect(config.connection, mongooseOptions);
  mongoose.Promise = global.Promise;

  if (config.debug.enabled) {
    const compact = config.debug.compact;
    mongoose.set('debug', function (coll, method, query, doc, options) {
      let data = {
        coll,
        method,
        query,
        doc,
        options
      };
      logger.info('Mongoose: ' + serializer(data, compact) + (compact ? '\n' : ''));
    });
  }

  app.set('mongooseClient', mongoose);
};
