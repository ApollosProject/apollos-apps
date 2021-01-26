import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_USER_PRAYERS_FEATURE from './getUserPrayersFeature';

import UserPrayersFeatureConnected from '.';

describe('UserPrayersFeatureConnected component', () => {
  it('renders UserPrayersFeatureConnected', async () => {
    const mock = {
      request: {
        query: GET_USER_PRAYERS_FEATURE,
      },
      result: {
        data: {
          node: {
            __typename: 'UserPrayersFeature',
            id: 'UserPrayersFeature:123',
            title: 'Pray for brad',
            subtitle: 'This is a prayer...',
            avatar: {
              __typename: 'ImageMediaSource',
              id: 'ImageMediaSource:123',
              uri: 'https://picturesite.com',
            },
            prayers: [
              { __typename: 'PrayerRequest', id: 'PrayerRequest:123' },
              { __typename: 'PrayerRequest', id: 'PrayerRequest:456' },
            ],
          },
        },
      },
    };
    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <UserPrayersFeatureConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
