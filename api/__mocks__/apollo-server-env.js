import fetch from 'jest-fetch-mock';

import * as apolloDatasourceMocks from './apollo-datasource-mocks';

const apollo_server_env = require.requireActual('apollo-server-env');
const nodeFetch = require.requireActual('node-fetch');

const resolveWith = (data, url) =>
  Promise.resolve(
    new apollo_server_env.Response(JSON.stringify(data), {
      url,
      status: 200,
      statusText: 'OK',
      headers: new apollo_server_env.Headers({
        'Content-Type': 'application/json',
      }),
    })
  );

fetch.mockDataSourceApis = () => {
  fetch.mockImplementation((request) => {
    if (request.url.match('/api/v1/events/current')) {
      return resolveWith(apolloDatasourceMocks.liveStreamLive(), request.url);
    }
    return Promise.reject();
  });
};

const apollo_server_env_mocked = {
  ...apollo_server_env,
  fetch,
};

module.exports = apollo_server_env_mocked;
