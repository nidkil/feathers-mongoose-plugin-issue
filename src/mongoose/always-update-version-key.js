// Mongoose only updates the version key when using save(). When using update(), findOneAndUpdate(), etc. Mongoose
// will not update the version key. This plugin provides a workaround to always update the version key.

function updateVersionKey () {
  const update = this.getUpdate();

  if (update.__v != null) {
    delete update.__v;
  }

  const keys = ['$set', '$setOnInsert'];

  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
}

module.exports =  function (schema) {

  schema.pre('findOneAndUpdate', function() {
    updateVersionKey.apply(this);
  });

  schema.pre('findByIdAndUpdate', function() {
    updateVersionKey.apply(this);
  });

  schema.pre('update', function() {
    updateVersionKey.apply(this);
  });

  schema.pre('updateMany', function() {
    updateVersionKey.apply(this);
  });

  schema.pre('updateOne', function() {
    updateVersionKey.apply(this);
  });

};
