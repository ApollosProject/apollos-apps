import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import { Providers, renderWithApolloData } from '../testUtils';

import { PrimaryActionButton } from '../PrayerScreen';
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

describe('The AddPrayerCard component', () => {
  it('should render', async () => {
    const tree = renderWithApolloData(
      <Providers mocks={mocks}>
        <AddPrayerCard />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should accept a title', async () => {
    const tree = renderWithApolloData(
      <Providers mocks={mocks}>
        <AddPrayerCard title="Custom" />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render a custom component', async () => {
    const tree = renderWithApolloData(
      <Providers mocks={mocks}>
        <AddPrayerCard PrayerCardComponent={(props) => JSON.stringify(props)} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render a custom skipText', async () => {
    const tree = renderWithApolloData(
      <Providers mocks={mocks}>
        <AddPrayerCard skipText="💣" />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render avatars', async () => {
    const tree = renderWithApolloData(
      <Providers mocks={mocks}>
        <AddPrayerCard avatars={[{ uri: 'my-image.jpg' }]} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render a custom post-add component', async () => {
    const tree = renderWithApolloData(
      <Providers mocks={mocks}>
        <AddPrayerCard
          AddedPrayerComponent={(props) => JSON.stringify(props)}
        />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should create a prayer', async () => {
    const tree = renderer.create(
      <Providers mocks={mocks}>
        <AddPrayerCard />
      </Providers>
    );

    const button = tree.root.findByType(PrimaryActionButton);
    button.props.onPress();

    await wait(1);

    expect(tree).toMatchSnapshot();
  });
});
