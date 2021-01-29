import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_VERTICAL_PRAYER_LIST_FEATURE from './getVerticalPrayerListFeature';

import VerticalPrayerListFeatureConnected from '.';

jest.mock('@apollosproject/ui-prayer', () => ({
  PrayerScreen: () => null,
}));

describe('VerticalPrayerListFeatureConnected component', () => {
  it('renders VerticalPrayerListFeatureConnected', async () => {
    const mock = {
      request: {
        query: GET_VERTICAL_PRAYER_LIST_FEATURE,
        variables: { featureId: 'VerticalPrayerListFeature:123' },
      },
      result: {
        data: {
          node: {
            __typename: 'VerticalPrayerListFeature',
            id: 'VerticalPrayerListFeature:123',
            title: 'title',
            subtitle: 'subtitle',
            prayers: [
              {
                __typename: 'PrayerRequest',
                id: 'PrayerRequest:123',
                isPrayed: false,
                requestor: {
                  __typename: 'AuthenticatedUser',
                  id: 'AuthenticatedUser:123',
                  firstName: 'Michael',
                  nickName: '',
                  photo: {
                    __typename: 'ImageMedia',
                    uri: '',
                  },
                },
                text: 'prayer 1',
              },
              {
                __typename: 'PrayerRequest',
                id: 'PrayerRequest:456',
                isPrayed: false,
                requestor: {
                  __typename: 'AuthenticatedUser',
                  id: 'AuthenticatedUser:123',
                  firstName: 'Michael',
                  nickName: '',
                  photo: {
                    __typename: 'ImageMedia',
                    uri: '',
                  },
                },
                text: 'prayer 2',
              },
            ],
          },
        },
      },
    };

    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <VerticalPrayerListFeatureConnected
          featureId={'VerticalPrayerListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
