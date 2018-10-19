// category-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const categoriesSchema = require('./schemas/categories.schema')();
  const mongooseClient = app.get('mongooseClient');

  return mongooseClient.model('category', categoriesSchema);
};
