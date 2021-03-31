import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { ApolloConsumer } from '@apollo/client';

import {
  TRACK as TRACK_SERVER,
  IDENTIFY as IDENTIFY_SERVER,
} from './serverMutations';
import {
  TRACK as TRACK_CLIENT,
  IDENTIFY as IDENTIFY_CLIENT,
} from './clientMutations';

const anonymousId = DeviceInfo.getUniqueId();

const deviceInfo = {
  platform: Platform.OS === 'ios' ? 'iOS' : 'Android',
  deviceId: anonymousId,
  deviceModel: DeviceInfo.getModel(),
  osVersion: DeviceInfo.getSystemVersion(),
  appVersion: DeviceInfo.getVersion(),
};

export const AnalyticsContext = React.createContext({
  track: () => {},
  identify: () => {},
});

export const objectToGqlInput = (props = {}) =>
  Object.keys(props).map((key) => ({
    field: key,
    value: props[key],
  }));

export const gqlInputToObject = (props = []) =>
  props.reduce((acum, { field, value }) => ({ ...acum, [field]: value }), {});

// handy wrapper around track mutations
export const track = ({ client, eventName, properties }) =>
  client.mutate({
    mutation: TRACK_CLIENT,
    variables: {
      eventName,
      properties: objectToGqlInput(properties),
    },
  });

export const identify = ({ client }) =>
  client.mutate({ mutation: IDENTIFY_CLIENT });

const createTrack = ({ client }) => ({ eventName, properties }) =>
  track({ eventName, properties, client });

const createIdentify = ({ client }) => () => identify({ client });

export const createResolvers = ({
  trackFunctions,
  identifyFunctions,
  useServerAnalytics = true,
}) => ({
  Mutation: {
    track: async (root, { properties, eventName }, { client }) => {
      trackFunctions.forEach((func) => {
        if (typeof func !== 'function') {
          console.warn(
            'Arguments passed to `trackFunctions` must be functions'
          );
        } else {
          func({ eventName, properties: gqlInputToObject(properties) });
        }
      });
      if (useServerAnalytics) {
        await client.mutate({
          mutation: TRACK_SERVER,
          variables: {
            input: {
              anonymousId,
              deviceInfo,
              eventName,
              properties,
            },
          },
        });
      }
      return null;
    },

    identify: async (root, args, { client }) => {
      identifyFunctions.forEach((func) => {
        if (typeof func !== 'function') {
          console.warn(
            'Arguments passed to `identifyFunctions` must be functions'
          );
        } else {
          func();
        }
      });
      if (useServerAnalytics) {
        await client.mutate({
          mutation: IDENTIFY_SERVER,
          variables: {
            input: {
              anonymousId,
              deviceInfo,
            },
          },
        });
      }
      return null;
    },
  },
});

const Provider = ({
  children,
  trackFunctions,
  identifyFunctions,
  useServerAnalytics,
}) => (
  <ApolloConsumer>
    {(client) => {
      client.addResolvers(
        createResolvers({
          trackFunctions,
          identifyFunctions,
          useServerAnalytics,
        })
      );
      return (
        <AnalyticsContext.Provider
          value={{
            track: createTrack({ client }),
            identify: createIdentify({ client }),
          }}
        >
          {children}
        </AnalyticsContext.Provider>
      );
    }}
  </ApolloConsumer>
);

export const useTrack = () => {
  const ctx = useContext(AnalyticsContext);
  return ctx.track;
};

Provider.propTypes = {
  children: PropTypes.node,
  trackFunctions: PropTypes.arrayOf(PropTypes.func),
  identifyFunctions: PropTypes.arrayOf(PropTypes.func),
  useServerAnalytics: PropTypes.bool,
};

Provider.defaultProps = {
  trackFunctions: [],
  identifyFunctions: [],
  useServerAnalytics: true,
};

export const AnalyticsConsumer = AnalyticsContext.Consumer;

export default Provider;
