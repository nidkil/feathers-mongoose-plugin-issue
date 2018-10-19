// categories.schemas.js - A mongoose schemas
//
// See http://mongoosejs.com/docs/schemas.html
// for more of what you can do here.
const { Schema } = require ('mongoose');
const alwaysUpdateVersionKey = require('../../mongoose/always-update-version-key');

module.exports = function () {
  const schemaVersion = '1.0';
  const categoriesSchema = new Schema({
    name: { type: String, i18n: true, required: true },
    description: { type: String, i18n: true, required: true },
    imageId: { type: Schema.Types.ObjectId, ref: 'images', required: false },
    order: { type: Number, default: 9999 },
    validFrom: { type: Date, required: false, default: null },
    validTo: { type: Date, required: false, default: null },
    active: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    version: { type: Schema.Types.Decimal128, required: true, default: schemaVersion }
  }, {
    timestamps: true
  });

  categoriesSchema.plugin(alwaysUpdateVersionKey);

  return categoriesSchema;
};
