/* eslint-disable class-methods-use-this */
import https from 'https';
import { RESTDataSource } from 'apollo-datasource-rest';

import { mapKeys, mapValues, camelCase } from 'lodash';
import { fetch } from 'apollo-server-env';
import { createCursor, parseCursor } from './cursor';

import RequestBuilder from './request-builder';

export { RockLoggingExtension, parseKeyValueAttribute } from './utils';

const ROCK_AGENT = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1500,
  maxSockets: 70,
});

export default class RockApolloDataSource extends RESTDataSource {
  // Subclasses can set this to true to force all requests to turn extended responses.
  expanded = false;

  // Sublasses can use this to load specific attributes.
  attributesLoaded = [];

  callCount = 0;

  calls = {};

  nodeFetch = fetch;

  agent = ROCK_AGENT;

  ORIGIN_TYPE = 'rock';

  // Helper method :)
  get Config() {
    return this.context.dataSources.Config;
  }

  get baseURL() {
    return `${this.Config.ROCK.URL}/api`;
  }

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
      request.headers.set('Authorization-Token', this.Config.ROCK.API_TOKEN);
    }
    request.headers.set('user-agent', 'Apollos');
    request.headers.set('Content-Type', 'application/json');
    // Use an HTTP agent for keepAlive
    request.agent = ROCK_AGENT;
  }

  normalize = (data) => {
    if (Array.isArray(data)) return data.map(this.normalize);
    if (typeof data !== 'object' || data === null) return data;
    const normalizedValues = mapValues(data, this.normalize);
    return mapKeys(normalizedValues, (value, key) => camelCase(key));
  };

  buildDefaultOptions() {
    const defaultOptions = {};
    if (this.attributesLoaded?.length)
      defaultOptions.attributeKeys = this.attributesLoaded.join(',');
    if (this.expanded || this.attributesLoaded?.length)
      defaultOptions.loadAttributes = 'expanded';

    return defaultOptions;
  }

  request(resource = this.resource) {
    const defaultOptions = this.buildDefaultOptions();
    return new RequestBuilder({
      resource,
      connector: this,
      defaultOptions,
    });
  }

  async paginate({ cursor, args: { after, first = 20, orderBy } = {} }) {
    let skip = 0;
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
        skip = parsed.position + 1;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }
    const sortMap = {
      DATE: 'StartDateTime',
    };
    const sort = orderBy
      ? [
          {
            field: sortMap[orderBy.field],
            direction: orderBy.direction,
          },
        ]
      : [];

    // temporarily store the select parameter to
    // put back after "Id" is selected for the count
    const edges = cursor
      ? cursor
          .top(first)
          .skip(skip)
          .sort(sort)
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
