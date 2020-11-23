import React from 'react';
import wait from 'waait';

import { act } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import PrayerCard from '../../PrayerCard';

import AddPrayerCard, { GET_USER_PHOTO, ADD_PRAYER } from '.';

jest.mock('react-native-device-info', () => ({
  getModel: jest.fn(),
  getUniqueId: jest.fn(),
  getSystemVersion: jest.fn(),
  getVersion: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: ADD_PRAYER,
      variables: { prayer: 'my prayer' },
    },
    result: () => ({
      data: {
        addPrayer: {
          __typename: 'PrayerRequest',
          id: 'PrayerRequest:your-prayer',
        },
      },
    }),
  },
  {
    request: {
      query: GET_USER_PHOTO,
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
      },
    }),
  },
];

describe('The AddPrayerScreenConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <AddPrayerCard />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should accept a title', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <AddPrayerCard title="Custom" />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render a custom component', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <AddPrayerCard PrayerCardComponent={(props) => JSON.stringify(props)} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render a custom skipText', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <AddPrayerCard skipText="💣" />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render avatars', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <AddPrayerCard avatars={[{ uri: 'my-image.jpg' }]} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render a custom post-add component', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <AddPrayerCard
          AddedPrayerComponent={(props) => JSON.stringify(props)}
        />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should create a prayer', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <AddPrayerCard />
      </Providers>
    );

    const prayerCard = tree.root.findByType(PrayerCard);
    prayerCard.props.onPrayerChangeText('my prayer');

    await act(async () => wait(1));

    const button = tree.root.findByProps({
      primaryActionText: 'Share prayer',
    });

    button.props.onPressPrimary();

    await act(async () => wait(1));

    expect(tree).toMatchSnapshot();
  });
});
