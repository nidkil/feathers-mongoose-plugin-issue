const category = require('./category/category.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(category);
};
