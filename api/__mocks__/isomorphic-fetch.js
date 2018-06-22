import 'isomorphic-fetch';
import fetch from 'jest-fetch-mock';

import { Constants } from '../src/connectors/rock';

import * as rockMocks from './rock-api-mocks';

const resolveWith = (data) =>
  Promise.resolve(new fetch.Response(JSON.stringify(data)));

fetch.mockRockAPI = () => {
  fetch.mockImplementation((url, options) => {
    if (!url.match(Constants.ROCK_API)) return Promise.reject();

    if (url.match('api/ContentChannels/\\d')) {
      return resolveWith(rockMocks.contentChannel());
    }

    if (url.match('api/ContentChannels')) {
      return resolveWith([rockMocks.contentChannel()]);
    }

    if (url.match('api/ContentChannelItems/test-case-no-attributes')) {
      const mock = rockMocks.contentItem();
      mock.AttributeValues = {};
      mock.Attributes = {};
      return resolveWith(mock);
    }

    if (url.match('api/ContentChannelItems/\\d')) {
      return resolveWith(rockMocks.contentItem());
    }

    if (url.match('api/ContentChannelItems')) {
      return resolveWith([rockMocks.contentItem()]);
    }

    if (url.match('api/ContentChannelItemAssociations')) {
      return resolveWith([rockMocks.contentChannelItemAssociation()]);
    }

    if (url.match('api/Auth/Login')) {
      const body = JSON.parse(options.body);
      const response = new fetch.Response('');
      if (body.Password === 'good') {
        response.headers.set('set-cookie', 'some cookie');
        return Promise.resolve(response);
      }
      response.status = 401;
      return Promise.reject(response);
    }

    if (url.match('api/People/GetCurrentPerson')) {
      return resolveWith(rockMocks.people());
    }

    if (url.match('api/People/\\d')) {
      return resolveWith(rockMocks.people());
    }

    if (url.match('api/People')) {
      if (options.method === 'POST') {
        return resolveWith({ personId: 35 });
      }
      return resolveWith([rockMocks.people()]);
    }

    if (url.match('api/UserLogins')) {
      if (options.method === 'POST') {
        return resolveWith({ id: 21 });
      }
      const identity = url.split('eq').pop();
      if (identity.trim(' ') === `'isaac.hardy@newspring.cc'`)
        return resolveWith([rockMocks.userLogins()]);

      return resolveWith([]);
    }

    return Promise.reject();
  });
};

export default fetch;
