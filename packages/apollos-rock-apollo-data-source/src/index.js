/* eslint-disable class-methods-use-this */
import https from 'https';
import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';

import { get, mapKeys, mapValues, camelCase } from 'lodash';
import { fetch } from 'apollo-server-env';
import { createCursor, parseCursor } from './cursor';

import RequestBuilder from './request-builder';

export { RockLoggingExtension, parseKeyValueAttribute } from './utils';

const { ROCK } = ApollosConfig;

let ROCK_AGENT;
if (get(ROCK, 'USE_AGENT', true)) {
  ROCK_AGENT = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 1500,
    maxSockets: 70,
  });
}

export default class RockApolloDataSource extends RESTDataSource {
  // Subclasses can set this to true to force all requests to turn extended responses.
  expanded = false;

  callCount = 0;

  calls = {};

  baseURL = ROCK.API_URL;

  rockToken = ROCK.API_TOKEN;

  nodeFetch = fetch;

  agent = ROCK_AGENT;

  ORIGIN_TYPE = 'rock';

  didReceiveResponse(response, request) {
    // Can't use await b/c of `super` keyword
    return super
      .didReceiveResponse(response, request)
      .then((parsedResponse) => this.normalize(parsedResponse));
  }

  willSendRequest(request) {
    this.callCount += 1;
    if (!this.calls[request.path]) {
      this.calls[request.path] = 0;
    }
    this.calls[request.path] += 1;

    if (!request.headers.has('Authorization-Token')) {
      request.headers.set('Authorization-Token', this.rockToken);
    }
    request.headers.set('user-agent', 'Apollos');
    request.headers.set('Content-Type', 'application/json');
    // Use an HTTP agent for keepAlive
    if (get(ROCK, 'USE_AGENT', true)) {
      request.agent = ROCK_AGENT;
    }
  }

  normalize = (data) => {
    if (Array.isArray(data)) return data.map(this.normalize);
    if (typeof data !== 'object' || data === null) return data;
    const normalizedValues = mapValues(data, this.normalize);
    return mapKeys(normalizedValues, (value, key) => camelCase(key));
  };

  request(resource = this.resource) {
    return new RequestBuilder({
      resource,
      connector: this,
      defaultOptions: this.expanded ? { loadAttributes: 'expanded' } : null,
    });
  }

  async paginate({ cursor, args: { after, first = 20 } = {} }) {
    let skip = 0;
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
        skip = parsed.position + 1;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }

    // temporarily store the select parameter to
    // put back after "Id" is selected for the count
    const edges = cursor
      ? cursor
          .top(first)
          .skip(skip)
          .transform((result) =>
            result.map((node, i) => ({
              node,
              cursor: createCursor({ position: i + skip }),
            }))
          )
          .get()
      : [];

    return {
      getTotalCount: cursor.count,
      edges,
    };
  }
}
