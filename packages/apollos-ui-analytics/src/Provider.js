import React from 'react';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { track, identify } from './serverMutations';
import {
  track as trackClient,
  identify as identifyClient,
} from './clientMutations';

const anonymousId = DeviceInfo.getUniqueID();

const deviceInfo = {
  platform: Platform.OS === 'ios' ? 'iOS' : 'Android',
  deviceId: anonymousId,
  deviceModel: DeviceInfo.getModel(),
  osVersion: DeviceInfo.getSystemVersion(),
  appVersion: DeviceInfo.getVersion(),
};

const AnalyticsContext = React.createContext({ track: () => {}, identify });

export const objectToGqlInput = (props = {}) =>
  Object.keys(props).map((key) => ({
    field: key,
    value: props[key],
  }));

export const gqlInputToObject = (props = []) =>
  props.reduce((acum, { field, value }) => ({ ...acum, [field]: value }), {});

const createTrack = ({ client }) => ({ eventName, properties }) => {
  const variables = {
    properties: objectToGqlInput(properties),
    eventName,
  };
  return client.mutate({ mutation: trackClient, variables });
};

const createIdentify = ({ client }) => () =>
  client.mutate({ mutation: identifyClient });

const createResolvers = ({ trackFunctions, identifyFunctions }) => ({
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
      await client.mutate({
        mutation: track,
        variables: {
          input: {
            anonymousId,
            deviceInfo,
            eventName,
            properties,
          },
        },
      });
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
      await client.mutate({
        mutation: identify,
        variables: {
          input: {
            anonymousId,
            deviceInfo,
          },
        },
      });
      return null;
    },
  },
});

const Provider = ({ children, trackFunctions, identifyFunctions }) => (
  <ApolloConsumer>
    {(client) => {
      client.addResolvers(
        createResolvers({ trackFunctions, identifyFunctions })
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

Provider.propTypes = {
  children: PropTypes.node,
  trackFunctions: PropTypes.arrayOf(PropTypes.func),
  identifyFunctions: PropTypes.arrayOf(PropTypes.func),
};

Provider.defaultProps = {
  trackFunctions: [],
  identifyFunctions: [],
};

export const AnalyticsConsumer = AnalyticsContext.Consumer;

export default Provider;
