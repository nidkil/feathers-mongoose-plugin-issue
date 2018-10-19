const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../../src/app');
const { handlePromise } = require('../helpers.js');
const _ = require('lodash');

const testData = {
  name: 'Name',
  description: 'Description',
  order: 0,
  createdBy: mongoose.Types.ObjectId(),
  updatedBy: mongoose.Types.ObjectId()
};

describe('\'category\' service', () => {

  // Before starting the test, create a sandbox database connection
  before(function (done) {
    console.log('Database is initialized ...\n');
    done();
  });

  // After all tests are finished drop database and close connection
  after(function (done){
    console.log('Dropping database and closing connection ...\n');
    const connection = app.get('mongooseClient').connection;
    connection.dropDatabase(function () {
      connection.close();
      done();
    });
  });

  it('registered the service', (done) => {
    const service = app.service('category');
    expect(service).to.be.instanceOf(Object);
    done();
  });

  it('runs create', async function () {
    const result = await handlePromise(app.service('category').create(_.cloneDeep(testData)));
    if (result.success) {
      const category = result.payload;
      expect(category._id).to.be.a('object');
      expect(category).to.have.any.keys('name', 'description');
      expect(category.name).to.equal('Name');
      expect(category.description).to.equal('Description');
    } else {
      throw new Error(result.err);
    }
  });

  it('runs find', async function () {
    let result = await handlePromise(app.service('category').create(_.cloneDeep(testData)));

    if (!result.success) throw result.err;

    const category = result.payload;

    expect(category.name).to.equal(testData.name);
    expect(category.description).to.equal(testData.description);
    expect(category.order).to.equal(0);
    expect(category.__v).to.equal(0);

    result = await handlePromise(app.service('category').find({}));

    if (!result.success) throw result.err;

    const payload = result.payload;

    expect(payload.total).to.be.at.least(1);
  });

  it('runs update', async function() {
    const postFix = ' update';
    let result = await handlePromise(app.service('category').create(_.cloneDeep(testData)));

    if (!result.success) throw result.err;

    const category = result.payload;

    expect(category.name).to.equal(testData.name);
    expect(category.description).to.equal(testData.description);
    expect(category.order).to.equal(0);
    expect(category.__v).to.equal(0);

    let updatedTestData = _.merge(_.cloneDeep(category), {
      name: category.name + postFix,
      description: category.description + postFix,
      order: category.order + 1
    });

    result = await handlePromise(app.service('category').update(category._id, updatedTestData));

    if (!result.success) throw result.err;

    const updatedCategory = result.payload;

    expect(updatedCategory.name).to.equal(testData.name + postFix);
    expect(updatedCategory.description).to.equal(testData.description + postFix);
    expect(updatedCategory.order).to.equal(1);
    expect(updatedCategory.__v).to.equal(1);
  });

  it('runs patch', async function() {
    const postFix = ' patch';
    let result = await handlePromise(app.service('category').create(_.cloneDeep(testData)));

    if (!result.success) throw result.err;

    const category = result.payload;

    expect(category.name).to.equal(testData.name);
    expect(category.description).to.equal(testData.description);
    expect(category.order).to.equal(0);
    expect(category.__v).to.equal(0);

    let patchTestData = {
      name: category.name + postFix,
      description: category.description + postFix,
      order: category.order + 1
    };

    result = await handlePromise(app.service('category').patch(category._id, patchTestData));

    if (!result.success) throw result.err;

    const patchedCategory = result.payload;

    expect(patchedCategory.name).to.equal(testData.name + postFix);
    expect(patchedCategory.description).to.equal(testData.description + postFix);
    expect(patchedCategory.order).to.equal(1);
    expect(patchedCategory.__v).to.equal(1);
  });

});
