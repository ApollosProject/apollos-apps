import fetch from 'jest-fetch-mock';

import * as apolloDatasourceMocks from './apollo-datasource-mocks';

const apolloServerEnv = require.requireActual('apollo-server-env');

// eslint-disable-next-line
const Response = apolloServerEnv.Response;

const resolveWith = (data, url) =>
  Promise.resolve(
    new Response(JSON.stringify(data), {
      url,
      status: 200,
      statusText: 'OK',
      headers: new apolloServerEnv.Headers({
        'Content-Type': 'application/json',
      }),
    })
  );

fetch.mockLiveDataSourceApis = () => {
  fetch.mockImplementation((request) => {
    if (request.url.match('api.scripture.api.bible')) {
      return resolveWith(apolloDatasourceMocks.Scripture(), request.url);
    }
    return Promise.reject();
  });
};

const apolloServerEnvMocked = {
  ...apolloServerEnv,
  Response: fetch.Response,
  fetch,
};

module.exports = apolloServerEnvMocked;
