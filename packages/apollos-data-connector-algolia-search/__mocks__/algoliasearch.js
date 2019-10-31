// "Borrowed" from https://github.com/CocoaPods/indexer.cocoapods.org/blob/master/__mocks__/algoliasearch.js
// mock of algoliasearch, doesn't actually index to Algolia
import { createGlobalId } from '@apollosproject/server-core';

const indexes = {};

function initIndex(indexName, props) {
  if (!indexes[indexName]) {
    const _props = {
      exists: Boolean(props),
      records: {},
      rules: {},
      ...props,
    };
    console.debug(`created index ${indexName} with props`, _props);
    indexes[indexName] = {
      _props,
      addObjects: (records, cb) => {
        _props.exists = true;
        records.forEach((record) => (_props.records[record.objectID] = record));
        cb();
      },
      clearIndex: jest.fn((cb) => {
        cb();
      }),
      search: jest.fn(() =>
        Promise.resolve({
          hits: [
            {
              title: 'test result',
              summary: 'test summary',
              coverImage: { sources: [{ uri: '#' }] },
              id: createGlobalId('test-id', 'ContentItem'),
            },
          ],
        })
      ),
    };
  }
  return indexes[indexName];
}

const algoliasearch = (/* appId, apiKey */) => ({
  // implemented mocks
  initIndex,
  listIndexes: () =>
    Promise.resolve({
      items: Object.keys(indexes).map((indexName) => ({ name: indexName })),
    }),
  deleteIndex: (objectID) => {
    delete indexes[objectID];
    return Promise.resolve({});
  },
  copyIndex: (sourceIdxName, destIdxName, scopes) => {
    console.debug(
      `copyIndex ${sourceIdxName} -> ${destIdxName} with scopes`,
      scopes
    );
    const props = !scopes
      ? { ...indexes[sourceIdxName]._props }
      : scopes.reduce(
          // copy only the properties listed in scopes
          (propsObj, scope) => ({
            ...propsObj,
            [scope]: { ...indexes[sourceIdxName]._props[scope] },
          }),
          {}
        );
    if (indexes[destIdxName]) {
      indexes[destIdxName]._props = { ...indexes[destIdxName]._props, props };
    } else {
      indexes[destIdxName] = initIndex(destIdxName, props);
    }
    indexes[destIdxName]._props.exists = true;
    return Promise.resolve({});
  },
  moveIndex: (sourceIdxName, destIdxName) => {
    console.debug(`moveIndex ${sourceIdxName} -> ${destIdxName}`);
    if (indexes[destIdxName]) {
      indexes[destIdxName]._props.records = {
        ...indexes[sourceIdxName]._props.records,
      };
    } else {
      indexes[destIdxName] = initIndex(destIdxName, {
        ...indexes[sourceIdxName]._props,
      });
    }
    indexes[destIdxName]._props.exists = true;
    delete indexes[sourceIdxName];
    return Promise.resolve({});
  },
  // other methods used
  addAlgoliaAgent: jest.fn(() => Promise.resolve({})),
  // methods that are not yet used
  /*
  clearIndex: jest.fn(() => Promise.resolve({})),
  addApiKey: jest.fn(() => Promise.resolve({})),
  assignUserID: jest.fn(() => Promise.resolve({})),
  batch: jest.fn(() => Promise.resolve({})),
  deleteApiKey: jest.fn(() => Promise.resolve({})),
  getApiKey: jest.fn(() => Promise.resolve({})),
  getLogs: jest.fn(() => Promise.resolve({})),
  getTopUserID: jest.fn(() => Promise.resolve({})),
  getUserID: jest.fn(() => Promise.resolve({})),
  index: jest.fn(() => Promise.resolve({})),
  listApiKeys: jest.fn(() => Promise.resolve({})),
  listClusters: jest.fn(() => Promise.resolve({})),
  listUserIDs: jest.fn(() => Promise.resolve({})),
  removeUserID: jest.fn(() => Promise.resolve({})),
  search: jest.fn(() => Promise.resolve({})),
  searchUserIDs: jest.fn(() => Promise.resolve({})),
  updateApiKey: jest.fn(() => Promise.resolve({})),
  */
});

module.exports = algoliasearch;
