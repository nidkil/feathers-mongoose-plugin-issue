// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { ObjectID } = require('mongodb');

module.exports = function (fieldName) {
  return context => {
    if (!context.data) return;
    context.data[fieldName] = ObjectID();
  };
};
