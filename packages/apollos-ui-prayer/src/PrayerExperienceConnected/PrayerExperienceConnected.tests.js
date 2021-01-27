import React from 'react';
import wait from 'waait';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { act } from 'react-test-renderer';

import { PrayerDialogScreen } from '../screens';
import { PRAY } from '../screens/PrayerScreen';
import { GET_USER_PHOTO } from '../screens/AddPrayerScreenConnected';
import GET_PRAYER_FEATURE from './getPrayerFeature';
import PrayerExperienceConnected from '.';

// mock this so the AvatarCloud looks the same every time
global.Math.random = () => 0.5;

jest.mock('react-native-device-info', () => ({
  getModel: jest.fn(),
  getUniqueId: jest.fn(),
  getSystemVersion: jest.fn(),
  getVersion: jest.fn(),
}));

jest.mock('@apollosproject/config', () => {
  const gql = require.requireActual('graphql-tag');
  return {
    FRAGMENTS: {
      PRAYER_LIST_FEATURE_FRAGMENT: gql`
        fragment PrayerListFeatureFragment on PrayerListFeature {
          id
          title
          subtitle
          isCard
          prayers {
            __typename
            id
            text
            isPrayed
            requestor {
              id
              nickName
              firstName
              photo {
                uri
              }
            }
          }
        }
      `,
    },
  };
});

const mocks = [
  {
    request: {
      query: GET_USER_PHOTO,
    },
    result: {
      data: {
        currentUser: {
          id: 'AuthenticatedUser:1234',
          __typename: 'AuthenticatedUser',
          profile: {
            id: 'Person:1234',
            __typename: 'Person',
            photo: {
              __typename: 'ImageMediaSource',
              uri: 'https://1234.image.com',
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: PRAY,
      variables: { prayerId: 'PrayerRequest:1' },
    },
    result: () => ({
      data: {
        prayed: {
          success: true,
        },
      },
    }),
  },
  {
    request: {
      query: PRAY,
      variables: { prayerId: 'PrayerRequest:2' },
    },
    result: () => ({
      data: {
        prayed: {
          success: true,
        },
      },
    }),
  },
  {
    request: {
      query: PRAY,
      variables: { prayerId: 'PrayerRequest:3' },
    },
    result: () => ({
      data: {
        prayed: {
          success: true,
        },
      },
    }),
  },
  {
    request: {
      query: PRAY,
      variables: { prayerId: 'PrayerRequest:4' },
    },
    result: () => ({
      data: {
        prayed: {
          success: true,
        },
      },
    }),
  },
  {
    request: {
      query: GET_PRAYER_FEATURE,
      variables: { id: 'PrayerListFeature:123' },
    },
    result: () => ({
      data: {
        currentUser: {
          id: 'AuthenticatedUser:1234',
          __typename: 'AuthenticatedUser',
          profile: {
            id: 'Person:1234',
            __typename: 'Person',
            photo: {
              __typename: 'ImageMediaSource',
              uri: 'https://1234.image.com',
            },
          },
        },
        feature: {
          __typename: 'PrayerListFeature',
          id: 'PrayerListFeature:123',
          title: 'Daily Prayer',
          subtitle: 'What will you pray for?!',
          isCard: true,
          prayers: [
            {
              __typename: 'PrayerRequest',
              id: 'PrayerRequest:1',
              text: 'I pray for you.',
              isPrayed: false,
              requestor: {
                __typename: 'Person',
                id: 'Person:123',
                nickName: 'Father',
                firstName: 'Father',
                photo: {
                  __typename: 'ImageMediaSource',
                  uri: 'https://123.image-url.com',
                },
              },
            },
            {
              __typename: 'PrayerRequest',
              id: 'PrayerRequest:2',
              text: 'I pray for you.',
              isPrayed: true,
              requestor: {
                __typename: 'Person',
                id: 'Person:123',
                nickName: 'Father',
                firstName: 'Father',
                photo: {
                  __typename: 'ImageMediaSource',
                  uri: 'https://123.image-url.com',
                },
              },
            },
            {
              __typename: 'PrayerRequest',
              id: 'PrayerRequest:3',
              text: 'I pray for you.',
              isPrayed: false,
              requestor: {
                __typename: 'Person',
                id: 'Person:123',
                nickName: 'Father',
                firstName: 'Father',
                photo: null,
              },
            },
            {
              __typename: 'PrayerRequest',
              id: 'PrayerRequest:4',
              text: 'Prayer with null requestor (edge case).',
              isPrayed: false,
              requestor: null,
            },
          ],
        },
      },
    }),
  },
];

describe('The PrayerExperienceConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <PrayerExperienceConnected id="PrayerListFeature:123" />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('hides onboarding', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <PrayerExperienceConnected
          id="PrayerListFeature:123"
          showOnboarding={false}
        />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('closes onboarding when button is pressed', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <PrayerExperienceConnected id="PrayerListFeature:123" />
      </Providers>
    );

    tree.update(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <PrayerExperienceConnected id="PrayerListFeature:123" />
      </Providers>
    );
    const screen = tree.root.findByType(PrayerDialogScreen);
    screen.props.onPressPrimary();

    await act(async () => wait(1));

    expect(tree).toMatchSnapshot();
  });

  it('prays', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <PrayerExperienceConnected id="PrayerListFeature:123" />
      </Providers>
    );

    tree.update(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <PrayerExperienceConnected id="PrayerListFeature:123" />
      </Providers>
    );
    const screens = tree.root.findAllByProps({
      primaryActionText: '🙏 Pray',
    });

    screens.forEach((screen) => screen.props.onPressPrimary());

    await act(async () => wait(1));

    expect(tree).toMatchSnapshot();
  });
});
