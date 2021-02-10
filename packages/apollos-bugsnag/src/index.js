/* eslint-disable class-methods-use-this, no-unused-expressions, no-param-reassign */
import ApollosConfig from '@apollosproject/config';
import { get, fromPairs } from 'lodash';
import Bugsnag from '@bugsnag/js';

const isDev =
  process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';

if (ApollosConfig.BUGSNAG && ApollosConfig.BUGSNAG.API_KEY) {
  Bugsnag.start({
    apiKey: ApollosConfig.BUGSNAG.API_KEY,
    releaseStage: process.env.RELEASE_STAGE || 'development',
    ...ApollosConfig.BUGSNAG.OPTIONS,
  });
} else {
  console.warn(`
You are trying to use the bugsnag config without a bugsnag API key. Add the following to you config.yml
\`\`\`
BUGSNAG:
  API_KEY: (api key here)
  OPTIONS: {}
\`\`\`
`);
}

export const report = (error, metaData, beforeSend) => {
  Bugsnag.notify(error, (event) => {
    Object.keys(metaData).forEach((key) => {
      event.addMetadata(key, metaData[key]);
    });
    beforeSend(event);
  });
};

export class BugsnagPlugin {
  requestDidStart() {
    return {
      didEncounterErrors({ errors, request }) {
        const headers = fromPairs(Array.from(request.http.headers.entries()));
        errors.forEach((error) => {
          isDev && console.log(error);
          report(
            error,
            {
              'GraphQL Info': {
                query: request.query,
                location: JSON.stringify(error.locations),
                variables: request.variables,
                operationName: request.operationName,
              },
              'Auth Error Info': get(error, 'extensions.exception.userContext'),
              Headers: headers,
            },
            (err) => {
              const ip = get(headers, 'fastly-client-ip', 'unknown');
              err.setUser(ip);
              err.addMetadata(
                'user',
                'appVersion',
                get(headers, 'user-agent', 'unknown')
              );
            }
          );
        });
      },
    };
  }
}
