import { Amplitude } from '@amplitude/react-native';
import {
  getVersion,
  getBundleId,
  getApplicationName,
} from 'react-native-device-info';
import ApollosConfig from '@apollosproject/config';
import { gql } from '@apollo/client';
import { get } from 'lodash';

const ampInstance = Amplitude.getInstance();
ampInstance.init(ApollosConfig.AMPLITUDE_KEY);

export const track = ({ eventName, properties = null }) =>
  ampInstance.logEvent(eventName, properties);

export const identify = ({ client }) => {
  const data = client.readQuery({
    query: gql`
      query GetAnalyticsUser {
        currentUser {
          id
          profile {
            id
            campus {
              id
              name
            }
          }
        }
      }
    `,
  });

  // The functions called next throw an error in development, so we bypass them early.
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'testing'
  ) {
    return;
  }

  ampInstance.setUserId(get(data, 'currentUser.profile.id'));

  ampInstance.setUserProperties({
    campusName: get(data, 'currentUser.profile.campus.name'),
    appVersion: getVersion(),
    bundleId: getBundleId(),
    applicationName: getApplicationName(),
  });
};
