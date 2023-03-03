import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import HorizontalLikedContentFeed from '.';

describe('HorizontalLikedContentFeed', () => {
  it('renders a HorizontalLikedContentFeed', () => {
    const props = {
      content: [
        {
          id: 'UniversalContentItem:4148aeb9482181025e9cad42826e676a',
          title: 'Making Prayer a Spiritual Habit',
          __typename: 'UniversalContentItem',
          coverImage: {
            sources: [
              {
                uri:
                  'https://apollosrock.newspring.cc/GetImage.ashx?guid=55be1fd5-d8eb-43a6-aa70-f8e27bb63d31',
              },
            ],
          },
          sharing: {
            title: 'Making Prayer a Spiritual Habit',
            message: '',
            url: 'https://apollosrock.newspring.cc/',
          },
        },
        {
          id: 'UniversalContentItem:9dbdc4e565dcaa3c9b17eb5ae42de96e',
          title: 'Vacations and Your Budget',
          __typename: 'UniversalContentItem',
          coverImage: {
            sources: [
              {
                uri:
                  'https://apollosrock.newspring.cc/GetImage.ashx?guid=993efb47-47ec-4dec-a3d3-47bcacfbd58e',
              },
            ],
          },
          sharing: {
            title: 'Vacations and Your Budget',
            message: '',
            url: 'https://apollosrock.newspring.cc/',
          },
        },
      ],
      name: 'Liked Content',
      navigation: jest.fn(),
      isLoading: false,
    };

    const tree = renderer.create(
      <Providers MockedProvider={MockedProvider}>
        <HorizontalLikedContentFeed {...props} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders a loading state', () => {
    const props = {
      content: [
        {
          id: 'UniversalContentItem:4148aeb9482181025e9cad42826e676a',
          title: 'Making Prayer a Spiritual Habit',
          coverImage: {
            sources: [
              {
                uri:
                  'https://apollosrock.newspring.cc/GetImage.ashx?guid=55be1fd5-d8eb-43a6-aa70-f8e27bb63d31',
              },
            ],
          },
          sharing: {
            title: 'Making Prayer a Spiritual Habit',
            message: '',
            url: 'https://apollosrock.newspring.cc/',
          },
        },
        {
          id: 'UniversalContentItem:9dbdc4e565dcaa3c9b17eb5ae42de96e',
          title: 'Vacations and Your Budget',
          coverImage: {
            sources: [
              {
                uri:
                  'https://apollosrock.newspring.cc/GetImage.ashx?guid=993efb47-47ec-4dec-a3d3-47bcacfbd58e',
              },
            ],
          },
          sharing: {
            title: 'Vacations and Your Budget',
            message: '',
            url: 'https://apollosrock.newspring.cc/',
          },
        },
      ],
      name: 'Liked Content',
      navigation: jest.fn(),
      isLoading: true,
    };

    const tree = renderer.create(
      <Providers MockedProvider={MockedProvider}>
        <HorizontalLikedContentFeed {...props} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
