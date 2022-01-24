/* eslint-disable class-methods-use-this, no-unused-expressions */
import { fetchChurchConfig } from '@apollosproject/config';
import { get, fromPairs } from 'lodash';
import Bugsnag from '@bugsnag/js';

const isDev =
  process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';

const globalConfig = fetchChurchConfig({ churchSlug: 'global' });

if (globalConfig.BUGSNAG && globalConfig.BUGSNAG.API_KEY)
  Bugsnag.start({
    apiKey: globalConfig.BUGSNAG.API_KEY,
    ...globalConfig.BUGSNAG.OPTIONS,
  });

export const report = (error, metaData, beforeSend = () => ({})) => {
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
      didEncounterErrors({ errors, request, context }) {
        const headers = fromPairs(Array.from(request.http.headers.entries()));
        const churchSlug = context.church?.slug;
        errors.forEach((error) => {
          isDev && console.log(error); // eslint-disable-line no-console
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
              'Church Info': { churchSlug },
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
