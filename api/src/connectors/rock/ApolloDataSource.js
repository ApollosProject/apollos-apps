import { RESTDataSource } from 'apollo-datasource-rest';
import withQuery from 'with-query';
import { mapKeys, mapValues, camelCase } from 'lodash';

import { ROCK_API, ROCK_TOKEN } from './constants';
import RequestBuilder from './RequestBuilder';

export default class RockApolloDataSource extends RESTDataSource {
  get baseURL() {
    return `${ROCK_API}/${this.resource}`;
  }

  willSendRequest(request) {
    request.headers.set('Authorization-Token', ROCK_TOKEN);
    request.headers.set('user-agent', 'Apollos');
    request.headers.set('Content-Type', 'application/json');
  }

  normalize = (data) => {
    if (Array.isArray(data)) return data.map(this.normalize);
    if (typeof data !== 'object') return data;
    const normalizedValues = mapValues(data, this.normalize);
    return mapKeys(normalizedValues, (value, key) => camelCase(key));
  };

  didReceiveResponse(response, request) {
    // Can't use await b/c of `super` keyword
    return super
      .didReceiveResponse(response, request)
      .then((parsedResponse) => this.normalize(parsedResponse));
  }

  request = (resource = '') =>
    new RequestBuilder({
      resource,
      connector: this,
    });
}
