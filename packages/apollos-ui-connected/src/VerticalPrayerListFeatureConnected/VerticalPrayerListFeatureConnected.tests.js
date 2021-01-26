import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_VERTICAL_PRAYER_LIST_FEATURE from './getVerticalPrayerListFeature';

import VerticalPrayerListFeatureConnected from '.';

describe('VerticalPrayerListFeatureConnected component', () => {
  it('renders VerticalPrayerListFeatureConnected', async () => {
    const mock = {
      request: {
        query: GET_VERTICAL_PRAYER_LIST_FEATURE,
      },
      result: {
        data: {
          node: {
            __typename: 'UserPrayersFeature',
            id: 'UserPrayersFeature:123',
            title: 'title',
            subtitle: 'subtitle',
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
        <VerticalPrayerListFeatureConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
