// Application hooks that run for every service
const log = require('./hooks/log');
const setUser = require('./hooks/set-user');

module.exports = {
  before: {
    all: [ log() ],
    find: [],
    get: [],
    create: [
      setUser('createdBy'),
      setUser('updatedBy')
    ],
    update: [
      setUser('updatedBy')
    ],
    patch: [
      setUser('updatedBy')
    ],
    remove: []
  },

  after: {
    all: [ log() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ log() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
