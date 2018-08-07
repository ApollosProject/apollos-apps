import fetch from 'jest-fetch-mock';

import * as apolloDatasourceMocks from './apollo-datasource-mocks';
import * as rockMocks from './rock-api-mocks';

const apolloServerEnv = require.requireActual('apollo-server-env');

const resolveWith = (data, url) =>
  Promise.resolve(
    new apolloServerEnv.Response(JSON.stringify(data), {
      url,
      status: 200,
      statusText: 'OK',
      headers: new apolloServerEnv.Headers({
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

fetch.mockRockDataSourceAPI = () => {
  fetch.mockImplementation((request) => {
    const url = request.url;
    if (!url.match(Constants.ROCK_API)) return Promise.reject();

    if (url.match('api/ContentChannels/\\d')) {
      return resolveWith(rockMocks.contentChannel(), url);
    }

    if (url.match('api/ContentChannels')) {
      return resolveWith([rockMocks.contentChannel()], url);
    }

    if (url.match('api/ContentChannelItems/test-case-no-attributes')) {
      const mock = rockMocks.contentItem();
      mock.AttributeValues = {};
      mock.Attributes = {};
      return resolveWith(mock, url);
    }

    if (url.match('api/ContentChannelItems/\\d')) {
      return resolveWith(rockMocks.contentItem(), url);
    }

    if (url.match('api/ContentChannelItems')) {
      return resolveWith([rockMocks.contentItem()], url);
    }

    if (url.match('api/ContentChannelItemAssociations')) {
      return resolveWith([rockMocks.contentChannelItemAssociation()], url);
    }

    if (url.match('api/People/GetCurrentPerson')) {
      return resolveWith(rockMocks.people(), url);
    }

    if (url.match('api/People/\\d')) {
      return resolveWith(rockMocks.people(), url);
    }

    if (url.match('api/People')) {
      if (request.method === 'POST') {
        const { Email } = JSON.parse(request.body);
        if (!Email) {
          const response = new fetch.Response('');
          response.status = 400;
          return Promise.reject(response);
        }
        return resolveWith({ personId: 35 }, url);
      }

      return resolveWith([rockMocks.people()], url);
    }

    if (url.match('api/UserLogins')) {
      if (request.method === 'POST') {
        const { UserName } = JSON.parse(request.body);
        if (!UserName) {
          const response = new fetch.Response('');
          response.status = 400;
          return Promise.reject(response);
        }
        return resolveWith({ id: 21 }, url);
      }
      const identity = url // identity = UserName
        .split('eq')
        .pop()
        .trim(' '); // EXAMPLE URL: /api/UserLogins?$filter=UserName eq 'isaac.hardy@newspring.cc'
      if (!identity) {
        const response = new fetch.Response('');
        response.status = 400;
        return Promise.reject(response);
      }
      if (identity === `'isaac.hardy@newspring.cc'`)
        return resolveWith([rockMocks.userLogins()], url);

      return resolveWith([], url);
    }

    return Promise.reject();
  });
};

const apolloServerEnvMocked = {
  ...apolloServerEnv,
  fetch,
};

module.exports = apolloServerEnvMocked;
