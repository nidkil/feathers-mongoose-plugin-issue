/* eslint-disable no-console */
const mongoose = require('mongoose');
const { expect } = require('chai');
const _ = require('lodash');
const categoriesSchema = require('../../src/models/schemas/categories.schema')();

const mongooseOptions = {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true
};

mongoose.model('Categories', categoriesSchema);

const testData = {
  name: 'Name',
  description: 'Description',
  order: 0,
  createdBy: mongoose.Types.ObjectId(),
  updatedBy: mongoose.Types.ObjectId()
};

describe('Database Tests', function() {

  // Before starting the test, create a sandbox database connection
  before(function (done) {
    console.log('Initializing database ...');
    mongoose.connect('mongodb://localhost:27017/test-database', mongooseOptions);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      // Once a connection is established invoke done()
      console.log('Connected to the test database\n');
      done();
    });
  });

  // After all tests are finished drop database and close connection
  after(function(done){
    console.log('Dropping database and closing connection ...\n');
    mongoose.connection.db.dropDatabase(function () {
      mongoose.connection.close(done);
    });
  });

  describe('Test schema with always-update-version-key plugin', function () {

    it('should create document', async function () {
      const Categories = mongoose.model('Categories');
      const test = new Categories(_.cloneDeep(testData));
      const result = await test.save();
      const doc = result._doc;

      expect(doc.name).to.equal(testData.name);
      expect(doc.description).to.equal(testData.description);
      expect(doc.order).to.equal(0);
      expect(doc.__v).to.equal(0);
    });

    describe('common base document', function () {

      let id = null;
      let category = null;
      // Return Plain JavaScript Objects (PJOs) instead of MongooseDocuments
      const lean = true;
      const options = {
        lean
      };

      before(async function () {
        const Categories = mongoose.model('Categories');
        const test = new Categories(_.cloneDeep(testData));
        let result = await test.save();
        category = result._doc;
        id = category._id;
      });

      after(async function () {
        const Categories = mongoose.model('Categories');
        await Categories.findByIdAndDelete(id);
      });

      it('should update document using findOneAndUpdate', async function () {
        const postFix = ' findOneAndUpdate';
        const Categories = mongoose.model('Categories');
        await Categories.findOneAndUpdate(
          { _id: id },
          { name: testData.name + postFix, description: testData.description + postFix, order: 1 },
          options
        );
        const result = await Categories.find({ _id: id });
        const doc = result[0]._doc;

        expect(doc.name).to.equal(testData.name + postFix);
        expect(doc.description).to.equal(testData.description + postFix);
        expect(doc.order).to.equal(1);
        expect(doc.__v).to.equal(1);
      });

      it('should update using findByIdAndUpdate', async () => {
        const postFix = ' findByIdAndUpdate';
        const Categories = mongoose.model('Categories');
        const patchTestData = {
          name: testData.name + postFix,
          description: testData.description + postFix,
          order: 1
        };
        const result = await Categories.findByIdAndUpdate(
          id,
          { $set: patchTestData },
          Object.assign({}, { new: true }, options)
        );
        const doc = lean ? result : result._doc;

        expect(doc.name).to.equal(testData.name + postFix);
        expect(doc.description).to.equal(testData.description + postFix);
        expect(doc.order).to.equal(1);
        expect(doc.__v).to.equal(2);
      });

      it('should update document using update', async () => {
        const postFix = ' update';
        const Categories = mongoose.model('Categories');

        await Categories.update(
          { _id: id },
          { name: testData.name + postFix, description: testData.description + postFix, order: 1 },
          options
        );

        const result = await Categories.findById(id);
        const doc = result._doc;

        expect(doc.name).to.equal(testData.name + postFix);
        expect(doc.description).to.equal(testData.description + postFix);
        expect(doc.order).to.equal(1);
        expect(doc.__v).to.equal(3);
      });

      it('should update document using updateMany', async () => {
        const postFix = ' findOneAndUpdate';
        const Categories = mongoose.model('Categories');

        await Categories.updateMany(
          { _id: id },
          { name: testData.name + postFix, description: testData.description + postFix, order: 1 });

        const result = await Categories.findById(id);
        const doc = result._doc;

        expect(doc.name).to.equal(testData.name + postFix);
        expect(doc.description).to.equal(testData.description + postFix);
        expect(doc.order).to.equal(1);
        expect(doc.__v).to.equal(4);
      });

      it('should update document using updateOne', async () => {
        const postFix = ' findOneAndUpdate';
        const Categories = mongoose.model('Categories');

        await Categories.updateOne(
          { _id: id },
          { name: testData.name + postFix, description: testData.description + postFix, order: 1 },
          options
        );

        const result = await Categories.findById(id);
        const doc = result._doc;

        expect(doc.name).to.equal(testData.name + postFix);
        expect(doc.description).to.equal(testData.description + postFix);
        expect(doc.order).to.equal(1);
        expect(doc.__v).to.equal(5);
      });

    });

  });

});
